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

import { common_readdir_flatmap }  from './common_readdir_flatmap'
import { file_exists }             from './file_exists'
import { folder_create }           from './folder_create'
import { folder_exists }           from './folder_exists'

import { resolve, join, basename } from 'path'
import { promisify }               from 'util'
import { copyFile }                from 'fs'

const copyFileAsync = promisify(copyFile)

/** Copies this folder into the given remote folder. */
export async function folder_copy_to(folder: string, remote: string): Promise<void> {
    if (!await folder_exists(folder)) {
        throw new Error(`Cannot copy folder '${folder}' as it does not exist.`)
    }
    const target = join(remote, basename(folder))
    if(await file_exists(target)) {
        throw new Error(`Cannot copy folder '${folder}' to '${target}' as a file exists at the target path.`)
    }
    await folder_create(target)
    for(const item of await common_readdir_flatmap(folder)) {
        const source = resolve(join(item.folder, item.path))
        const target = resolve(join(remote, basename(folder), item.path))
        if(item.stat.isDirectory()) {
            await folder_create(target)
        } else {
            await copyFileAsync(source, target)
        }
    }
}
