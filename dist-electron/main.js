import { app, nativeTheme } from "electron";
import winManager from "./manager/windowManager.js";
import autoUpdateManager from "./manager/autoUpdateManager.js";
import { ipcMainHandle, ipcMainOn, ipcWebContentsSend, isDev, } from "./utils.js";
import usbModule from "./module/usbModule.js";
import serialModule from "./module/serialModule.js";
import packetParserModule from "./module/packetParserModule.js";
import themeManager from "./manager/themeManager.js";
const windowManager = new winManager();
const updateManger = new autoUpdateManager({
    isAutoRestart: true,
    allowPrerelease: true,
});
const usbManager = new usbModule();
const theme = new themeManager(nativeTheme);
const serial = new serialModule();
const parser = new packetParserModule();
app.whenReady().then(() => {
    windowManager.createWindow({
        // create update window
        id: "update",
        height: 450,
        width: 750,
        url: "check-update",
        resizeable: true,
        frame: false,
    });
    /**
     * UPDATE 이벤트 리스너
     */
    updateManger.addEventListener((event, data, err) => {
        console.log(event);
        switch (event) {
            case "checking-for-update":
                ipcWebContentsSend("CHANNEL_APP_UPDATE", windowManager.getWindow("update").webContents, {
                    event: "checking-for-update",
                    data: {
                        message: "업데이트 확인 중....",
                    },
                });
                break;
            case "update-available":
                ipcWebContentsSend("CHANNEL_APP_UPDATE", windowManager.getWindow("update").webContents, {
                    event: "update-available",
                    data: {
                        message: "업데이트 확인!....",
                    },
                });
                break;
            case "update-not-available":
                ipcWebContentsSend("CHANNEL_APP_UPDATE", windowManager.getWindow("update").webContents, {
                    event: "update-not-available",
                    data: {
                        message: "업데이트 없음....",
                    },
                });
                windowManager.closeWindow("update");
                windowManager.createWindow({
                    id: "home",
                    height: 720,
                    width: 1024,
                    url: "home",
                    resizeable: true,
                });
                break;
            case "error":
                ipcWebContentsSend("CHANNEL_APP_UPDATE", windowManager.getWindow("update").webContents, {
                    event: "error",
                    data: {
                        message: `에러 발생 ${err}`,
                    },
                });
                break;
            case "download-progress":
                ipcWebContentsSend("CHANNEL_APP_UPDATE", windowManager.getWindow("update").webContents, {
                    event: "download-progress",
                    data: {
                        message: `업데이트 진행 중.... ${data}%}`,
                    },
                });
                break;
            case "update-downloaded":
                ipcWebContentsSend("CHANNEL_APP_UPDATE", windowManager.getWindow("update").webContents, {
                    event: "update-downloaded",
                    data: {
                        message: "업데이트 다운로드 완료! 재실행 중...",
                    },
                });
                break;
        }
    });
    /**
     * 테마 정보 송신 및 변경을 위한 IPC 메인 헨들러
     */
    ipcMainHandle("CHANNEL_THEME", (payload) => {
        if (payload.event === "getTheme") {
            return {
                event: "getTheme",
                dark: theme.getCurTheme(),
            };
        }
        else if (payload.event === "toggle") {
            theme.toggleTheme();
            return {
                event: "toggle",
                dark: theme.getCurTheme(),
            };
        }
        throw new Error("Invalid Type");
    });
    /**
     * USB PORT 변경 감지(attach, dettach) 시 전송
     * 또는 port 가 연결 되었을 시에도 전송
     */
    usbManager.addEventListener(async () => ipcWebContentsSend("CHANNEL_PORT_INFO", windowManager.getWindow("home").webContents, await serial.scanPorts()));
    /**
     * Home 페이지가 렌더링 되었을 때, 처음 포트 목록 가져옴
     */
    ipcMainOn("CHANNEL_PORT_INFO", async () => ipcWebContentsSend("CHANNEL_PORT_INFO", windowManager.getWindow("home").webContents, await serial.scanPorts()));
    /**
     * 모든 Port 관련 action 관리
     */
    ipcMainOn("CHANNEL_PORT_ACTIONS", async (event, payload) => {
        switch (payload.event) {
            case "CONNECT": {
                await serial.connect(payload.data.port, (data) => ipcWebContentsSend("CHANNEL_SERIAL_DATA", windowManager.getWindow("home").webContents, {
                    path: data.path,
                    data: parser.parser(data.data),
                }));
                ipcWebContentsSend("CHANNEL_PORT_INFO", windowManager.getWindow("home").webContents, await serial.scanPorts());
                break;
            }
            case "DISCONNECT": {
                await serial.disconnect(payload.data.port);
                ipcWebContentsSend("CHANNEL_PORT_INFO", windowManager.getWindow("home").webContents, await serial.scanPorts());
                break;
            }
            case "WRITE": {
                await serial.write(payload.data.port, payload.data.packet);
                break;
            }
        }
    });
    // ipcMainOn("channel-req-port", async (event, payload) => {
    //   const status = payload.status;
    //   const portList = payload.portInfo;
    //   const data = payload.data;
    //   let errMsg = null;
    //   if (status === "CONNECT")
    //     errMsg = await serial.connect(portList, (data) => {
    //       // ipcWebContentsSend(
    //       //   "CHANNEL_SERIAL_DATA",
    //       //   windowManager.getWindow("home")!.webContents,
    //       //   { data: parser.parser(data) }
    //       // );
    //     });
    //   else if (status === "DISCONNECT")
    //     errMsg = await serial.disconnect(portList);
    //   else if (status === "SEND_DATA")
    //     errMsg = await serial.write(portList, data);
    //   sendErrorMsg(
    //     windowManager.getWindow("home")!.webContents,
    //     errMsg as string[]
    //   );
    //   // ipcWebContentsSend(
    //   //   "",
    //   //   windowManager.getWindow("home")!.webContents,
    //   //   serial.connectedList()
    //   // );
    // });
    windowManager.getWindow("update").webContents.on("did-finish-load", () => {
        if (isDev()) {
            windowManager.closeWindow("update");
            windowManager.createWindow({
                id: "home",
                height: 720,
                width: 1024,
                url: "home",
                resizeable: true,
            });
        }
        updateManger.checkUpdate();
    });
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit();
});
