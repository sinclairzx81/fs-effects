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
import { folder_create }          from '../../src/effects/folder_create'
import { file_create }            from '../../src/effects/file_create'
import { run_root }               from '../support'
import { expect }                 from 'chai'

describe('effects/common_readdir_flatmap', () => {
    it('should return contents recursive', async () => {
        await run_root(async (root, util) => {
            await folder_create(util.join(root, 'folder'))
            await file_create  (util.join(root, 'folder', 'file1'))
            await file_create  (util.join(root, 'folder', 'file2'))
            await file_create  (util.join(root, 'folder', 'file3'))
            await file_create  (util.join(root, 'folder', 'file4'))
            await folder_create(util.join(root, 'folder/folder1'))
            await file_create  (util.join(root, 'folder/folder1', 'file1'))
            await file_create  (util.join(root, 'folder/folder1', 'file2'))
            await file_create  (util.join(root, 'folder/folder1', 'file3'))
            await file_create  (util.join(root, 'folder/folder1', 'file4'))
            await folder_create(util.join(root, 'folder/folder2'))
            await file_create  (util.join(root, 'folder/folder2', 'file1'))
            await file_create  (util.join(root, 'folder/folder2', 'file2'))
            await file_create  (util.join(root, 'folder/folder2', 'file3'))
            await file_create  (util.join(root, 'folder/folder2', 'file4'))

            
            const fixpath = (str:string) => str.replace(/\\/g, '/')
            const items = await common_readdir_flatmap(root)
            
            // note: paths are produced in this order and should be
            // consistent. This sequence is hashed on for the folder
            // hash method.
            expect(items.length).to.eq(15)
            expect(fixpath(items[0].path)).to.eq('folder')
            expect(fixpath(items[1].path)).to.eq('folder/folder1')
            expect(fixpath(items[2].path)).to.eq('folder/folder1/file1')
            expect(fixpath(items[3].path)).to.eq('folder/folder1/file2')
            expect(fixpath(items[4].path)).to.eq('folder/folder1/file3')
            expect(fixpath(items[5].path)).to.eq('folder/folder1/file4')
            expect(fixpath(items[6].path)).to.eq('folder/folder2')
            expect(fixpath(items[7].path)).to.eq('folder/folder2/file1')
            expect(fixpath(items[8].path)).to.eq('folder/folder2/file2')
            expect(fixpath(items[9].path)).to.eq('folder/folder2/file3')
            expect(fixpath(items[10].path)).to.eq('folder/folder2/file4')
            expect(fixpath(items[11].path)).to.eq('folder/file1')
            expect(fixpath(items[12].path)).to.eq('folder/file2')
            expect(fixpath(items[13].path)).to.eq('folder/file3')
            expect(fixpath(items[14].path)).to.eq('folder/file4')
        })
    })
})