const { app, Tray, net, BrowserWindow, ipcMain } = require("electron");

const CHECK_INTERVAL_MIN = 10;

let tray = null;

const connectivityEvents = () => {
  const onlineStatusPage = `file:\/\/${__dirname}/online-status.html`;
  const onlineStatusWindow = new BrowserWindow({ width: 0, height: 0, show: false });

  onlineStatusWindow.loadURL(onlineStatusPage);

  return "online-status-changed";
};

const main = () => {
  const success = "./green24.png";
  const failure = "./red24.png";
  const loading = "./loading24.png";

  tray = new Tray(loading);

  const changeImage = (img) => {
    tray.setImage(img);
  };

  const onFailure = () => changeImage(failure);

  const onSuccess = () => changeImage(success);

  const hazInternetz = () => {
    changeImage(loading);

    const request = net.request("http://www.google.com");
    request.on("response", onSuccess);
    request.on("error", onFailure);

    request.end();
  };

  const processConnectivityChange = (_, online) => {
    if(online) {
      hazInternetz();
    } else {
      onFailure();
    }
  };

  tray.on("click", hazInternetz);
  tray.on("right-click", hazInternetz);

  setInterval(hazInternetz, CHECK_INTERVAL_MIN * 60000);

  ipcMain.on(connectivityEvents(), processConnectivityChange);

  hazInternetz();
};

app.on("ready", main);
