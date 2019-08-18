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

import { common_readdir_flatmap } from './common_readdir_flatmap'
import { file_hash }              from './file_hash'
import { createHash }             from 'crypto'
import { basename, join }         from 'path'

/** Returns a hash of the contents of this folder using the given algorithm. */
export async function folder_hash(folder: string, algorithm: string = 'sha1'): Promise<string> {
    const hashes: string[] = []
    for(const {stat, path, folder: _folder} of await common_readdir_flatmap(folder)) {
        // basename hash
        //
        // Here we write the basename of the file or folder.
        // This hash is written before the actual file, and
        // is used to generate unique hashes for varying
        // folder and file names.
        const name = Buffer.from(basename(path))
        hashes.push(createHash('md5').update(name).digest('hex'))

        // filename hash
        //
        if(stat.isFile()) {
            hashes.push(await file_hash(join(_folder, path), algorithm))
        }
    }
    const buffer = Buffer.from(hashes.join(''))
    return createHash('md5').update(buffer).digest('hex')
}