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

import { Effect }                  from './effect'
import { Contents }                from './contents'
import * as eff                    from './effects'
import { join, dirname, basename } from 'path'
import { Stats }                   from 'fs'

export class Folder {
    constructor(private current: string, private effects: Effect[]) {}
    /** Adds a file to this folder. If the file exists, it is overwritten. */
    public add(path: string): Folder {
        return new Folder(this.current, [...this.effects, () => {
            return eff.folder_add(this.current, path)
        }])
    }
    /** Copies this folder into the given folder. */
    public copy_to(folder: string): Folder {
        const next = join(folder, basename(this.current))
        return new Folder(next, [...this.effects, () => {
            return eff.folder_copy_to(this.current, folder)
        }])
    }
    /** Returns a contents object for this folder */
    public contents(): Contents {
        return new Contents(this.current, [...this.effects])
    }
    /** Creates this folder. If the folder exists, no action. */
    public create(): Folder {
        return new Folder(this.current, [...this.effects, () => {
            return eff.folder_create(this.current)
        }])
    }
    /** Deletes this folder. If the folder does not exist, no action. */
    public delete(): Folder {
        return new Folder(this.current, [...this.effects, () => {
            return eff.folder_delete(this.current)
        }])
    }
    /** Executes effects on this folder. */
    public async exec(): Promise<void> {
        while(this.effects.length > 0) {
            const effect = this.effects.shift()!
            await effect()
        }
    }
    /** Returns true if this folder exists. */
    public async exists(): Promise<boolean> {
        await this.exec()
        return eff.folder_exists(this.current)
    }
    /** Returns a hash for this folder with the given algorithm (default is sha1) */
    public async hash(algorithm?: string): Promise<string> {
        await this.exec()
        return eff.folder_hash(this.current, algorithm)
    }
    /** Merges the content from a remote folder into this folder. */
    public merge_from(folder: string): Folder {
        return new Folder(this.current, [...this.effects, () => {
            return eff.folder_merge_from(this.current, folder)
        }])
    }
    /** Moves this folder into the given folder. */
    public move_to(folder: string): Folder {
        const next = join(folder, basename(this.current))
        return new Folder(next, [...this.effects, () => {
            return eff.folder_move_to(this.current, folder)
        }])
    }
    /** Deletes a file from this folder. If the file does not exist, no action. */
    public remove(source: string): Folder {
        return new Folder(this.current, [...this.effects, () => {
            return eff.folder_remove(this.current, source)
        }])
    }
    /** Renames this folder. */
    public rename(newname: string): Folder {
        const next = join(dirname(this.current), newname)
        return new Folder(next, [...this.effects, () => {
            return eff.folder_rename(this.current, newname)
        }])
    }
    /** Returns the size of this folder in bytes. */
    public async size(): Promise<number> {
        await this.exec()
        return eff.folder_size(this.current)
    }
    /** Returns a fs stats object for this folder. */
    public async stat(): Promise<Stats> {
        await this.exec()
        return eff.folder_stat(this.current)
    }
}
