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

import { common_exists } from './common_exists'
import { common_stat }   from './common_stat'
import { promisify }     from 'util'
import { mkdir }         from 'fs'

const mkdirAsync = promisify(mkdir)

/** Creates the given folder. If the folder already exists, no action is taken. */
export async function folder_create(folder: string) {
  const exists = await common_exists(folder)
  if (exists && (await common_stat(folder)).isFile()) {
    throw new Error(`Cannot create folder '${folder}' as a file exists in this location.`)
  }
  if(!exists) {
      const mkdir_facade: Function = mkdirAsync // pending node 10 LTS
      return mkdir_facade(folder, { recursive: true })
  }
}
