class packetParserModule {
  private STX = 0xa5;
  private IDX_STX = 0;
  private IDX_CMD = 1;
  private IDX_LEN = 2;
  private buffer: number[] = [];
  private ETX = 0xfe;

  private resultPacket: number[][] = [];

  private reqCommandMap = new Map<number, string>([
    [0x02, "REQ_BAT_STATUS"],
    [0x04, "REQ_SENSOR_RAW_DATA"],
    [0x07, "REQ_SENSOR_RPY_DATA"],
  ]);

  private eventParser(packet: number[]) {
    let temp;
    const reqCmd = this.reqCommandMap.get(packet[2]);

    switch (reqCmd) {
      case "REQ_BAT_STATUS":
        temp = {
          cmd: reqCmd,
          data: packet[3],
        };

        break;
    }
    return temp;
  }

  public parser(packet: number[], callback: () => void) {
    let checksum = 0;
    this.buffer.push(...packet);

    while (this.buffer.length > 7) {
      console.log("PACKET: ", this.buffer);
      if (this.buffer[this.IDX_STX] === this.STX) {
        console.log("1: PASS STX");
        if (!this.reqCommandMap.has(this.buffer[this.IDX_CMD])) {
          this.buffer.shift();
          continue;
        }

        const dataLength = this.buffer[this.IDX_LEN];
        console.log("1-1 dataLenth: ", dataLength);

        for (let i = 0; i <= dataLength + 2; i++) {
          console.log("1-2 checksum cal: ", this.buffer[i]);
          checksum += this.buffer[i];
        }

        checksum = checksum % 256;
        console.log("1-2: ", this.buffer[dataLength + 3], checksum);

        if (this.buffer[dataLength + 3] !== checksum) {
          this.buffer.shift();
          continue;
        }
        console.log("2: PASS CHECKSUM");

        if (
          this.buffer[dataLength + 4] !== this.ETX ||
          this.buffer[dataLength + 5] !== 0x0a ||
          this.buffer[dataLength + 6] !== 0x0d
        ) {
          continue;
        }

        const packet = this.buffer.splice(0, dataLength + 7);

        this.resultPacket.push(packet);
      } else {
        this.buffer.shift();
      }
    }
  }
}

export default packetParserModule;
