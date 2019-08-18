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

import { folder_merge_from } from '../../src/effects/folder_merge_from'
import { folder_create }     from '../../src/effects/folder_create'
import { file_create }       from '../../src/effects/file_create'
import { folder_hash }       from '../../src/effects/folder_hash'
import { run_root }          from '../support'
import { expect }            from 'chai'

describe('effects/folder_merge_from', () => {
    it('should pass', async () => {
        await run_root(async (root, util) => {
            const folder0 = util.join(root, 'folder0')
            const empty   = util.join(root, 'folder0/empty')
            const file0   = util.join(root, 'folder0/file0')
            const file1   = util.join(root, 'folder0/file1')
            const file2   = util.join(root, 'folder0/file1')
            const file3   = util.join(root, 'folder0/file3')

            const folder1 = util.join(root, 'folder1')

            // create some folder structure
            await folder_create(folder0)
            await folder_create(empty)
            await file_create(file0)
            await file_create(file1)
            await file_create(file2)
            await file_create(file3)

            // from folder0 into folder1
            await folder_merge_from(folder1, folder0)

            // compare folder hash
            const hash0 = await folder_hash(folder0)
            const hash1 = await folder_hash(folder1)

            // assert
            expect(hash0).to.eq(hash1)
        })
    })
})