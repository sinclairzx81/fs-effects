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

import { Effect } from './effect'
import * as eff   from './effects'

export class Contents {
    constructor(private current: string, private effects: Effect[]) {}

    /** Copies the contents into the given folder. */
    public copy_to(folder: string): Contents {
        const next = folder
        return new Contents(next, [...this.effects, () => {
            return eff.contents_copy_to(this.current, folder)
        }])
    }
    /** Moves the contents into the given folder. */
    public move_to(folder: string): Contents {
        const next = folder
        return new Contents(next, [...this.effects, () => {
            return eff.contents_move_to(this.current, folder)
        }])
    }
    /** Deletes the contents of this folder. */
    public delete(): Contents {
        return new Contents(this.current, [...this.effects, async () => {
            return eff.contents_delete(this.current)
        }])
    }
    /** Executes effects on these contents. */
    public async exec(): Promise<void> {
        while(this.effects.length > 0) {
            const effect = this.effects.shift()!
            await effect()
        }
    }
}