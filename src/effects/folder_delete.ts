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

import { common_readdir_flatmap } from './common_readdir_flatmap'
import { file_delete }            from './file_delete'
import { folder_exists }          from './folder_exists'
import { rmdir }                  from 'fs'
import { promisify }              from 'util'
import { join }                   from 'path'

const rmdirAsync = promisify(rmdir)

/** Deletes this folder. If not exists, then no action. */
export async function folder_delete(folder: string): Promise<void> {
  if(await folder_exists(folder)) {
    const items   = await common_readdir_flatmap(folder)
    const folders = items.filter(item => item.stat.isDirectory())
    const files   = items.filter(item => item.stat.isFile())
    for(const item of files) {
      const target = join(item.folder, item.path)
      await file_delete(target)
    }
    for(const item of folders.reverse()) {
      const target = join(item.folder, item.path)
      await rmdirAsync(target)
    }
    await rmdirAsync(folder)
  }
}
