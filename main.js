const {app, Tray} = require("electron");
const fetch = require("fetch");

let tray = null;

app.on("ready", () => {
  const good = "./green24.png";
  const bad = "./red24.png";
  const loading = "./loading24.png";
  const CHECK_INTERVAL_MIN = 10;

  tray = new Tray(loading);

  function changeImage(img) {
    tray.setImage(img);
  }

  function hazInternetz() {
    console.log("checking");
    changeImage(loading);

    fetch.fetchUrl("http://www.google.com", (error) => {
      console.log("haz internetz", !error);
      changeImage(!error ? good : bad);
    });
  }

  tray.on("click", hazInternetz);
  tray.on("right-click", hazInternetz);

  setInterval(hazInternetz, CHECK_INTERVAL_MIN * 60000);

  hazInternetz();
});

