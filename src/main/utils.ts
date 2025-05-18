import { ipcMain, WebContents } from "electron";

const PORT = 5173;

const isDev = () => {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return false;
};

function ipcWebContentsSend<T>(
  key: string,
  webContents: WebContents,
  payload: T
) {
  webContents.send(key, payload);
}
function sendErrorMsg(webContents: WebContents, msg: string[]) {
  ipcWebContentsSend("channel-error_message", webContents, msg);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ipcMainOn(key: string, handler: (event: any, payload: any) => void) {
  ipcMain.on(key, (event, payload) => handler(event, payload));
}

export { PORT, isDev, ipcWebContentsSend, ipcMainOn, sendErrorMsg };
