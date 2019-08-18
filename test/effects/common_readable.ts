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

import { common_readable } from '../../src/effects/common_readable'
import { read_readable }   from '../support'
import { expect }          from 'chai'

describe('effects/common_readable', () => {
    it('should return a readable for a string', async () => {
        const readable = common_readable('hello world')
        const buffer = await read_readable(readable)
        expect(buffer.length).to.eq(11)
    })
    it('should return a readable for a buffer', async () => {
        const readable = common_readable(Buffer.alloc(128000))
        const buffer = await read_readable(readable)
        expect(buffer.length).to.eq(128000)
    })
    it('should return a readable for a readable', async () => {
        const readable1 = common_readable(Buffer.alloc(128000))
        const readable2 = common_readable(readable1)
        const buffer = await read_readable(readable2)
        expect(buffer.length).to.eq(128000)
    })
})