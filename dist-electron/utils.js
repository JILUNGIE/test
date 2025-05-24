import { ipcMain } from "electron";
const PORT = 5173;
const isDev = () => {
    if (process.env.NODE_ENV === "development") {
        return true;
    }
    return false;
};
function ipcMainHandle(key, handler) {
    ipcMain.handle(key, (event, payload) => {
        return handler(payload);
    });
}
function ipcWebContentsSend(key, webContents, payload) {
    webContents.send(key, payload);
}
function sendErrorMsg(webContents, msg) {
    // ipcWebContentsSend("CHANNEL_APP_UPDATE", webContents, {
    //   event:""
    // });
}
function ipcMainOn(key, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
handler) {
    ipcMain.on(key, (event, payload) => handler(event, payload));
}
export { PORT, isDev, ipcMainHandle, ipcWebContentsSend, ipcMainOn, sendErrorMsg, };
