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

import { watch }   from 'fs'
import { resolve } from 'path'

class Debounce {
    private timer!:     NodeJS.Timer
    private processing: boolean
    private resets:     number
    constructor(private timeout: number, private max_resets: number = 256) {
        this.processing = false
        this.resets     = 0
    }
    public run(func: () => Promise<void>) {
        if(this.processing) { return }
        this.resets += 1
        clearTimeout(this.timer)
        if (this.resets >= this.max_resets) {
            throw Error(`Exceeded maximum debounce count on watch.`)
        }
        this.timer = setTimeout(async () => {
            this.resets = 0
            this.processing = true
            await func()
            this.processing = false
        }, this.timeout)
    }
}

export type RunFunction = (path: string) => Promise<void> | void

/** Watches the given folder or file and executes the given functions on change. */
export function watch_execute(path: string, funcs: RunFunction[], timeout: number): Promise<void> {
    return new Promise<void>((_, reject) => {
        const debounce = new Debounce(timeout)
        const watcher = watch(path, { recursive: true }, async (_, path) => {
            debounce.run(async () => {
                for (const func of funcs) {
                    try {
                        await func(resolve(path))
                    } catch(error) {
                        reject(error)
                        watcher.close()
                    }
                }
            })
        })
    })
}
