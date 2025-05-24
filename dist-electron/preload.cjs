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
function ipcInvoke(key, payload) {
    return electron.ipcRenderer.invoke(key, payload);
}
electron.contextBridge.exposeInMainWorld("electron", {
    subscribeChannelAppUpdate: (callback) => ipcOn("CHANNEL_APP_UPDATE", (payload) => {
        callback(payload);
    }),
    subscribeChannelPortList: (callback) => ipcOn("CHANNEL_PORT_INFO", (payload) => {
        callback(payload);
    }),
    subscribeErrorMessage: (callback) => ipcOn("channel-error_message", (msg) => {
        callback(msg);
    }),
    subscribeChannelSerialData: (callback) => ipcOn("CHANNEL_SERIAL_DATA", (data) => callback(data)),
    theme: (payload) => ipcInvoke("CHANNEL_THEME", payload),
    requestPortList: () => ipcSend("CHANNEL_PORT_INFO", null),
    requestPortActions: (payload) => ipcSend("CHANNEL_PORT_ACTIONS", payload),
});
