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

import { file_prepend_from } from '../../src/effects/file_prepend_from'
import { file_write } from '../../src/effects/file_write'
import { file_read } from '../../src/effects/file_read'
import { run_root } from '../support'
import { expect } from 'chai'

describe('effects/file_prepend_from', () => {
    it('should prepend from file', async () => {
        await run_root(async (root, util) => {
            const file0 = util.join(root, 'file0')
            const file1 = util.join(root, 'file1')
            const file2 = util.join(root, 'file2')
            await file_write(file0, 'world')
            await file_write(file1, 'hello')
            await file_prepend_from(file2, file0)
            await file_prepend_from(file2, file1)
            const contents = await file_read(file2, 'utf-8')
            expect(contents).to.eq('helloworld')
        })
    })
})