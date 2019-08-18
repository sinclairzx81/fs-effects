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

import { file_exists }       from './file_exists'
import { common_readable }   from './common_readable'
import { Readable }          from 'stream'
import * as http             from 'http'
import * as https            from 'https'
import * as url              from 'url'
import { createReadStream }  from 'fs'

/** Resolves the http protocol type from the given url options. */
function protocol(options: url.UrlWithStringQuery): typeof http {
    if(options.protocol === 'https:') {
        return (https as any) as typeof http
    } else if(options.protocol === 'http:') {
        return http
    } else {
        throw Error(`Unknown protocol '${options.protocol}'`)
    }
}

/** Returns a readable HTTP response stream for the given endpoint. */
function http_readable(endpoint: string): Promise<Readable> {
    return new Promise<Readable>((resolve, reject) => {
        const options = url.parse(endpoint)
        const request = protocol(options).request(options, response => resolve(response))
        request.on('error', error => reject(error))
        request.end()
    })
}

/** Returns a readable file stream for the given path. If not exists, return 0 stream. */
async function file_readable(path: string): Promise<Readable> {
    if(await file_exists(path)) {
        return createReadStream(path)
    } else {
        return common_readable(Buffer.from(new Uint8Array(0)))
    }
}

/** Returns a readable stream to either a file path or http endpoint. */
export function common_readable_from(file_or_url: string): Promise<Readable> {
    const { hostname } = url.parse(file_or_url)
    if(!(hostname === null || hostname === '')) {
        return http_readable(file_or_url)
    } else {
        return file_readable(file_or_url)
    }
}