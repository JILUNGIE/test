import { BrowserWindow } from "electron";
import { isDev, PORT } from "../utils.js";
import { getPreloadPath, getUIPath } from "../utils/pathResolver.js";

interface IWinConfig {
  id: string;
  width?: number;
  height?: number;
  url?: string;
  frame?: boolean;
  resizeable?: boolean;
}

class winManager {
  private windowMap: Map<string, BrowserWindow> = new Map();

  public createWindow(config: IWinConfig) {
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
      window.loadURL(
        config.url
          ? `http://localhost:${PORT}/#/${config.url}`
          : `http://localhost:${PORT}`
      );
    } else {
      window.loadFile(getUIPath(), {
        hash: config.url ?? "",
      });
    }

    window.on("closed", () => {
      this.windowMap.delete(config.id);
    });

    this.windowMap.set(config.id, window);
  }

  public getWindow(id: string) {
    return this.windowMap.get(id) || null;
  }

  public closeWindow(id: string) {
    const window = this.windowMap.get(id);

    if (window) {
      window.close();
    }
  }

  public getAllWindows() {
    return Array.from(this.windowMap.values());
  }

  public closeAllWindow() {
    this.windowMap.forEach((win) => win.close());
    this.windowMap.clear();
  }

  public isWindowAlive(id: string) {
    return this.windowMap.has(id);
  }
}

export default winManager;
