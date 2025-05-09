const PORT = 5173;
const isDev = () => {
    if (process.env.NODE_ENV === "development") {
        return true;
    }
    return false;
};
export { PORT, isDev };
function ipcWebContentsSend(key, webContents, payload) {
    webContents.send(key, payload);
}
export { ipcWebContentsSend };
