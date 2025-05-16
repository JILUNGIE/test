import { WebContents } from "electron";

const PORT = 5173;

const isDev = () => {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return false;
};

export { PORT, isDev };

function ipcWebContentsSend<T = string>(
  key: string,
  webContents: WebContents,
  payload: T
) {
  webContents.send(key, payload);
}

export { ipcWebContentsSend };
