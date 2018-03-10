const { app, Tray, net, BrowserWindow, ipcMain, Menu } = require("electron");

// Windows Setup
if (checkWindowsSetup()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function checkWindowsSetup() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      spawnUpdate(['--createShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      app.quit();
      return true;
  }
};


// Main

const baseDir = process.env.APP_PATH || __dirname;
const assetPath = (file) => `${baseDir}/${file}`;

const success = assetPath("green24.png");
const failure = assetPath("red24.png");
const loading = assetPath("loading24.png");

const CHECK_INTERVAL_MIN = 10;

let tray = null;

const connectivityEvents = () => {
  const onlineStatusPage = assetPath("online-status.html");
  const onlineStatusWindow = new BrowserWindow({ width: 0, height: 0, show: false });

  onlineStatusWindow.loadURL(`file:\/\/${onlineStatusPage}`);

  return "online-status-changed";
};

const changeImage = (img) => tray.setImage(img);

const renderFailure = () => changeImage(failure);

const renderSuccess = () => changeImage(success);

const hazInternetz = () => {
  changeImage(loading);

  const request = net.request("http://www.google.com");
  request.on("response", renderSuccess);
  request.on("error", renderFailure);

  request.end();
};

const processConnectivityChange = (_, online) => {
  if(online) {
    hazInternetz();
  } else {
    renderFailure();
  }
};

const createMenu = () => {
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', click: () => app.quit()}
  ])
  tray.setContextMenu(contextMenu)
};

const main = () => {
  tray = new Tray(loading);

  createMenu();
  tray.on("right-click", hazInternetz);

  setInterval(hazInternetz, CHECK_INTERVAL_MIN * 60000);

  ipcMain.on(connectivityEvents(), processConnectivityChange);

  hazInternetz();
};

app.dock && app.dock.hide();
app.on("ready", main);
