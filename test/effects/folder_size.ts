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

import { folder_size } from '../../src/effects/folder_size'
import { file_write }  from '../../src/effects/file_write'
import { run_root }    from '../support'
import { expect }      from 'chai'
import { folder_create } from '../../src/effects/folder_create';

describe('effects/folder_size', () => {
    it('should return folder size', async () => {
        await run_root(async (root, util) => {
            const folder = util.join(root, 'folder')
            const file0  = util.join(root, 'folder/file0')
            const file1  = util.join(root, 'folder/file1')
            const file2  = util.join(root, 'folder/folder/file0')
            const file3  = util.join(root, 'folder/folder/file1')
            
            await folder_create(folder)
            await file_write(file0, Buffer.alloc(1000))
            await file_write(file1, Buffer.alloc(1000))
            await file_write(file2, Buffer.alloc(1000))
            await file_write(file3, Buffer.alloc(1000))

            const size = await folder_size(folder)

            expect(size).to.eq(4000)
        })
    })
})