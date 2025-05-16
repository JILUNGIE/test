import { app } from "electron";
import winManager from "./manager/windowManager.js";
import autoUpdateManager from "./manager/autoUpdateManager.js";
import { ipcWebContentsSend, isDev } from "./utils.js";
import usbModule from "./module/usbModule.js";
import serialModule from "./module/serialModule.js";

const windowManager = new winManager();
const updateManger = new autoUpdateManager({ isAutoRestart: true });
const usbManager = new usbModule();
const serial = new serialModule();

app.whenReady().then(() => {
  windowManager.createWindow({
    id: "update",
    height: 450,
    width: 750,
    url: "check-update",
    resizeable: true,
    frame: false,
  });

  updateManger.eventListener((eventType, msg) => {
    ipcWebContentsSend(
      "update-channel",
      windowManager.getWindow("update")!.webContents,
      msg
    );

    if (eventType === "UPDATE_NOT_AVAILABLE") {
      setTimeout(() => {
        windowManager.closeWindow("update");

        windowManager.createWindow({
          id: "home",
          height: 1920,
          width: 1080,
          url: "home",
          resizeable: true,
        });
      }, 1000);
    }
  });

  usbManager.addEventListener(async () =>
    ipcWebContentsSend(
      "detected-port-list",
      windowManager.getWindow("home")!.webContents,
      await serial.list()
    )
  );

  windowManager.getWindow("update")!.webContents.on("did-finish-load", () => {
    if (isDev()) {
      windowManager.closeWindow("update");
      windowManager.createWindow({
        id: "home",
        height: 1920,
        width: 1080,
        url: "home",
        resizeable: true,
      });
    }

    updateManger.checkUpdate();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
