# fs-effects

A library for composing various file, folder, shell and watch operations in node.

[![NPM package](https://badge.fury.io/js/fs-effects.svg)](https://www.npmjs.com/package/fs-effects)  [![Build Status](https://travis-ci.org/sinclairzx81/fs-effects.svg?branch=master)](https://travis-ci.org/sinclairzx81/fs-effects)

```bash
$ npm install fs-effects --save
```

### Example

```typescript
import { file, folder } from 'fs-effects'

// creates 'foo.txt' and writes the string 'hello world'.
await file('foo.txt')
    .write('hello world')
    .exec()

// creates file 'google.html' and writes content from remote url.
await file('google.html')
    .write_from('http://google.com')
    .exec()

// creates a 'dist' folder and merges content from a 'bin' folder
// folder and adds a license and readme.
await folder('dist')
    .merge_from('bin')
    .add('license')
    .add('readme.md')
    .exec()
```

### Reference

The following outlines the fs-effects surface api for `shell`, `watch`, `folder`, `file`. For a more comprehensive description of these functions, refer to the typescript definitions provided with this package. For general example usage, see the `tasks.js` file located in this project root.

```typescript
shell(command)
    .err(func)            // Redirects stderr data to the given function.
    .exec()               // (eval) Executes this shell command.
    .expect(exitcode)     // Sets the expected exitcode for this command. Default is 0.
    .log(func)            // Redirects both stdout and stderr to the given function.
    .out(func)            // Redirects stdout data to the given function.

watch(path)
    .timeout(ms)          // Sets a this watchers debounce timeout (default is 250ms)
    .run(func)            // Runs this function when a file or folder changes.
    .exec()               // Executes this watch (does not complete)

folder(path)
    .add(path)            // Adds a file to this folder. If the path being added exists, it is overwritten.
    .copy_to(folder)      // Copies this folder into the given folder.
    .contents()           // Returns the inner contents of this folder (see contents)
        .copy_to(folder)  // Copies the contents into the given folder.
        .move_to(folder)  // Moves the contents into the given folder.
        .delete()         // Deletes the contents of this folder.
        .exec()           // Executes effects on these contents.
    .create()             // Creates this folder if not exists.
    .delete()             // Deletes this folder if exists.
    .exec()               // (eval) Executes effects on this folder.
    .exists()             // (eval) Returns true if this folder exists.
    .hash(algo?)          // (eval) Returns a hash of this folder with the given algorithm.
    .merge_from(folder)   // Merges the contents from the remote folder into this folder.
    .move_to(folder)      // Moves this folder into the given folder.
    .remove(name)         // Removes a file or folder from this folder.
    .rename(newname)      // Renames this folder.
    .size()               // (eval) Returns the size of this folder in bytes.
    .stat()               // (eval) Returns a fs stats object for this folder.

file(path)
    .append_from(path)    // Appends to this file from a remote path | url. If file not exist, create.
    .append(data)         // Appends to this file. If file not exist, create.
    .copy_to(folder)      // Copies this file into the given folder. 
    .create()             // Creates this file if not exists.
    .delete()             // Deletes this file if exists.
    .edit(find, replace)  // Makes a find and replace edit to this file.
    .exec()               // (eval) Executes effects on this file.
    .exists()             // (eval) Returns true if this file exists.
    .hash(algo?)          // (eval) Returns a hash for this file with the given algorithm.
    .move_to(folder)      // Moves this file into the given folder.
    .prepend_from(path)   // Prepends to this file from a remote path | url. If file not exist, create.
    .prepend(data)        // Prepends to this file. If file not exist, create.
    .read(encoding?)      // (eval) Returns the contents of this file.
    .rename(newname)      // Renames this file.
    .size()               // (eval) Returns the size of this file in bytes.
    .stat()               // (eval) Returns a fs stats object for this file.
    .truncate()           // Truncates this file. If the file does not exist, it is created.
    .write_from(path)     // Writes to this file from a remote path | url. If file not exist, create.
    .write(data)          // Writes to this file. If the file does not exist, it is created.
```

## Project Tasks

The following npm tasks are supported by this project.

```bash
npm run clean       # cleans this project.
npm run start       # starts this project in watch mode.
npm run test        # runs tests for this project.
npm run pack        # packages this project.
```