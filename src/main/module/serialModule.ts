import { SerialPort } from "serialport";

interface IConnectHandler {
  path: string;
  data: number[];
}

class serialModule {
  private portList: IPortInfo[] = [];
  private activeList: Map<string, SerialPort> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private checkPortStatus(portList: any[]) {
    this.activeList.forEach((value, key) => {
      const isTrue = portList.some((port) => port.path === key);
      if (!isTrue) {
        this.activeList.delete(key);
      }
    });
  }

  private updatePortStatus(
    path: string,
    baudRate: number,
    status: "connected" | "disconnected"
  ) {
    this.portList = this.portList.map((port) =>
      port.path === path ? { ...port, status, baudRate } : port
    );
  }

  public async scanPorts() {
    const portList = await SerialPort.list();
    this.checkPortStatus(portList);
    this.portList = portList.map((port) => {
      return {
        path: port.path,
        manufacturer: port.manufacturer || "unknwon",
        baudRate: 115200,
        status: this.activeList.has(port.path) ? "connected" : "disconnected",
      };
    });

    return this.portList;
  }

  private _connect(
    path: string,
    baudRate: number,
    handler: (data: IConnectHandler) => void,
    timeout: number
  ) {
    return new Promise<string>((resolve, reject) => {
      if (this.activeList.has(path)) {
        return reject(`${path} connect already done!`);
      }
      const timer = setTimeout(() => {
        reject(`${port.path} connect timeout!`);
      }, timeout);

      const port = new SerialPort({
        path,
        baudRate,
        autoOpen: false,
      });
      // const parser = port.pipe(new DelimiterParser({ delimiter: "\r" }));

      port.open((err) => {
        if (err) {
          clearTimeout(timer);
          return reject(String(err));
        }
        port.on("data", (chunk) => handler({ path: port.path, data: chunk }));
        this.updatePortStatus(port.path, port.baudRate, "connected");
        this.activeList.set(port.path, port);

        clearTimeout(timer);
        return resolve(`${port.path} connect done!`);
      });
    });
  }

  private _disconnect(path: string, timeout: number) {
    return new Promise<string>((resolve, reject) => {
      if (!this.activeList.has(path)) {
        return reject("Already disconnect");
      }
      const timer = setTimeout(
        () => reject(`${path} disconnect timeout!`),
        timeout
      );
      const port = this.activeList.get(path);

      port!.close((err) => {
        if (err) {
          clearTimeout(timer);
          return reject(err.message);
        }
        clearTimeout(timer);
        this.updatePortStatus(path, 115200, "disconnected");
        this.activeList.delete(path);
        return resolve(`${path} disconnect done!`);
      });
    });
  }

  private _write(path: string, data: number[], timeout: number) {
    return new Promise<string>((resolve, reject) => {
      if (!this.activeList.has(path)) {
        return reject(`${path} No Connected...?`);
      }
      const timer = setTimeout(() => reject(`${path} write timeout!`), timeout);

      this.activeList.get(path)?.write(data, undefined, (err) => {
        if (err) {
          clearTimeout(timer);
          return reject(err);
        }
        clearTimeout(timer);
        return resolve(`${path} send done!`);
      });
    });
  }

  public async connect(
    pathList: string[],
    baudRate: number,
    handler: (data: IConnectHandler) => void
  ) {
    const result = [];
    for (const path of pathList) {
      try {
        await this._connect(path, baudRate, handler, 1000);
      } catch (err) {
        result.push({ path, err });
      }
    }

    return result;
  }

  public async disconnect(pathList: string[]) {
    const result = [];
    for (const path of pathList) {
      try {
        await this._disconnect(path, 1000);
      } catch (err) {
        result.push({ path: path, err });
      }
    }
    return result;
  }

  public async write(pathList: string[], data: number[]) {
    const result = [];
    for (const path of pathList) {
      try {
        await this._write(path, data, 1000);
      } catch (err) {
        result.push(err);
      }
    }
    return result;
  }
}

export default serialModule;
