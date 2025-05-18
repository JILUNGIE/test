const electron = require("electron");

function ipcOn(key: string, callback: any) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend(key: string, payload: any) {
  electron.ipcRenderer.send(key, payload);
}

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeAppVersion: (callback) =>
    ipcOn("channel-update", (version: string) => {
      callback(version);
    }),
  subscribeDetectPortList: (callback) =>
    ipcOn("channel-detected_port", (portList: any) => {
      callback(portList);
    }),
  subscribeConnectPortList: (callback) =>
    ipcOn("channel-connected_port", (portList: []) => {
      callback(portList);
    }),
  subscribeErrorMessage: (callback) =>
    ipcOn("channel-error_message", (msg: string[]) => {
      callback(msg);
    }),
  requestDetectPortList: () => ipcSend("channel-detected_port", null),
  reqPort: (status, portInfo, data) =>
    ipcSend("channel-req-port", { status, portInfo, data }),
} satisfies Window["electron"]);
