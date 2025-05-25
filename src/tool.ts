import { workspace } from 'coc.nvim';

import which from 'which';

export async function getTyBinaryPath() {
  // MEMO: Priority to detect ty binary
  //
  // 1. ty.binaryPath setting
  // 2. current environment

  // 1
  let tyBinaryPath = workspace.getConfiguration('ty').get('binaryPath', '');
  if (!tyBinaryPath) {
    // 2
    tyBinaryPath = which.sync('ty', { nothrow: true }) || '';
  }

  return tyBinaryPath;
}
