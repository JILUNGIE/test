class DeviceStore {
  private deviceList: IPortInfo[] = [];
  private listener: (() => void)[] = [];

  public getDeviceList() {
    return this.deviceList;
  }

  public setDeviceList(newDeviceList: IPortInfo[]) {
    this.deviceList = newDeviceList;
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listener.push(listener);
    return () => {
      this.listener.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listener.forEach((listener) => listener());
  }
}

const deviceStore = new DeviceStore();

export default deviceStore;
