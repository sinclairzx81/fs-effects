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

import * as eff                    from './effects'
import { Effect }                  from './effect'
import { Readable }                from 'stream'
import { dirname, join, basename } from 'path'
import { Stats }                   from 'fs'

export class File {
    constructor(private current: string, private effects: Effect[]) { }
    /** Appends to this file from a remote path | url. If file not exist, create. */
    public append_from(path_or_url: string): File {
        return new File(this.current, [...this.effects, () => {
            return eff.file_append_from(this.current, path_or_url)
        }])
    }
    /** Appends to this file. If file not exist, create. */
    public append(content: Buffer | string | Readable): File {
        return new File(this.current, [...this.effects, () => {
            return eff.file_append(this.current, content)
        }])
    }
    /** Copies this file into the given folder. */
    public copy_to(folder: string): File {
        const next = join(folder, basename(this.current))
        return new File(next, [...this.effects, () => {
            return eff.file_copy_to(this.current, folder)
        }])
    }
    /** Creates this file if not exists. */
    public create(): File {
        return new File(this.current, [...this.effects, () => {
            return eff.file_create(this.current)
        }])
    }
    /** Deletes this file if exists. */
    public delete(): File {
        return new File(this.current, [...this.effects, () => {
            return eff.file_delete(this.current)
        }])
    }
    /** Makes a find and replace edit to this file. */
    public edit(find: RegExp | string, replace: string): File {
        return new File(this.current, [...this.effects, () => {
            return eff.file_edit(this.current, find, replace)
        }])
    }
    /** Executes effects on this file. */
    public async exec(): Promise<void> {
        while (this.effects.length > 0) {
            const effect = this.effects.shift()!
            await effect()
        }
    }
    /** Returns true if this file exists. */
    public async exists(): Promise<boolean> {
        await this.exec()
        return eff.file_exists(this.current)
    }
    /** Returns a hash for this file with the given algorithm (default is sha1) */
    public async hash(algorithm: string = 'sha1'): Promise<string> {
        await this.exec()
        return eff.file_hash(this.current, algorithm)
    }
    /** Moves this file into the given folder. */
    public move_to(folder: string): File {
        const next = join(folder, basename(this.current))
        return new File(next, [...this.effects, () => {
            return eff.file_move_to(this.current, folder)
        }])
    }
    /** Prepends to this file with content loaded from a remote path or url. If the file does not exist, it is created. */
    public prepend_from(path_or_url: string): File {
        return new File(this.current, [...this.effects, () => {
            return eff.file_prepend_from(this.current, path_or_url)
        }])
    }
    /** Prepends to this file. If the file does not exist, it is created. */
    public prepend(content: Buffer | string | Readable): File {
        return new File(this.current, [...this.effects, () => {
            return eff.file_prepend(this.current, content)
        }])
    }
    /** Returns the contents of this file as a buffer. */
    public read(): Promise<Buffer>
    /** Returns the contents of this file a string. */
    public read(encoding: string): Promise<Buffer>
    /** Returns the contents of this file. */
    public async read(...args: any[]): Promise<Buffer | string> {
        await this.exec()
        return eff.file_read(this.current, ...args)
    }
    /** Renames this file to the given newname. */
    public rename(newname: string): File {
        const next = join(dirname(this.current), newname)
        return new File(next, [...this.effects, () => {
            return eff.file_rename(this.current, newname)
        }])
    }
    /** Returns the size of this file in bytes. */
    public async size(): Promise<number> {
        await this.exec()
        return eff.file_size(this.current)
    }
    /** Returns a fs stats object for this file. */
    public async stat(): Promise<Stats> {
        await this.exec()
        return eff.file_stat(this.current)
    }
    /** Truncates the contents of this file. If the file does not exist, it is created. */
    public truncate(): File {
        return new File(this.current, [...this.effects, () => {
            return eff.file_truncate(this.current)
        }])
    }
    /** Writes to this file with content loaded from a remote path or url. If the file does not exist, it is created. */
    public write_from(path_or_url: string): File {
        return new File(this.current, [...this.effects, () => {
            return eff.file_write_from(this.current, path_or_url)
        }])
    }
    /** Writes to this file. If the file does not exist, it is created. */
    public write(content: Buffer | string | Readable): File {
        return new File(this.current, [...this.effects, () => {
            return eff.file_write(this.current, content)
        }])
    }
}
