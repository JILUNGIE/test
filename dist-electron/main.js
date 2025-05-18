import { app } from "electron";
import winManager from "./manager/windowManager.js";
import autoUpdateManager from "./manager/autoUpdateManager.js";
import { ipcMainOn, ipcWebContentsSend, isDev, sendErrorMsg } from "./utils.js";
import usbModule from "./module/usbModule.js";
import serialModule from "./module/serialModule.js";
import packetParserModule from "./module/packetParserModule.js";
const windowManager = new winManager();
const updateManger = new autoUpdateManager({ isAutoRestart: true });
const usbManager = new usbModule();
const serial = new serialModule();
const parser = new packetParserModule();
app.whenReady().then(() => {
    windowManager.createWindow({
        // create update window
        id: "update",
        height: 450,
        width: 750,
        url: "check-update",
        resizeable: true,
        frame: false,
    });
    updateManger.addEventListener((eventType, msg) => {
        ipcWebContentsSend("channel-update", windowManager.getWindow("update").webContents, msg);
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
            }, 2000);
        }
    });
    usbManager.addEventListener(async () => ipcWebContentsSend("channel-detected_port", windowManager.getWindow("home").webContents, await serial.detecedlist()));
    usbManager.addEventListener(() => {
        serial.checkPortList();
        ipcWebContentsSend("channel-connected_port", windowManager.getWindow("home").webContents, serial.connectedList());
    });
    ipcMainOn("channel-detected_port", async () => ipcWebContentsSend("channel-detected_port", windowManager.getWindow("home").webContents, await serial.detecedlist()));
    ipcMainOn("channel-req-port", async (event, payload) => {
        const status = payload.status;
        const portList = payload.portInfo;
        const data = payload.data;
        let errMsg = null;
        if (status === "CONNECT")
            errMsg = await serial.connect(portList, (data) => parser.parser(data, () => ipcWebContentsSend("channel-sensor_data", windowManager.getWindow("home").webContents, { path: portList.path })));
        else if (status === "DISCONNECT")
            errMsg = await serial.disconnect(portList);
        else if (status === "SEND_DATA")
            errMsg = await serial.write(portList, data);
        sendErrorMsg(windowManager.getWindow("home").webContents, errMsg);
        ipcWebContentsSend("channel-connected_port", windowManager.getWindow("home").webContents, serial.connectedList());
    });
    windowManager.getWindow("update").webContents.on("did-finish-load", () => {
        if (isDev()) {
            windowManager.closeWindow("update");
            windowManager.createWindow({
                id: "home",
                height: 720,
                width: 1024,
                url: "home",
                resizeable: true,
            });
        }
        updateManger.checkUpdate();
    });
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});
