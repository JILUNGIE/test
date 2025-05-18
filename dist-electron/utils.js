import { ipcMain } from "electron";
const PORT = 5173;
const isDev = () => {
    if (process.env.NODE_ENV === "development") {
        return true;
    }
    return false;
};
function ipcWebContentsSend(key, webContents, payload) {
    webContents.send(key, payload);
}
function sendErrorMsg(webContents, msg) {
    ipcWebContentsSend("channel-error_message", webContents, msg);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ipcMainOn(key, handler) {
    ipcMain.on(key, (event, payload) => handler(event, payload));
}
export { PORT, isDev, ipcWebContentsSend, ipcMainOn, sendErrorMsg };
