import { SerialPort } from "serialport";

interface IPortInfo {
  path: string;
  baudRate: number;
}

class serialModule {
  private portList: Map<string, SerialPort> = new Map();

  public async detecedlist() {
    return await SerialPort.list();
  }

  public async checkPortList() {
    const ports = await this.detecedlist();

    for (const [key] of this.portList) {
      const isAlive = ports.some((port) => port.path === key);
      if (!isAlive) {
        this.portList.delete(key);
      }
    }
  }

  public connectedList() {
    const obj = Object.fromEntries(this.portList);
    const arr = Object.entries(obj).map(([path, SerialPort]) => ({
      path,
      baudRate: SerialPort.baudRate,
    }));

    return arr;
  }

  private _connect(
    path: string,
    baudRate: number,
    handler: (chunk: number[]) => void,
    timeout: number
  ) {
    return new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(`${port.path} connect timeout!`);
      }, timeout);
      const port = new SerialPort({
        path,
        baudRate,
        autoOpen: false,
      });

      port.open((err) => {
        if (err) {
          clearTimeout(timer);
          return reject(String(err));
        }
        port.on("data", (chunk) => handler(chunk));
        this.portList.set(port.path, port);
        clearTimeout(timer);
        return resolve(`${port.path} connect done!`);
      });
    });
  }

  private _disconnect(path: string, timeout: number) {
    return new Promise<string>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(`${path} disconnect timeout!`),
        timeout
      );
      const port = this.portList.get(path);

      port?.close((err) => {
        if (err) {
          clearTimeout(timer);
          return reject(err);
        }
        clearTimeout(timer);
        this.portList.delete(path);
        return resolve(`${path} disconnect done!`);
      });
    });
  }

  private _write(path: string, data: number[], timeout: number) {
    return new Promise<string>((resolve, reject) => {
      if (!this.portList.has(path)) {
        return reject(`${path} can't control?`);
      }
      const timer = setTimeout(
        () => reject(`${path} disconnect timeout!`),
        timeout
      );

      this.portList.get(path)?.write(data, undefined, (err) => {
        if (err) {
          clearTimeout(timer);
          return reject(err);
        }
        clearTimeout(timer);
        return resolve(`${path} send done!`);
      });
    });
  }

  public async connect(ports: IPortInfo[], handler: (msg: number[]) => void) {
    const result = [];
    for (const port of ports) {
      try {
        const ret = await this._connect(
          port.path,
          port.baudRate,
          handler,
          1000
        );
        result.push(ret);
      } catch (err) {
        result.push(err);
      }
    }

    return result;
  }

  public async disconnect(ports: IPortInfo[]) {
    const result = [];
    for (const port of ports) {
      try {
        const ret = await this._disconnect(port.path, 1000);
        result.push(ret);
      } catch (err) {
        result.push(err);
      }
    }
    return result;
  }

  public async write(ports: IPortInfo[], data: number[]) {
    const result = [];
    for (const port of ports) {
      console.log(port);
      try {
        const ret = await this._write(port.path, data, 1000);
        result.push(ret);
      } catch (err) {
        result.push(err);
      }
    }
    return result;
  }
}

export default serialModule;
