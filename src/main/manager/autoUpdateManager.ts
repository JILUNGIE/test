import updatePkg from "electron-updater";
const { autoUpdater } = updatePkg;

interface IOption {
  isAutoRestart: boolean;
}

type UpdateType =
  | "CHECKING"
  | "UPDATE_AVAILABLE"
  | "UPDATE_NOT_AVAILABLE"
  | "ERROR"
  | "DOWNLOADING"
  | "DOWNLOADED";

class autoUpdateManager {
  private isAutoRestart: boolean;
  private noUpdateCallback: (() => void) | null = null;
  constructor(option: IOption) {
    autoUpdater.allowPrerelease = true;
    this.isAutoRestart = option.isAutoRestart;
  }

  public checkUpdate() {
    return autoUpdater.checkForUpdates();
  }

  public addEventListener(cb: (type: UpdateType, msg: string) => void) {
    autoUpdater.on("checking-for-update", () =>
      cb("CHECKING", "업데이트 체크 중....")
    );

    autoUpdater.on("update-available", () =>
      cb("UPDATE_AVAILABLE", "업데이트 있음....")
    );

    autoUpdater.on("update-not-available", () => {
      cb("UPDATE_NOT_AVAILABLE", "업데이트 없음....");
    });

    autoUpdater.on("error", (err) => cb("ERROR", String(err)));

    autoUpdater.on("download-progress", (progressObj) =>
      cb("DOWNLOADING", `${progressObj.percent}%`)
    );

    autoUpdater.on("update-downloaded", () => {
      if (this.isAutoRestart) {
        cb(
          "DOWNLOADED",
          "업데이트 파일 다운로드 완료... 3초 후 다시 시작 합니다."
        );
        return setTimeout(() => {
          autoUpdater.quitAndInstall();
        }, 3000);
      }
      return cb(
        "DOWNLOADED",
        "업데이트 파일 다운로드 완료... 앱을 다시 시작해 주세요..."
      );
    });
  }

  public isNoUpdate(cb: () => void) {
    this.noUpdateCallback = cb;
  }
}

export default autoUpdateManager;
