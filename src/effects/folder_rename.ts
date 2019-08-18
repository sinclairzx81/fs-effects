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

import { file_exists }   from './file_exists'
import { folder_exists } from './folder_exists'
import { dirname, join } from 'path'
import { promisify }     from 'util'
import { rename }        from 'fs'

const renameAsync = promisify(rename)

/** Renames the given folder to the given newname. If there are conflicts, an error is thrown. */
export async function folder_rename(folder: string, newname: string): Promise<void> {
    const target = join(dirname(folder), newname)
    if(!await folder_exists(folder)) {
        throw Error(`Cannot rename '${folder}' as it does not exist.`)
    }
    if(await folder_exists(target)) {
        throw Error(`Cannot rename '${folder}' to '${newname}' as a folder with this name already exists.`)
    }
    if(await file_exists(target)) {
        throw Error(`Cannot rename '${folder}' to '${newname}' as a file with this name already exists.`)
    }
    await renameAsync(folder, target)
}