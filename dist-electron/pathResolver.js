import { app } from "electron";
import path from "path";
import { isDev } from "./utils.js";
function getPreloadPath() {
    return path.join(app.getAppPath(), isDev() ? "." : "..", "/dist-electron/preload.cjs");
}
function getUIPath() {
    return path.join(app.getAppPath(), "/dist-react/index.html");
}
function getAssetPath() {
    return path.join(app.getAppPath(), isDev() ? "." : "..", "/src/assets");
}
export { getPreloadPath, getUIPath, getAssetPath };
