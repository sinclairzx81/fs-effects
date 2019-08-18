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

import { common_stat }   from '../../src/effects/common_stat'
import { folder_create } from '../../src/effects/folder_create'
import { file_create }   from '../../src/effects/file_create'
import { run_root }      from '../support'
import { expect }        from 'chai'

describe('effects/common_stat', () => {
    it('should return stat on folder', async () => {
        await run_root(async (root, util) => {
            const path = util.join(root, 'folder')
            await folder_create(path)
            const stat = await common_stat(path)
            expect(stat.isDirectory()).to.eq(true)
        })
    })
    it('should return stat on file', async () => {
        await run_root(async (root, util) => {
            const path = util.join(root, 'file')
            await file_create(path)
            const stat = await common_stat(path)
            expect(stat.isFile()).to.eq(true)
        })
    })
})