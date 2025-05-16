"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
function ipcOn(key, callback) {
    const cb = (_, payload) => callback(payload);
    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
}
function ipcSend(key, payload) {
    electron.ipcRenderer.send(key, payload);
}
electron.contextBridge.exposeInMainWorld("electron", {
    subscribeAppVersion: (callback) => ipcOn("update-channel", (version) => {
        callback(version);
    }),
    subscribeDetectPortList: (callback) => ipcOn("detected-port-list", (portList) => {
        callback(portList);
    }),
    sendTest: () => ipcSend("test", "hi"),
});
