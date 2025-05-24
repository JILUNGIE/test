const electron = require("electron");

function ipcOn(key: string, callback: any) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend(key: string, payload: any) {
  electron.ipcRenderer.send(key, payload);
}

function ipcInvoke<T extends keyof ChannelEventMapping>(
  key: T,
  payload: any
): Promise<ChannelEventMapping[T]> {
  return electron.ipcRenderer.invoke(key, payload);
}

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeChannelAppUpdate: (callback) =>
    ipcOn("CHANNEL_APP_UPDATE", (payload: IUpdatePayload) => {
      callback(payload);
    }),
  subscribeChannelPortList: (callback) =>
    ipcOn("CHANNEL_PORT_INFO", (payload: IPortInfo[]) => {
      callback(payload);
    }),
  subscribeErrorMessage: (callback) =>
    ipcOn("channel-error_message", (msg: string[]) => {
      callback(msg);
    }),
  subscribeChannelSerialData: (callback) =>
    ipcOn("CHANNEL_SERIAL_DATA", (data: ISerialData) => callback(data)),
  theme: (payload: IThemePayload) => ipcInvoke("CHANNEL_THEME", payload),
  requestPortList: () => ipcSend("CHANNEL_PORT_INFO", null),
  requestPortActions: (payload: IPortActions) =>
    ipcSend("CHANNEL_PORT_ACTIONS", payload),
} satisfies Window["electron"]);
