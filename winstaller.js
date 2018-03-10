#!/usr/bin/env node

var electronInstaller = require('electron-winstaller');

electronInstaller.createWindowsInstaller({
  appDirectory: 'tmp/WifiNoInternetz-win32-ia32/',
  outputDirectory: 'tmp/WifiNoInternetz-win32-ia32/installer',
  authors: 'Filipe Esperandio',
  description: 'Simple indicator to your connectivity status',
}).then(() => {}, (e) => console.log(`Error: ${e.message}`));
