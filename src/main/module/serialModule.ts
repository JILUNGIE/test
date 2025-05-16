import { SerialPort } from "serialport";

class serialModule {
  private portList: Map<string, SerialPort> = new Map();

  public async list() {
    return await SerialPort.list();
  }
  public connect(
    path: string,
    baudRate: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (chunk: any) => void
  ) {
    return new Promise<string>((resolve) => {
      const port = new SerialPort({
        path,
        baudRate,
        autoOpen: false,
      });

      port.open((err) => {
        if (err) {
          return resolve(String(err));
        }
        port.on("data", (chunk) => handler(chunk));
        this.portList.set(port.path, port);
        return resolve("done");
      });
    });
  }
}

export default serialModule;
