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

import { folder_create }     from './folder_create'
import { folder_exists }     from './folder_exists'
import { file_exists }       from './file_exists'
import { join, basename }    from 'path'
import { promisify }         from 'util'
import { rename }            from 'fs'

const renameAsync = promisify(rename)

/** Moves this file into the given folder. */
export async function file_move_to(file: string, folder: string): Promise<void> {
  const target = join(folder, basename(file))
  if(!await file_exists(file)) {
    throw new Error(`Cannot move file '${file}' as it does not exist.`)
  }
  if(await folder_exists(target)) {
    throw new Error(`Cannot move file '${file}' to '${target}' as a directory exists at the target path.`)
  }
  await folder_create(folder)         // create target folder
  await renameAsync(file, target)
}