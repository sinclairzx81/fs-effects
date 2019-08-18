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

import { contents_copy_to } from '../../src/effects/contents_copy_to'
import { folder_create }    from '../../src/effects/folder_create'
import { folder_hash }      from '../../src/effects/folder_hash'
import { file_create }      from '../../src/effects/file_create'
import { run_root }         from '../support'
import { expect }           from 'chai'

describe('effects/contents_copy_to', () => {
    it('should copy folder contents', async () => {
        await run_root(async (root, util) => {
            const folder0 = util.join(root, 'folder0')
            const folder1 = util.join(root, 'folder1')

            // create files in source
            await folder_create(util.join(folder0, 'empty'))
            await file_create(util.join(folder0, 'folder1/file1'))
            await file_create(util.join(folder0, 'folder1/file2'))
            await file_create(util.join(folder0, 'folder1/file3'))
            await file_create(util.join(folder0, 'folder2/file1'))
            await file_create(util.join(folder0, 'folder2/file2'))
            await file_create(util.join(folder0, 'folder2/file3'))

            // copy to target
            await contents_copy_to(folder0, folder1)

            // expect the source to match the target
            const hash0 = await folder_hash(folder0)
            const hash1 = await folder_hash(folder1)
            
            expect(hash0).to.eq(hash1)
        })
    })
})