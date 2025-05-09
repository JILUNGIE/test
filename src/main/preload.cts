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
    ipcOn("update-channel", (version: string) => {
      callback(version);
    }),
  sendTest: () => ipcSend("test", "hi"),
} satisfies Window["electron"]);
