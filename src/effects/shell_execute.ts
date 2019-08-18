/*--------------------------------------------------------------------------

MIT License

Copyright (c) fs-effects 2019 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---------------------------------------------------------------------------*/

import { spawn } from 'child_process'

function start_options(cmd: string): { command: string, options: string[] } {
    const components = cmd.split(' ')
        .map(component => component.trim())
        .filter(component => component.length > 0)
    if (/^win/.test(process.platform)) {
        const command = 'cmd'
        const options = ['/c', ...components]  
        return { command, options }      
    } else {
        const command = 'sh'
        const options = ['-c', components.join(' ')]
        return { command, options }
    }
}

export type OutFunction = (data: string) => void
export type ErrFunction = (data: string) => void

/** Executes the given shell command with the given options. */
export function shell_execute(command: string, out: OutFunction, err: ErrFunction, exitcode: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const options = start_options(command)
        const sub = spawn(options.command, options.options)
        sub.stdout.setEncoding('utf8')
        sub.stderr.setEncoding('utf8')
        sub.stdout.on('data',  (data: string) => out(data))
        sub.stderr.on('data',  (data: string) => err(data))
        sub.on('error', error => reject(error))
        sub.on('close', code => {
            if(code !== exitcode) {
                const error = new Error(`Shell command '${command}' ended with unexpected exit code. Expected ${exitcode}, got ${code}`)
                reject(error)
            } else {
                resolve()
            }
        })
        // terminate sub process on process exit.
        process.on('exit', () => {
            try { sub.kill() } catch { }
        })
    }) 
}