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

import { common_readable }     from './common_readable'
import { file_create }         from './file_create'
import { file_read }           from './file_read'
import { file_write }          from './file_write'
import { file_append }         from './file_append'
import { Readable }            from 'stream'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** Prepends content to the given file. If the file does not exist, it is created. */
export async function file_prepend(file: string, content: string | Buffer | Readable): Promise<void> {
    await file_create(file)
    const readable_0 = common_readable(content)
    const readable_1 = common_readable(await file_read(file))
    await file_write(file, readable_0)
    await file_append(file, readable_1)
}