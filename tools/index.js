module.exports = (() => {
    const defines = {};
    const entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies, factory };
        entry[0] = name;
    }
    define("require", ["exports"], (exports) => {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: (name) => resolve(name) });
    });
    define("effects/common_readdir", ["require", "exports", "fs", "path", "util"], function (require, exports, fs_1, path_1, util_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const readdirAsync = util_1.promisify(fs_1.readdir);
        const statAsync = util_1.promisify(fs_1.stat);
        function compare(left, right) {
            if (left > right) {
                return 1;
            }
            if (left < right) {
                return -1;
            }
            return 0;
        }
        async function common_readdir(folder) {
            const items = await Promise.all((await readdirAsync(folder))
                .map(async (path) => ({
                path: path_1.basename(path),
                folder: path_1.resolve(folder),
                stat: await statAsync(path_1.join(folder, path_1.basename(path)))
            })));
            const folders = items.filter(item => item.stat.isDirectory())
                .sort((a, b) => compare(a.path, b.path));
            const files = items.filter(item => item.stat.isFile())
                .sort((a, b) => compare(a.path, b.path));
            return [
                ...folders,
                ...files,
            ];
        }
        exports.common_readdir = common_readdir;
    });
    define("effects/common_readdir_flatmap", ["require", "exports", "effects/common_readdir", "path"], function (require, exports, common_readdir_1, path_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function read_folder(folder) {
            const items = [];
            for (const item of await common_readdir_1.common_readdir(folder)) {
                if (item.stat.isDirectory()) {
                    items.push(item);
                    items.push(...await read_folder(path_2.join(item.folder, item.path)));
                }
                if (item.stat.isFile()) {
                    items.push(item);
                }
            }
            return items;
        }
        async function common_readdir_flatmap(folder) {
            return (await read_folder(folder))
                .map(item => ({
                folder: path_2.resolve(folder),
                path: path_2.relative(folder, path_2.join(item.folder, item.path)),
                stat: item.stat
            }));
        }
        exports.common_readdir_flatmap = common_readdir_flatmap;
    });
    define("effects/common_exists", ["require", "exports", "fs"], function (require, exports, fs_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function common_exists(path) {
            return fs_2.existsSync(path);
        }
        exports.common_exists = common_exists;
    });
    define("effects/common_stat", ["require", "exports", "fs", "util"], function (require, exports, fs_3, util_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const statAsync = util_2.promisify(fs_3.stat);
        function common_stat(path) {
            if (!fs_3.existsSync(path)) {
                throw Error(`The path '${path}' does not exist`);
            }
            return statAsync(path);
        }
        exports.common_stat = common_stat;
    });
    define("effects/file_exists", ["require", "exports", "effects/common_exists", "effects/common_stat"], function (require, exports, common_exists_1, common_stat_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function file_exists(file) {
            if (!await common_exists_1.common_exists(file)) {
                return false;
            }
            if (!(await common_stat_1.common_stat(file)).isFile()) {
                return false;
            }
            return true;
        }
        exports.file_exists = file_exists;
    });
    define("effects/file_delete", ["require", "exports", "effects/file_exists", "fs", "util"], function (require, exports, file_exists_1, fs_4, util_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const unlinkAsync = util_3.promisify(fs_4.unlink);
        async function file_delete(file) {
            if (await file_exists_1.file_exists(file)) {
                await unlinkAsync(file);
            }
        }
        exports.file_delete = file_delete;
    });
    define("effects/folder_exists", ["require", "exports", "effects/common_exists", "effects/common_stat"], function (require, exports, common_exists_2, common_stat_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function folder_exists(folder) {
            if (!await common_exists_2.common_exists(folder)) {
                return false;
            }
            if (!(await common_stat_2.common_stat(folder)).isDirectory()) {
                return false;
            }
            return true;
        }
        exports.folder_exists = folder_exists;
    });
    define("effects/folder_delete", ["require", "exports", "effects/common_readdir_flatmap", "effects/file_delete", "effects/folder_exists", "fs", "util", "path"], function (require, exports, common_readdir_flatmap_1, file_delete_1, folder_exists_1, fs_5, util_4, path_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const rmdirAsync = util_4.promisify(fs_5.rmdir);
        async function folder_delete(folder) {
            if (await folder_exists_1.folder_exists(folder)) {
                const items = await common_readdir_flatmap_1.common_readdir_flatmap(folder);
                const folders = items.filter(item => item.stat.isDirectory());
                const files = items.filter(item => item.stat.isFile());
                for (const item of files) {
                    const target = path_3.join(item.folder, item.path);
                    await file_delete_1.file_delete(target);
                }
                for (const item of folders.reverse()) {
                    const target = path_3.join(item.folder, item.path);
                    await rmdirAsync(target);
                }
                await rmdirAsync(folder);
            }
        }
        exports.folder_delete = folder_delete;
    });
    define("effects/common_delete", ["require", "exports", "effects/folder_delete", "effects/file_delete", "fs", "util"], function (require, exports, folder_delete_1, file_delete_2, fs_6, util_5) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const statAsync = util_5.promisify(fs_6.stat);
        async function common_delete(path) {
            if (fs_6.existsSync(path)) {
                const stat = await statAsync(path);
                if (stat.isDirectory()) {
                    await folder_delete_1.folder_delete(path);
                }
                else if (stat.isFile()) {
                    await file_delete_2.file_delete(path);
                }
            }
        }
        exports.common_delete = common_delete;
    });
    define("effects/common_readable", ["require", "exports", "stream"], function (require, exports, stream_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function common_readable(data) {
            if (data instanceof stream_1.Readable) {
                return data;
            }
            else {
                const buffer = Buffer.from(data);
                const readable = new stream_1.Readable();
                let chunk = 65536;
                let offset = 0;
                readable._read = () => {
                    const next = buffer.slice(offset, offset + chunk);
                    offset += chunk;
                    if (next.length > 0) {
                        readable.push(next);
                    }
                    else {
                        readable.push(null);
                    }
                };
                return readable;
            }
        }
        exports.common_readable = common_readable;
    });
    define("effects/common_readable_from", ["require", "exports", "effects/file_exists", "effects/common_readable", "http", "https", "url", "fs"], function (require, exports, file_exists_2, common_readable_1, http, https, url, fs_7) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function protocol(options) {
            if (options.protocol === 'https:') {
                return https;
            }
            else if (options.protocol === 'http:') {
                return http;
            }
            else {
                throw Error(`Unknown protocol '${options.protocol}'`);
            }
        }
        function http_readable(endpoint) {
            return new Promise((resolve, reject) => {
                const options = url.parse(endpoint);
                const request = protocol(options).request(options, response => resolve(response));
                request.on('error', error => reject(error));
                request.end();
            });
        }
        async function file_readable(path) {
            if (await file_exists_2.file_exists(path)) {
                return fs_7.createReadStream(path);
            }
            else {
                return common_readable_1.common_readable(Buffer.from(new Uint8Array(0)));
            }
        }
        function common_readable_from(file_or_url) {
            const { hostname } = url.parse(file_or_url);
            if (!(hostname === null || hostname === '')) {
                return http_readable(file_or_url);
            }
            else {
                return file_readable(file_or_url);
            }
        }
        exports.common_readable_from = common_readable_from;
    });
    define("effects/folder_create", ["require", "exports", "effects/common_exists", "effects/common_stat", "util", "fs"], function (require, exports, common_exists_3, common_stat_3, util_6, fs_8) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const mkdirAsync = util_6.promisify(fs_8.mkdir);
        async function folder_create(folder) {
            const exists = await common_exists_3.common_exists(folder);
            if (exists && (await common_stat_3.common_stat(folder)).isFile()) {
                throw new Error(`Cannot create folder '${folder}' as a file exists in this location.`);
            }
            if (!exists) {
                const mkdir_facade = mkdirAsync;
                return mkdir_facade(folder, { recursive: true });
            }
        }
        exports.folder_create = folder_create;
    });
    define("effects/folder_copy_to", ["require", "exports", "effects/common_readdir_flatmap", "effects/file_exists", "effects/folder_create", "effects/folder_exists", "path", "util", "fs"], function (require, exports, common_readdir_flatmap_2, file_exists_3, folder_create_1, folder_exists_2, path_4, util_7, fs_9) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const copyFileAsync = util_7.promisify(fs_9.copyFile);
        async function folder_copy_to(folder, remote) {
            if (!await folder_exists_2.folder_exists(folder)) {
                throw new Error(`Cannot copy folder '${folder}' as it does not exist.`);
            }
            const target = path_4.join(remote, path_4.basename(folder));
            if (await file_exists_3.file_exists(target)) {
                throw new Error(`Cannot copy folder '${folder}' to '${target}' as a file exists at the target path.`);
            }
            await folder_create_1.folder_create(target);
            for (const item of await common_readdir_flatmap_2.common_readdir_flatmap(folder)) {
                const source = path_4.resolve(path_4.join(item.folder, item.path));
                const target = path_4.resolve(path_4.join(remote, path_4.basename(folder), item.path));
                if (item.stat.isDirectory()) {
                    await folder_create_1.folder_create(target);
                }
                else {
                    await copyFileAsync(source, target);
                }
            }
        }
        exports.folder_copy_to = folder_copy_to;
    });
    define("effects/file_copy_to", ["require", "exports", "effects/folder_create", "effects/folder_exists", "effects/file_exists", "path", "util", "fs"], function (require, exports, folder_create_2, folder_exists_3, file_exists_4, path_5, util_8, fs_10) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const copyFileAsync = util_8.promisify(fs_10.copyFile);
        async function file_copy_to(file, folder) {
            const target = path_5.join(folder, path_5.basename(file));
            if (!await file_exists_4.file_exists(file)) {
                throw new Error(`Cannot copy file '${file}' as it does not exist.`);
            }
            if (await folder_exists_3.folder_exists(target)) {
                throw new Error(`Cannot copy file '${file}' to '${target}' as a directory exists at the target path.`);
            }
            await folder_create_2.folder_create(folder);
            await copyFileAsync(file, target);
        }
        exports.file_copy_to = file_copy_to;
    });
    define("effects/contents_copy_to", ["require", "exports", "effects/common_stat", "effects/folder_exists", "effects/folder_copy_to", "effects/file_copy_to", "fs", "util", "path"], function (require, exports, common_stat_4, folder_exists_4, folder_copy_to_1, file_copy_to_1, fs_11, util_9, path_6) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const readdirAsync = util_9.promisify(fs_11.readdir);
        async function contents_copy_to(folder, remote) {
            if (!await folder_exists_4.folder_exists(folder)) {
                throw new Error(`Cannot copy contents from '${folder}' as the folder does not exist.`);
            }
            for (const content of await readdirAsync(folder)) {
                const path = path_6.join(folder, content);
                const stat = await common_stat_4.common_stat(path);
                if (stat.isDirectory()) {
                    await folder_copy_to_1.folder_copy_to(path, remote);
                }
                if (stat.isFile()) {
                    await file_copy_to_1.file_copy_to(path, remote);
                }
            }
        }
        exports.contents_copy_to = contents_copy_to;
    });
    define("effects/folder_move_to", ["require", "exports", "effects/file_exists", "effects/folder_exists", "effects/folder_create", "effects/folder_delete", "path", "util", "fs"], function (require, exports, file_exists_5, folder_exists_5, folder_create_3, folder_delete_2, path_7, util_10, fs_12) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const renameAsync = util_10.promisify(fs_12.rename);
        async function folder_move_to(folder, remote) {
            const target = path_7.join(remote, path_7.basename(folder));
            if (!await folder_exists_5.folder_exists(folder)) {
                throw new Error(`Cannot move folder '${folder}' as it does not exist.`);
            }
            if (await file_exists_5.file_exists(target)) {
                throw new Error(`Cannot move folder '${folder}' to '${target}' as a file exists at the target path.`);
            }
            if (await folder_exists_5.folder_exists(target)) {
                await folder_delete_2.folder_delete(target);
            }
            await folder_create_3.folder_create(remote);
            return renameAsync(folder, target);
        }
        exports.folder_move_to = folder_move_to;
    });
    define("effects/file_move_to", ["require", "exports", "effects/folder_create", "effects/folder_exists", "effects/file_exists", "path", "util", "fs"], function (require, exports, folder_create_4, folder_exists_6, file_exists_6, path_8, util_11, fs_13) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const renameAsync = util_11.promisify(fs_13.rename);
        async function file_move_to(file, folder) {
            const target = path_8.join(folder, path_8.basename(file));
            if (!await file_exists_6.file_exists(file)) {
                throw new Error(`Cannot move file '${file}' as it does not exist.`);
            }
            if (await folder_exists_6.folder_exists(target)) {
                throw new Error(`Cannot move file '${file}' to '${target}' as a directory exists at the target path.`);
            }
            await folder_create_4.folder_create(folder);
            await renameAsync(file, target);
        }
        exports.file_move_to = file_move_to;
    });
    define("effects/contents_move_to", ["require", "exports", "effects/common_stat", "effects/folder_move_to", "effects/folder_exists", "effects/file_move_to", "fs", "util", "path"], function (require, exports, common_stat_5, folder_move_to_1, folder_exists_7, file_move_to_1, fs_14, util_12, path_9) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const readdirAsync = util_12.promisify(fs_14.readdir);
        async function contents_move_to(folder, remote) {
            if (!await folder_exists_7.folder_exists(folder)) {
                throw new Error(`Cannot move contents from '${folder}' as the folder does not exist.`);
            }
            for (const content of await readdirAsync(folder)) {
                const path = path_9.join(folder, content);
                const stat = await common_stat_5.common_stat(path);
                if (stat.isDirectory()) {
                    await folder_move_to_1.folder_move_to(path, remote);
                }
                if (stat.isFile()) {
                    await file_move_to_1.file_move_to(path, remote);
                }
            }
        }
        exports.contents_move_to = contents_move_to;
    });
    define("effects/contents_delete", ["require", "exports", "effects/common_readdir", "effects/folder_delete", "effects/file_delete", "path"], function (require, exports, common_readdir_2, folder_delete_3, file_delete_3, path_10) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function contents_delete(folder) {
            for (const item of await common_readdir_2.common_readdir(folder)) {
                const path = path_10.join(item.folder, item.path);
                if (item.stat.isDirectory()) {
                    await folder_delete_3.folder_delete(path);
                }
                if (item.stat.isFile()) {
                    await file_delete_3.file_delete(path);
                }
            }
        }
        exports.contents_delete = contents_delete;
    });
    define("effects/file_create", ["require", "exports", "effects/folder_create", "effects/file_exists", "fs", "path", "util"], function (require, exports, folder_create_5, file_exists_7, fs_15, path_11, util_13) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const writeFileAsync = util_13.promisify(fs_15.writeFile);
        async function file_create(file) {
            if (!await file_exists_7.file_exists(file)) {
                await folder_create_5.folder_create(path_11.dirname(file));
                await writeFileAsync(file, Buffer.from(new Uint8Array(0)));
            }
        }
        exports.file_create = file_create;
    });
    define("effects/file_append", ["require", "exports", "effects/common_readable", "effects/file_create", "fs"], function (require, exports, common_readable_2, file_create_1, fs_16) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function file_append(file, content) {
            await file_create_1.file_create(file);
            return new Promise((resolve, reject) => {
                const readable = common_readable_2.common_readable(content);
                const writable = fs_16.createWriteStream(file, { flags: 'a' });
                readable.pipe(writable)
                    .on('error', (error) => reject(error))
                    .on('finish', () => resolve(void 0));
            });
        }
        exports.file_append = file_append;
    });
    define("effects/file_append_from", ["require", "exports", "effects/common_readable_from", "effects/file_append"], function (require, exports, common_readable_from_1, file_append_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function file_append_from(file, path_or_url) {
            const readable = await common_readable_from_1.common_readable_from(path_or_url);
            await file_append_1.file_append(file, readable);
        }
        exports.file_append_from = file_append_from;
    });
    define("effects/file_read", ["require", "exports", "effects/file_exists", "fs", "util"], function (require, exports, file_exists_8, fs_17, util_14) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const readFileAsync = util_14.promisify(fs_17.readFile);
        async function file_read(file, encoding) {
            if (await file_exists_8.file_exists(file)) {
                return readFileAsync(file, encoding);
            }
            else {
                return (encoding !== undefined)
                    ? Buffer.from(new Uint8Array(0)).toString(encoding)
                    : Buffer.from(new Uint8Array(0));
            }
        }
        exports.file_read = file_read;
    });
    define("effects/file_write", ["require", "exports", "effects/common_readable", "effects/file_create", "fs"], function (require, exports, common_readable_3, file_create_2, fs_18) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function file_write(file, content) {
            await file_create_2.file_create(file);
            return new Promise((resolve, reject) => {
                const readable = common_readable_3.common_readable(content);
                const writable = fs_18.createWriteStream(file, { flags: 'w' });
                readable.pipe(writable)
                    .on('error', (error) => reject(error))
                    .on('finish', () => resolve(void 0));
            });
        }
        exports.file_write = file_write;
    });
    define("effects/file_edit", ["require", "exports", "effects/file_exists", "effects/file_read", "effects/file_write"], function (require, exports, file_exists_9, file_read_1, file_write_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function file_edit(file, pattern, replacement) {
            if (await file_exists_9.file_exists(file)) {
                const content = await file_read_1.file_read(file, 'utf8');
                const search = typeof pattern === 'string' ? new RegExp(pattern, 'g') : pattern;
                const updated = content.replace(search, replacement);
                await file_write_1.file_write(file, updated);
            }
        }
        exports.file_edit = file_edit;
    });
    define("effects/file_hash", ["require", "exports", "crypto", "fs"], function (require, exports, crypto_1, fs_19) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function file_hash(file, algorithm = 'sha1') {
            return new Promise((resolve, reject) => {
                const hash = crypto_1.createHash(algorithm);
                const readable = fs_19.createReadStream(file);
                readable.on('data', buffer => hash.update(buffer));
                readable.on('error', error => reject(error));
                readable.on('end', () => resolve(hash.digest('hex')));
            });
        }
        exports.file_hash = file_hash;
    });
    define("effects/file_prepend", ["require", "exports", "effects/common_readable", "effects/file_create", "effects/file_read", "effects/file_write", "effects/file_append"], function (require, exports, common_readable_4, file_create_3, file_read_2, file_write_2, file_append_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        async function file_prepend(file, content) {
            await file_create_3.file_create(file);
            const readable_0 = common_readable_4.common_readable(content);
            const readable_1 = common_readable_4.common_readable(await file_read_2.file_read(file));
            await file_write_2.file_write(file, readable_0);
            await file_append_2.file_append(file, readable_1);
        }
        exports.file_prepend = file_prepend;
    });
    define("effects/file_prepend_from", ["require", "exports", "effects/common_readable_from", "effects/file_prepend"], function (require, exports, common_readable_from_2, file_prepend_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function file_prepend_from(file, path_or_url) {
            const readable = await common_readable_from_2.common_readable_from(path_or_url);
            await file_prepend_1.file_prepend(file, readable);
        }
        exports.file_prepend_from = file_prepend_from;
    });
    define("effects/file_rename", ["require", "exports", "effects/common_exists", "effects/common_stat", "effects/file_create", "fs", "path", "util"], function (require, exports, common_exists_4, common_stat_6, file_create_4, fs_20, path_12, util_15) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const renameAsync = util_15.promisify(fs_20.rename);
        async function file_rename(file, newname) {
            if ((await common_exists_4.common_exists(file)) && !(await common_stat_6.common_stat(file)).isFile()) {
                throw Error(`Cannot rename file '${file}' to '${newname}' as '${file}' is a directory.`);
            }
            const newfile = path_12.join(path_12.dirname(file), newname);
            if (await common_exists_4.common_exists(newfile)) {
                throw Error(`Cannot rename file '${file}' to '${newname}' as '${newfile}' already exists.`);
            }
            await file_create_4.file_create(newfile);
            await renameAsync(file, newfile);
        }
        exports.file_rename = file_rename;
    });
    define("effects/file_stat", ["require", "exports", "effects/common_stat"], function (require, exports, common_stat_7) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function file_stat(file) {
            const stat = await common_stat_7.common_stat(file);
            if (!stat.isFile()) {
                throw Error(`Cannot get file stat on '${file}' as its not a file.`);
            }
            return stat;
        }
        exports.file_stat = file_stat;
    });
    define("effects/file_size", ["require", "exports", "effects/file_exists", "effects/file_stat"], function (require, exports, file_exists_10, file_stat_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function file_size(file) {
            if (await file_exists_10.file_exists(file)) {
                return (await file_stat_1.file_stat(file)).size;
            }
            return 0;
        }
        exports.file_size = file_size;
    });
    define("effects/file_truncate", ["require", "exports", "effects/file_create", "fs", "util"], function (require, exports, file_create_5, fs_21, util_16) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const truncateAsync = util_16.promisify(fs_21.truncate);
        async function file_truncate(file) {
            await file_create_5.file_create(file);
            await truncateAsync(file);
        }
        exports.file_truncate = file_truncate;
    });
    define("effects/file_write_from", ["require", "exports", "effects/common_readable_from", "effects/file_write"], function (require, exports, common_readable_from_3, file_write_3) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function file_write_from(file, path_or_url) {
            const readable = await common_readable_from_3.common_readable_from(path_or_url);
            await file_write_3.file_write(file, readable);
        }
        exports.file_write_from = file_write_from;
    });
    define("effects/folder_add", ["require", "exports", "effects/common_exists", "effects/common_stat", "effects/folder_create", "effects/folder_copy_to", "effects/file_copy_to"], function (require, exports, common_exists_5, common_stat_8, folder_create_6, folder_copy_to_2, file_copy_to_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function folder_add(folder, remote) {
            if (!(await common_exists_5.common_exists(remote))) {
                throw Error(`Cannot add '${remote}' to folder as the path does not exist.`);
            }
            await folder_create_6.folder_create(folder);
            const stat = await common_stat_8.common_stat(remote);
            if (stat.isDirectory()) {
                await folder_copy_to_2.folder_copy_to(remote, folder);
            }
            if (stat.isFile()) {
                await file_copy_to_2.file_copy_to(remote, folder);
            }
        }
        exports.folder_add = folder_add;
    });
    define("effects/folder_hash", ["require", "exports", "effects/common_readdir_flatmap", "effects/file_hash", "crypto", "path"], function (require, exports, common_readdir_flatmap_3, file_hash_1, crypto_2, path_13) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function folder_hash(folder, algorithm = 'sha1') {
            const hashes = [];
            for (const { stat, path, folder: _folder } of await common_readdir_flatmap_3.common_readdir_flatmap(folder)) {
                const name = Buffer.from(path_13.basename(path));
                hashes.push(crypto_2.createHash('md5').update(name).digest('hex'));
                if (stat.isFile()) {
                    hashes.push(await file_hash_1.file_hash(path_13.join(_folder, path), algorithm));
                }
            }
            const buffer = Buffer.from(hashes.join(''));
            return crypto_2.createHash('md5').update(buffer).digest('hex');
        }
        exports.folder_hash = folder_hash;
    });
    define("effects/folder_merge_from", ["require", "exports", "effects/common_stat", "effects/folder_create", "effects/folder_copy_to", "effects/file_copy_to", "fs", "util", "path"], function (require, exports, common_stat_9, folder_create_7, folder_copy_to_3, file_copy_to_3, fs_22, util_17, path_14) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const readdirAsync = util_17.promisify(fs_22.readdir);
        async function folder_merge_from(folder, remote) {
            console.log('creating folder', folder);
            await folder_create_7.folder_create(folder);
            for (const content of await readdirAsync(remote)) {
                const path = path_14.join(remote, content);
                const stat = await common_stat_9.common_stat(path);
                if (stat.isDirectory()) {
                    await folder_copy_to_3.folder_copy_to(path, folder);
                }
                if (stat.isFile()) {
                    await file_copy_to_3.file_copy_to(path, folder);
                }
            }
        }
        exports.folder_merge_from = folder_merge_from;
    });
    define("effects/folder_remove", ["require", "exports", "effects/common_stat", "effects/common_exists", "effects/file_delete", "effects/folder_delete", "path"], function (require, exports, common_stat_10, common_exists_6, file_delete_4, folder_delete_4, path_15) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function folder_remove(folder, name) {
            const remove = path_15.join(folder, name);
            if (await common_exists_6.common_exists(remove)) {
                const stat = await common_stat_10.common_stat(remove);
                if (stat.isDirectory()) {
                    await folder_delete_4.folder_delete(remove);
                }
                if (stat.isFile()) {
                    await file_delete_4.file_delete(remove);
                }
            }
        }
        exports.folder_remove = folder_remove;
    });
    define("effects/folder_rename", ["require", "exports", "effects/file_exists", "effects/folder_exists", "path", "util", "fs"], function (require, exports, file_exists_11, folder_exists_8, path_16, util_18, fs_23) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        const renameAsync = util_18.promisify(fs_23.rename);
        async function folder_rename(folder, newname) {
            const target = path_16.join(path_16.dirname(folder), newname);
            if (!await folder_exists_8.folder_exists(folder)) {
                throw Error(`Cannot rename '${folder}' as it does not exist.`);
            }
            if (await folder_exists_8.folder_exists(target)) {
                throw Error(`Cannot rename '${folder}' to '${newname}' as a folder with this name already exists.`);
            }
            if (await file_exists_11.file_exists(target)) {
                throw Error(`Cannot rename '${folder}' to '${newname}' as a file with this name already exists.`);
            }
            await renameAsync(folder, target);
        }
        exports.folder_rename = folder_rename;
    });
    define("effects/folder_size", ["require", "exports", "effects/common_readdir_flatmap", "effects/folder_exists"], function (require, exports, common_readdir_flatmap_4, folder_exists_9) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function folder_size(folder) {
            if (await folder_exists_9.folder_exists(folder)) {
                const items = await common_readdir_flatmap_4.common_readdir_flatmap(folder);
                return items.reduce((acc, { stat }) => {
                    return acc + stat.size;
                }, 0);
            }
            return 0;
        }
        exports.folder_size = folder_size;
    });
    define("effects/folder_stat", ["require", "exports", "effects/common_stat"], function (require, exports, common_stat_11) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        async function folder_stat(folder) {
            const stat = await common_stat_11.common_stat(folder);
            if (!stat.isDirectory()) {
                throw Error(`Cannot get folder stat on '${folder}' as its not a folder.`);
            }
            return stat;
        }
        exports.folder_stat = folder_stat;
    });
    define("effects/shell_execute", ["require", "exports", "child_process"], function (require, exports, child_process_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function start_options(cmd) {
            const components = cmd.split(' ')
                .map(component => component.trim())
                .filter(component => component.length > 0);
            if (/^win/.test(process.platform)) {
                const command = 'cmd';
                const options = ['/c', ...components];
                return { command, options };
            }
            else {
                const command = 'sh';
                const options = ['-c', components.join(' ')];
                return { command, options };
            }
        }
        function shell_execute(command, out, err, exitcode) {
            return new Promise((resolve, reject) => {
                const options = start_options(command);
                const sub = child_process_1.spawn(options.command, options.options);
                sub.stdout.setEncoding('utf8');
                sub.stderr.setEncoding('utf8');
                sub.stdout.on('data', (data) => out(data));
                sub.stderr.on('data', (data) => err(data));
                sub.on('error', error => reject(error));
                sub.on('close', code => {
                    if (code !== exitcode) {
                        const error = new Error(`Shell command '${command}' ended with unexpected exit code. Expected ${exitcode}, got ${code}`);
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
                process.on('exit', () => {
                    try {
                        sub.kill();
                    }
                    catch { }
                });
            });
        }
        exports.shell_execute = shell_execute;
    });
    define("effects/index", ["require", "exports", "effects/common_delete", "effects/common_exists", "effects/common_readable_from", "effects/common_readable", "effects/common_readdir_flatmap", "effects/common_readdir", "effects/common_stat", "effects/contents_copy_to", "effects/contents_move_to", "effects/contents_delete", "effects/file_append_from", "effects/file_append", "effects/file_copy_to", "effects/file_create", "effects/file_delete", "effects/file_edit", "effects/file_exists", "effects/file_hash", "effects/file_move_to", "effects/file_prepend_from", "effects/file_prepend", "effects/file_read", "effects/file_rename", "effects/file_size", "effects/file_stat", "effects/file_truncate", "effects/file_write_from", "effects/file_write", "effects/folder_add", "effects/folder_copy_to", "effects/folder_create", "effects/folder_delete", "effects/folder_exists", "effects/folder_hash", "effects/folder_merge_from", "effects/folder_move_to", "effects/folder_remove", "effects/folder_rename", "effects/folder_size", "effects/folder_stat", "effects/shell_execute"], function (require, exports, common_delete_1, common_exists_7, common_readable_from_4, common_readable_5, common_readdir_flatmap_5, common_readdir_3, common_stat_12, contents_copy_to_1, contents_move_to_1, contents_delete_1, file_append_from_1, file_append_3, file_copy_to_4, file_create_6, file_delete_5, file_edit_1, file_exists_12, file_hash_2, file_move_to_2, file_prepend_from_1, file_prepend_2, file_read_3, file_rename_1, file_size_1, file_stat_2, file_truncate_1, file_write_from_1, file_write_4, folder_add_1, folder_copy_to_4, folder_create_8, folder_delete_5, folder_exists_10, folder_hash_1, folder_merge_from_1, folder_move_to_2, folder_remove_1, folder_rename_1, folder_size_1, folder_stat_1, shell_execute_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.common_delete = common_delete_1.common_delete;
        exports.common_exists = common_exists_7.common_exists;
        exports.common_readable_from = common_readable_from_4.common_readable_from;
        exports.common_readable = common_readable_5.common_readable;
        exports.common_readdir_flatmap = common_readdir_flatmap_5.common_readdir_flatmap;
        exports.common_readdir = common_readdir_3.common_readdir;
        exports.common_stat = common_stat_12.common_stat;
        exports.contents_copy_to = contents_copy_to_1.contents_copy_to;
        exports.contents_move_to = contents_move_to_1.contents_move_to;
        exports.contents_delete = contents_delete_1.contents_delete;
        exports.file_append_from = file_append_from_1.file_append_from;
        exports.file_append = file_append_3.file_append;
        exports.file_copy_to = file_copy_to_4.file_copy_to;
        exports.file_create = file_create_6.file_create;
        exports.file_delete = file_delete_5.file_delete;
        exports.file_edit = file_edit_1.file_edit;
        exports.file_exists = file_exists_12.file_exists;
        exports.file_hash = file_hash_2.file_hash;
        exports.file_move_to = file_move_to_2.file_move_to;
        exports.file_prepend_from = file_prepend_from_1.file_prepend_from;
        exports.file_prepend = file_prepend_2.file_prepend;
        exports.file_read = file_read_3.file_read;
        exports.file_rename = file_rename_1.file_rename;
        exports.file_size = file_size_1.file_size;
        exports.file_stat = file_stat_2.file_stat;
        exports.file_truncate = file_truncate_1.file_truncate;
        exports.file_write_from = file_write_from_1.file_write_from;
        exports.file_write = file_write_4.file_write;
        exports.folder_add = folder_add_1.folder_add;
        exports.folder_copy_to = folder_copy_to_4.folder_copy_to;
        exports.folder_create = folder_create_8.folder_create;
        exports.folder_delete = folder_delete_5.folder_delete;
        exports.folder_exists = folder_exists_10.folder_exists;
        exports.folder_hash = folder_hash_1.folder_hash;
        exports.folder_merge_from = folder_merge_from_1.folder_merge_from;
        exports.folder_move_to = folder_move_to_2.folder_move_to;
        exports.folder_remove = folder_remove_1.folder_remove;
        exports.folder_rename = folder_rename_1.folder_rename;
        exports.folder_size = folder_size_1.folder_size;
        exports.folder_stat = folder_stat_1.folder_stat;
        exports.shell_execute = shell_execute_1.shell_execute;
    });
    define("effect", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
    });
    define("file", ["require", "exports", "effects/index", "path"], function (require, exports, eff, path_17) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class File {
            constructor(current, effects) {
                this.current = current;
                this.effects = effects;
            }
            copy_to(folder) {
                const next = path_17.join(folder, path_17.basename(this.current));
                return new File(next, [...this.effects, () => {
                        return eff.file_copy_to(this.current, folder);
                    }]);
            }
            move_to(folder) {
                const next = path_17.join(folder, path_17.basename(this.current));
                return new File(next, [...this.effects, () => {
                        return eff.file_move_to(this.current, folder);
                    }]);
            }
            create() {
                return new File(this.current, [...this.effects, () => {
                        return eff.file_create(this.current);
                    }]);
            }
            delete() {
                return new File(this.current, [...this.effects, () => {
                        return eff.file_delete(this.current);
                    }]);
            }
            truncate() {
                return new File(this.current, [...this.effects, () => {
                        return eff.file_truncate(this.current);
                    }]);
            }
            append_from(path) {
                return new File(this.current, [...this.effects, () => {
                        return eff.file_append_from(this.current, path);
                    }]);
            }
            append(content) {
                return new File(this.current, [...this.effects, () => {
                        return eff.file_append(this.current, content);
                    }]);
            }
            write_from(path) {
                return new File(this.current, [...this.effects, () => {
                        return eff.file_write_from(this.current, path);
                    }]);
            }
            write(content) {
                return new File(this.current, [...this.effects, () => {
                        return eff.file_write(this.current, content);
                    }]);
            }
            prepend_from(path) {
                return new File(this.current, [...this.effects, () => {
                        return eff.file_prepend_from(this.current, path);
                    }]);
            }
            prepend(content) {
                return new File(this.current, [...this.effects, () => {
                        return eff.file_prepend(this.current, content);
                    }]);
            }
            rename(newname) {
                const next = path_17.join(path_17.dirname(this.current), newname);
                return new File(next, [...this.effects, () => {
                        return eff.file_rename(this.current, newname);
                    }]);
            }
            edit(find, replace) {
                return new File(this.current, [...this.effects, () => {
                        return eff.file_edit(this.current, find, replace);
                    }]);
            }
            async size() {
                await this.exec();
                return eff.file_size(this.current);
            }
            async stat() {
                await this.exec();
                return eff.file_stat(this.current);
            }
            async exists() {
                await this.exec();
                return eff.file_exists(this.current);
            }
            async hash(algorithm = 'sha1') {
                await this.exec();
                return eff.file_hash(this.current, algorithm);
            }
            async read(...args) {
                await this.exec();
                return eff.file_read(this.current, ...args);
            }
            async exec() {
                while (this.effects.length > 0) {
                    const effect = this.effects.shift();
                    await effect();
                }
            }
        }
        exports.File = File;
    });
    define("contents", ["require", "exports", "effects/index"], function (require, exports, eff) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class Contents {
            constructor(current, effects) {
                this.current = current;
                this.effects = effects;
            }
            copy_to(folder) {
                const next = folder;
                return new Contents(next, [...this.effects, () => {
                        return eff.contents_copy_to(this.current, folder);
                    }]);
            }
            move_to(folder) {
                const next = folder;
                return new Contents(next, [...this.effects, () => {
                        return eff.contents_move_to(this.current, folder);
                    }]);
            }
            delete() {
                return new Contents(this.current, [...this.effects, async () => {
                        return eff.contents_delete(this.current);
                    }]);
            }
            async exec() {
                while (this.effects.length > 0) {
                    const effect = this.effects.shift();
                    await effect();
                }
            }
        }
        exports.Contents = Contents;
    });
    define("folder", ["require", "exports", "contents", "effects/index", "path"], function (require, exports, contents_1, eff, path_18) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class Folder {
            constructor(current, effects) {
                this.current = current;
                this.effects = effects;
            }
            copy_to(folder) {
                const next = path_18.join(folder, path_18.basename(this.current));
                return new Folder(next, [...this.effects, () => {
                        return eff.folder_copy_to(this.current, folder);
                    }]);
            }
            move_to(folder) {
                const next = path_18.join(folder, path_18.basename(this.current));
                return new Folder(next, [...this.effects, () => {
                        return eff.folder_move_to(this.current, folder);
                    }]);
            }
            create() {
                return new Folder(this.current, [...this.effects, () => {
                        return eff.folder_create(this.current);
                    }]);
            }
            delete() {
                return new Folder(this.current, [...this.effects, () => {
                        return eff.folder_delete(this.current);
                    }]);
            }
            rename(newname) {
                const next = path_18.join(path_18.dirname(this.current), newname);
                return new Folder(next, [...this.effects, () => {
                        return eff.folder_rename(this.current, newname);
                    }]);
            }
            merge_from(folder) {
                return new Folder(this.current, [...this.effects, () => {
                        return eff.folder_merge_from(this.current, folder);
                    }]);
            }
            add(path) {
                return new Folder(this.current, [...this.effects, () => {
                        return eff.folder_add(this.current, path);
                    }]);
            }
            remove(source) {
                return new Folder(this.current, [...this.effects, () => {
                        return eff.folder_remove(this.current, source);
                    }]);
            }
            contents() {
                return new contents_1.Contents(this.current, [...this.effects]);
            }
            async size() {
                await this.exec();
                return eff.folder_size(this.current);
            }
            async stat() {
                await this.exec();
                return eff.folder_stat(this.current);
            }
            async exists() {
                await this.exec();
                return eff.folder_exists(this.current);
            }
            async hash(algorithm) {
                await this.exec();
                return eff.folder_hash(this.current, algorithm);
            }
            async exec() {
                while (this.effects.length > 0) {
                    const effect = this.effects.shift();
                    await effect();
                }
            }
        }
        exports.Folder = Folder;
    });
    define("shell", ["require", "exports", "effects/shell_execute"], function (require, exports, shell_execute_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class Shell {
            constructor(_command, _out, _err, _expect) {
                this._command = _command;
                this._out = _out;
                this._err = _err;
                this._expect = _expect;
            }
            out(func) {
                return new Shell(this._command, func, this._err, this._expect);
            }
            err(func) {
                return new Shell(this._command, this._out, func, this._expect);
            }
            log(func) {
                return new Shell(this._command, func, func, this._expect);
            }
            expect(exitcode) {
                return new Shell(this._command, this._out, this._err, exitcode);
            }
            exec() {
                return shell_execute_2.shell_execute(this._command, this._out, this._err, this._expect);
            }
        }
        exports.Shell = Shell;
    });
    define("effects/watch_execute", ["require", "exports", "fs", "path"], function (require, exports, fs_24, path_19) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class Debounce {
            constructor(timeout, max_resets = 256) {
                this.timeout = timeout;
                this.max_resets = max_resets;
                this.processing = false;
                this.resets = 0;
            }
            run(func) {
                if (this.processing) {
                    return;
                }
                this.resets += 1;
                clearTimeout(this.timer);
                if (this.resets >= this.max_resets) {
                    throw Error(`Exceeded maximum debounce count on watch.`);
                }
                this.timer = setTimeout(async () => {
                    this.resets = 0;
                    this.processing = true;
                    await func();
                    this.processing = false;
                }, this.timeout);
            }
        }
        function watch_execute(path, funcs, timeout) {
            return new Promise((_, reject) => {
                const debounce = new Debounce(timeout);
                const watcher = fs_24.watch(path, { recursive: true }, async (_, path) => {
                    debounce.run(async () => {
                        for (const func of funcs) {
                            try {
                                await func(path_19.resolve(path));
                            }
                            catch (error) {
                                reject(error);
                                watcher.close();
                            }
                        }
                    });
                });
            });
        }
        exports.watch_execute = watch_execute;
    });
    define("watch", ["require", "exports", "effects/watch_execute"], function (require, exports, watch_execute_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        class Watch {
            constructor(path, funcs, _timeout) {
                this.path = path;
                this.funcs = funcs;
                this._timeout = _timeout;
            }
            timeout(timeout) {
                return new Watch(this.path, [...this.funcs], timeout);
            }
            run(func) {
                return new Watch(this.path, [...this.funcs, func], this._timeout);
            }
            exec() {
                return watch_execute_1.watch_execute(this.path, this.funcs, this._timeout);
            }
        }
        exports.Watch = Watch;
    });
    define("index", ["require", "exports", "file", "folder", "shell", "watch"], function (require, exports, file_1, folder_1, shell_1, watch_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        function folder(folder) {
            return new folder_1.Folder(folder, []);
        }
        exports.folder = folder;
        function file(file) {
            return new file_1.File(file, []);
        }
        exports.file = file;
        function watch(path) {
            return new watch_1.Watch(path, [], 250);
        }
        exports.watch = watch;
        function shell(command) {
            return new shell_1.Shell(command, data => process.stdout.write(data), data => process.stderr.write(data), 0);
        }
        exports.shell = shell;
    });
    //# sourceMappingURL=index.js.map
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            const dependencies = ['exports'];
            const factory = (exports) => {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies, factory };
        }
    }
    const instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        const define = get_define(name);
        instances[name] = {};
        const dependencies = define.dependencies.map(name => resolve(name));
        define.factory(...dependencies);
        const exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve(entry[0]);
    }
})();