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
    subscribeAppVersion: (callback) => ipcOn("channel-update", (version) => {
        callback(version);
    }),
    subscribeDetectPortList: (callback) => ipcOn("channel-detected_port", (portList) => {
        callback(portList);
    }),
    subscribeConnectPortList: (callback) => ipcOn("channel-connected_port", (portList) => {
        callback(portList);
    }),
    subscribeErrorMessage: (callback) => ipcOn("channel-error_message", (msg) => {
        callback(msg);
    }),
    requestDetectPortList: () => ipcSend("channel-detected_port", null),
    reqPort: (status, portInfo, data) => ipcSend("channel-req-port", { status, portInfo, data }),
});
