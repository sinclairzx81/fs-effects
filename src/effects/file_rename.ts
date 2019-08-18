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

import { common_exists }      from './common_exists'
import { common_stat }        from './common_stat'
import { file_create }        from './file_create'
import { rename }             from 'fs'
import { dirname, join }      from 'path'
import { promisify }          from 'util'

const renameAsync = promisify(rename)

/** Renames the given file to the given newname. If there are conflicts, an error is thrown. */
export async function file_rename(file: string, newname: string): Promise<void> {
    if((await common_exists(file)) && !(await common_stat(file)).isFile()) {
        throw Error(`Cannot rename file '${file}' to '${newname}' as '${file}' is a directory.`)
    }
    const newfile = join(dirname(file), newname)
    if(await common_exists(newfile)) {
        throw Error(`Cannot rename file '${file}' to '${newname}' as '${newfile}' already exists.`)
    }
    await file_create(newfile)       // assert file exists
    await renameAsync(file, newfile) // rename
}