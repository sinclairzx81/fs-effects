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

import { file_edit }  from '../../src/effects/file_edit'
import { file_read }  from '../../src/effects/file_read'
import { file_write } from '../../src/effects/file_write'
import { run_root }   from '../support'
import { expect }     from 'chai'

describe('effects/file_edit', () => {
    it('should handle string find and replace.', async () => {
        await run_root(async (root, util) => {
            const file = util.join(root, 'file')
            await file_write(file, 'helloworldhelloworld')
            await file_edit(file, 'hello', 'foo')
            await file_edit(file, 'world', 'bar')
            const content = await file_read(file, 'utf-8')
            expect(content).to.eq('foobarfoobar')
        })
    })
    it('should handle regex find and replace (first).', async () => {
        await run_root(async (root, util) => {
            const file = util.join(root, 'file')
            await file_write(file, 'helloworldhelloworld')
            await file_edit(file, /hello/, 'foo')
            await file_edit(file, /world/, 'bar')
            const content = await file_read(file, 'utf-8')
            expect(content).to.eq('foobarhelloworld')
        })
    })
    it('should handle regex find and replace (global).', async () => {
        await run_root(async (root, util) => {
            const file = util.join(root, 'file')
            await file_write(file, 'helloworldhelloworld')
            await file_edit(file, /hello/g, 'foo')
            await file_edit(file, /world/g, 'bar')
            const content = await file_read(file, 'utf-8')
            expect(content).to.eq('foobarfoobar')
        })
    })
})