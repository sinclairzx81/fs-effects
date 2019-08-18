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

import { common_readdir, Item }    from './common_readdir'
import { join, resolve, relative } from 'path'

async function read_folder(folder: string): Promise<Item[]> {
    const items: Item[] = []
    for (const item of await common_readdir(folder)) {
        if (item.stat.isDirectory()) {
            items.push(item)
            items.push(...await read_folder(join(item.folder, item.path)))
        }
        if (item.stat.isFile()) {
            items.push(item)
        }
    }
    return items
}

/** Returns a recursive list of a folders contents. */
export async function common_readdir_flatmap(folder: string): Promise<Item[]> {
    return (await read_folder(folder))
        .map(item => ({
            folder: resolve(folder),
            path: relative(folder, join(item.folder, item.path)),
            stat: item.stat
        }))
}
