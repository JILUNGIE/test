import { BrowserWindow } from "electron";
import { isDev, PORT } from "./utils.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
class winManager {
    windowMap = new Map();
    createWindow(config) {
        if (this.windowMap.has(config.id)) {
            this.windowMap.get(config.id)?.focus();
            return;
        }
        const window = new BrowserWindow({
            width: config.width || 1024,
            height: config.height || 768,
            frame: config.frame ?? true,
            resizable: config.resizeable ?? true,
            webPreferences: {
                preload: getPreloadPath(),
            },
        });
        if (isDev()) {
            window.webContents.openDevTools();
            window.loadURL(config.url
                ? `http://localhost:${PORT}/#/${config.url}`
                : `http://localhost:${PORT}`);
        }
        else {
            window.loadFile(getUIPath(), {
                hash: config.url ?? "",
            });
        }
        window.on("closed", () => {
            this.windowMap.delete(config.id);
        });
        this.windowMap.set(config.id, window);
    }
    getWindow(id) {
        return this.windowMap.get(id) || null;
    }
    closeWindow(id) {
        const window = this.windowMap.get(id);
        if (window) {
            window.close();
        }
    }
    getAllWindows() {
        return Array.from(this.windowMap.values());
    }
    closeAllWindow() {
        this.windowMap.forEach((win) => win.close());
        this.windowMap.clear();
    }
    isWindowAlive(id) {
        return this.windowMap.has(id);
    }
}
export default winManager;
