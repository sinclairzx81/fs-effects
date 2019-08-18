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

import { file_exists }             from './file_exists'
import { folder_exists }           from './folder_exists'
import { folder_create }           from './folder_create'
import { folder_delete }           from './folder_delete'
import { join, basename }          from 'path'
import { promisify }               from 'util'
import { rename }                  from 'fs'

const renameAsync = promisify(rename)

/** Moves the given folder into the remote folder. */
export async function folder_move_to(folder: string, remote: string): Promise<void> {
    const target = join(remote, basename(folder))
    if (!await folder_exists(folder)) {
        throw new Error(`Cannot move folder '${folder}' as it does not exist.`)
    }
    if(await file_exists(target)) {
        throw new Error(`Cannot move folder '${folder}' to '${target}' as a file exists at the target path.`)
    }
    if(await folder_exists(target)) {
        await folder_delete(target)
    }
    await folder_create(remote) // as assertion
    return renameAsync(folder, target)
}
