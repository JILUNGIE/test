interface IDeviceInfo {
  path: string;
  baudRate: number;
}

class CheckBoxStore {
  private checkedMap = new Map<string, IDeviceInfo>();
  private listener: (() => void)[] = [];

  public changeOption(deviceInfo: IDeviceInfo) {
    if (this.checkedMap.has(deviceInfo.path)) {
      this.checkedMap.set(deviceInfo.path, deviceInfo);
    }

    this.notify();
  }

  public toggle(deviceInfo: IDeviceInfo) {
    if (this.checkedMap.has(deviceInfo.path)) {
      this.checkedMap.delete(deviceInfo.path);
    } else {
      this.checkedMap.set(deviceInfo.path, deviceInfo);
    }

    this.notify();
  }

  public isChecked(path: string) {
    return this.checkedMap.has(path);
  }

  public getChecked() {
    return Array.from(this.checkedMap.values());
  }

  public subscribe(listener: () => void) {
    this.listener.push(listener);

    return () => {
      this.listener = this.listener.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listener.forEach((listener) => listener());
  }
}

const checkBoxStore = new CheckBoxStore();
export default checkBoxStore;
