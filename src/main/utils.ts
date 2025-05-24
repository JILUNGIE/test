import { ipcMain, WebContents } from "electron";

const PORT = 5173;

const isDev = () => {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return false;
};

function ipcMainHandle<T extends keyof ChannelEventMapping>(
  key: T,
  handler: (payload: ChannelEventMapping[T]) => ChannelEventMapping[T]
) {
  ipcMain.handle(key, (event, payload) => {
    return handler(payload);
  });
}

function ipcWebContentsSend<T extends keyof ChannelEventMapping>(
  key: T,
  webContents: WebContents,
  payload: ChannelEventMapping[T]
) {
  webContents.send(key, payload);
}
function sendErrorMsg(webContents: WebContents, msg: string[]) {
  // ipcWebContentsSend("CHANNEL_APP_UPDATE", webContents, {
  //   event:""
  // });
}

function ipcMainOn<T extends keyof ChannelEventMapping>(
  key: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (event: any, payload: ChannelEventMapping[T]) => void
) {
  ipcMain.on(key, (event, payload) => handler(event, payload));
}

export {
  PORT,
  isDev,
  ipcMainHandle,
  ipcWebContentsSend,
  ipcMainOn,
  sendErrorMsg,
};
