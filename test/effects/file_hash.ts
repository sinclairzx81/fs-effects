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

import { file_write }  from '../../src/effects/file_write'
import { file_hash }   from '../../src/effects/file_hash'
import { run_root }    from '../support'
import { expect }      from 'chai'

describe('effects/file_hash', () => {
    it('should create default sha1 hash', async () => {
        await run_root(async (root, util) => {
            const file = util.join(root, 'file')
            await file_write(file, 'helloworld')
            const hash0 = await file_hash(file)
            const hash1 = await file_hash(file, 'sha1')
            expect(hash0).to.eq(hash1)
        })
    })
    it('should create a file hash (md5)', async () => {
        await run_root(async (root, util) => {
            const file = util.join(root, 'file')
            await file_write(file, 'helloworld')
            const hash = await file_hash(file, 'md5')
            expect(hash.length).to.not.eq(0)
        })
    })
    it('should create a file hash (sha256)', async () => {
        await run_root(async (root, util) => {
            const file = util.join(root, 'file')
            await file_write(file, 'helloworld')
            const hash = await file_hash(file, 'sha256')
            expect(hash.length).to.not.eq(0)
        })
    })
})