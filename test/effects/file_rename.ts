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

import { file_create } from '../../src/effects/file_create'
import { file_exists } from '../../src/effects/file_exists'
import { file_rename } from '../../src/effects/file_rename'
import { run_root }    from '../support'
import { expect }      from 'chai'

describe('effects/file_rename', () => {
    it('should rename a file', async () => {
        await run_root(async (root, util) => {
            const file0 = util.join(root, 'folder/file0')
            const file1 = util.join(root, 'folder/file1')
            await file_create(file0)
            await file_rename(file0, 'file1')
            expect(await file_exists(file1)).to.eq(true)
            expect(await file_exists(file0)).to.eq(false)
        })
    })
})