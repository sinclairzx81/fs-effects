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

import { common_stat }    from './common_stat'
import { folder_exists }  from './folder_exists'
import { folder_copy_to } from './folder_copy_to'
import { file_copy_to }   from './file_copy_to'
import { readdir }        from 'fs'
import { promisify }      from 'util'
import { join }           from 'path'

const readdirAsync = promisify(readdir)

/** Copies the contents this folder into the given remote folder. */
export async function contents_copy_to(folder: string, remote: string): Promise<void> {
    if(!await folder_exists(folder)) {
        throw new Error(`Cannot copy contents from '${folder}' as the folder does not exist.`)
    }
    for(const content of await readdirAsync(folder)) {
        const path = join(folder, content)
        const stat = await common_stat(path)
        if(stat.isDirectory()) {
            await folder_copy_to(path, remote)
        }
        if(stat.isFile()) {
            await file_copy_to(path, remote)
        }
    }
}
