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

import { folder_create } from '../../src/effects/folder_create'
import { folder_delete } from '../../src/effects/folder_delete'
import { Readable }      from 'stream'
import * as path         from 'path'

export const BASE = './public/test/roots/'

let root_index = 0
export async function run_root(func: (root: string, p: typeof path) => void) {
    const ROOT = path.join(BASE, `root_${root_index++}`)
    await folder_delete(ROOT)
    await folder_create(ROOT)
    await func(ROOT, path)
    await folder_delete(ROOT)
}

export function read_readable(readable: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const buffer: Buffer[] = []
        readable.on('data', data => buffer.push(data as Buffer))
        readable.on('error', (error: Error) => reject(error))
        readable.on('end', () => resolve(Buffer.concat(buffer)))
    })
}

export async function should_throw(func: () => Promise<void>) {
    let did_throw = false
    try {
        await func()
    } catch {
        did_throw = true
    }
    if(!did_throw) {
        throw Error('expected this code to throw')
    }
}