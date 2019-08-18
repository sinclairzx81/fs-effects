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

import { common_readdir_flatmap } from '../../src/effects/common_readdir_flatmap'
import { contents_delete } from '../../src/effects/contents_delete'
import { folder_exists } from '../../src/effects/folder_exists'
import { folder_create } from '../../src/effects/folder_create'
import { file_create } from '../../src/effects/file_create'
import { run_root } from '../support'
import { expect } from 'chai'

describe('effects/contents_delete', () => {
    it('should delete folder contents', async () => {
        await run_root(async (root, util) => {
            const folder0 = util.join(root, 'folder0')
            // create the folder.
            await folder_create(util.join(folder0, 'empty'))
            await file_create(util.join(folder0, 'file1'))
            await file_create(util.join(folder0, 'file2'))
            await file_create(util.join(folder0, 'file3'))
            await file_create(util.join(folder0, 'file4'))
            await folder_create(util.join(folder0, 'folder'))
            await file_create(util.join(folder0, 'folder/file1'))
            await file_create(util.join(folder0, 'folder/file2'))
            await file_create(util.join(folder0, 'folder/file3'))
            await file_create(util.join(folder0, 'folder/file4'))

            // check the contents
            const items0 = await common_readdir_flatmap(folder0)
            
            expect(items0.length).to.eq(10)

            // delete the contents
            await contents_delete(folder0)

            // check the contents again
            const items1 = await common_readdir_flatmap(folder0)
            expect(items1.length).to.eq(0)

            // check folder exists
            expect(await folder_exists(folder0)).to.eq(true)
        })
    })
})