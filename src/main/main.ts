import { app, ipcMain } from "electron";
import updatePkg from "electron-updater";
const { autoUpdater } = updatePkg;
import windowManager from "./windowManager.js";
import { ipcWebContentsSend } from "./utils.js";

app.whenReady().then(() => {
  windowManager.createWindow({
    id: "update",
    height: 450,
    width: 350,
    url: "check-update",
    resizeable: true,
  });

  autoUpdater.allowPrerelease = true;

  windowManager.getWindow("update")!.webContents.on("did-finish-load", () => {
    autoUpdater.checkForUpdates();

    ipcWebContentsSend(
      "update-channel",
      windowManager.getWindow("update")!.webContents,
      "ready"
    );

    autoUpdater.on("update-available", () => {
      console.log("업데이트 있음.");
      ipcWebContentsSend(
        "update-channel",
        windowManager.getWindow("update")!.webContents,
        "업데이트 있음"
      );
    });

    autoUpdater.on("update-not-available", () => {
      console.log("업데이트 없음.....");
      ipcWebContentsSend(
        "update-channel",
        windowManager.getWindow("update")!.webContents,
        "업데이트 없음....."
      );
    });

    autoUpdater.on("error", (err) => {
      console.log("업데이트 에러:", err);
      ipcWebContentsSend(
        "update-channel",
        windowManager.getWindow("update")!.webContents,
        String(err)
      );
    });
  });

  autoUpdater.on("checking-for-update", () => {
    ipcWebContentsSend(
      "update-channel",
      windowManager.getWindow("update")!.webContents,
      "Searching..."
    );
  });

  // windowManager.createWindow({
  //   id: "main",
  // });

  ipcMain.on("test", (e, a) => {
    console.log(a);
  });

  // app.on("activate", () => {
  //   if (windowManager.getAllWindows().length === 0) {
  //     windowManager.createWindow({
  //       id: "main",
  //     });
  //   }
  // });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
