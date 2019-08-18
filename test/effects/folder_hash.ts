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

import { folder_hash }   from '../../src/effects/folder_hash'
import { folder_create } from '../../src/effects/folder_create'
import { folder_delete } from '../../src/effects/folder_delete'
import { file_create }   from '../../src/effects/file_create'
import { file_write }    from '../../src/effects/file_write'
import { run_root }      from '../support'
import { expect }        from 'chai'

describe('effects/folder_hash', () => {
    it('should hash a folder', async () => {
        await run_root(async (root, util) => {
            const folder = util.join(root, 'folder')
            const file0  = util.join(root, 'folder/file0')
            const file1  = util.join(root, 'folder/file1')
            const file2  = util.join(root, 'folder/file1')
            const file3  = util.join(root, 'folder/file3')

            // create some folder structure
            await folder_create(folder)
            await file_create(file0)
            await file_create(file1)
            await file_create(file2)
            await file_create(file3)

            // compute hash
            const hash0 = await folder_hash(folder)

            // modify file content
            await file_write(file0, 'helloworld')

            // recompute hash
            const hash1 = await folder_hash(folder)

            expect(hash0).to.not.eq(hash1)
        })
    })
    it('should hash empty folders', async () => {
        await run_root(async (root, util) => {
            const folder = util.join(root, 'folder')
            await folder_create(folder)
            const hash = await folder_hash(folder)
            expect(hash.length).to.not.eq(0)
        })
    })
    it('should hash folders including empty sub folders', async () => {
        await run_root(async (root, util) => {
            const folder = util.join(root, 'folder')
            const empty  = util.join(root, 'folder/empty')
            const file0  = util.join(root, 'folder/file0')
            const file1  = util.join(root, 'folder/file1')
            const file2  = util.join(root, 'folder/file1')
            const file3  = util.join(root, 'folder/file3')

            // create some folder structure
            await folder_create(folder)
            await folder_create(empty)
            await file_create(file0)
            await file_create(file1)
            await file_create(file2)
            await file_create(file3)

            // compute hash
            const hash0 = await folder_hash(folder)

            // modify file content
            await folder_delete(empty)

            // recompute hash
            const hash1 = await folder_hash(folder)

            expect(hash0).to.not.eq(hash1)
        })
    })
})