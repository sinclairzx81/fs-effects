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

import { file_size }     from '../../src/effects/file_size'
import { file_write }    from '../../src/effects/file_write'
import { file_exists }   from '../../src/effects/file_exists'
import { file_truncate } from '../../src/effects/file_truncate'
import { run_root }      from '../support'
import { expect }        from 'chai'

describe('effects/file_truncate', () => {
    it('should truncate file.', async () => {
        await run_root(async (root, util) => {
            const file = util.join(root, 'file')
            await file_write(file, Buffer.alloc(65536))
            expect(await file_size(file)).to.eq(65536)
            await file_truncate(file)
            expect(await file_size(file)).to.eq(0)
        })
    })
    it('should create empty file if not exists.', async () => {
        await run_root(async (root, util) => {
            const file = util.join(root, 'file')
            await file_truncate(file)
            expect(await file_exists(file)).to.eq(true)
        })
    })
})