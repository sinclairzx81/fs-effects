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

import { folder_delete }          from '../../src/effects/folder_delete'
import { common_readdir_flatmap } from '../../src/effects/common_readdir_flatmap'
import { folder_create }          from '../../src/effects/folder_create'
import { folder_exists }          from '../../src/effects/folder_exists'
import { file_create }            from '../../src/effects/file_create'
import { run_root }               from '../support'
import { expect }                 from 'chai'

describe('effects/folder_delete', () => {
  it('should delete a folder', async () => {
    await run_root(async (root, util) => {
      const folder = util.join(root, 'folder')
      await folder_create(util.join(folder, 'folder1'))
      await file_create  (util.join(folder, 'folder1/file1'))
      await file_create  (util.join(folder, 'folder1/file2'))
      await file_create  (util.join(folder, 'folder1/file3'))
      await file_create  (util.join(folder, 'folder1/file4'))
      await folder_create(util.join(folder, 'folder2'))
      await file_create  (util.join(folder, 'folder2/file1'))
      await file_create  (util.join(folder, 'folder2/file2'))
      await file_create  (util.join(folder, 'folder2/file3'))
      await file_create  (util.join(folder, 'folder2/file4'))
      await folder_create(util.join(folder, 'folder3'))
      await file_create  (util.join(folder, 'folder3/file1'))
      await file_create  (util.join(folder, 'folder3/file2'))
      await file_create  (util.join(folder, 'folder3/file3'))
      await file_create  (util.join(folder, 'folder3/file4'))
      await folder_create(util.join(folder, 'folder4'))
      await file_create  (util.join(folder, 'folder4/file1'))
      await file_create  (util.join(folder, 'folder4/file2'))
      await file_create  (util.join(folder, 'folder4/file3'))
      await file_create  (util.join(folder, 'folder4/file4'))
      await folder_create(util.join(folder, 'folder5'))
      await file_create  (util.join(folder, 'folder5/file1'))
      await file_create  (util.join(folder, 'folder5/file2'))
      await file_create  (util.join(folder, 'folder5/file3'))
      await file_create  (util.join(folder, 'folder5/file4'))
      await folder_create(util.join(folder, 'folder6'))
      await file_create  (util.join(folder, 'folder6/file1'))
      await file_create  (util.join(folder, 'folder6/file2'))
      await file_create  (util.join(folder, 'folder6/file3'))
      await file_create  (util.join(folder, 'folder6/file4'))

      expect(await folder_exists(folder)).to.eq(true)

      const items = await common_readdir_flatmap(folder)
      expect(items.length).to.eq(30)

      await folder_delete(folder)
      expect(await folder_exists(folder)).to.eq(false)
    })
  })
})