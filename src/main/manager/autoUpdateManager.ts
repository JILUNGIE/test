import updatePkg from "electron-updater";
const { autoUpdater } = updatePkg;

interface IOption {
  isAutoRestart: boolean;
  allowPrerelease: boolean;
}
interface IListener {
  event: UpdateEventType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => void;
}

class autoUpdateManager {
  private isAutoRestart: boolean;
  constructor(option: IOption) {
    autoUpdater.allowPrerelease = option.allowPrerelease;
    this.isAutoRestart = option.isAutoRestart;
  }

  private listeners: IListener[] = [];

  public checkUpdate() {
    return autoUpdater.checkForUpdates();
  }

  public addEventListener(
    cb: (event: UpdateEventType, data?: number, err?: string) => void
  ) {
    const onChecking = () => cb("checking-for-update");
    const onAvailable = () => cb("update-available");
    const onNotAvailable = () => cb("update-not-available");
    const onError = (err: Error) => cb("error", undefined, err.message);
    const onDownloading = (data: number) => cb("download-progress", data);
    const onDownloaded = () => cb("update-downloaded");
    autoUpdater.on("checking-for-update", onChecking);

    autoUpdater.on("update-available", onAvailable);

    autoUpdater.on("update-not-available", onNotAvailable);

    autoUpdater.on("error", (err) => onError(err));

    autoUpdater.on("download-progress", (progress) =>
      onDownloading(progress.percent)
    );

    autoUpdater.on("update-downloaded", () => {
      if (this.isAutoRestart) {
        onDownloaded();
        autoUpdater.quitAndInstall();
      }
      onDownloaded();
    });

    this.listeners.push({ event: "checking-for-update", handler: onChecking });
    this.listeners.push({ event: "update-available", handler: onAvailable });
    this.listeners.push({
      event: "update-not-available",
      handler: onNotAvailable,
    });
    this.listeners.push({ event: "error", handler: onError });
    this.listeners.push({ event: "download-progress", handler: onDownloading });
    this.listeners.push({ event: "update-downloaded", handler: onDownloaded });
  }

  public removeEventListener() {
    this.listeners.forEach((listener) =>
      autoUpdater.off(listener.event, listener.handler)
    );
  }
}

export default autoUpdateManager;
