const {app, Tray, net} = require("electron");

const CHECK_INTERVAL_MIN = 10;

let tray = null;

app.on("ready", () => {
  const success = "./green24.png";
  const failure = "./red24.png";
  const loading = "./loading24.png";
  const CHECK_INTERVAL_MIN = 10;

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
  }

  tray.on("click", hazInternetz);
  tray.on("right-click", hazInternetz);

  setInterval(hazInternetz, CHECK_INTERVAL_MIN * 60000);

  hazInternetz();
});

