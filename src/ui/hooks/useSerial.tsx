import { useEffect, useRef, useState } from "react";

export const subscribeSerialData = (
  callback: (payload: ISerialData) => void
) => {
  window.electron.subscribeChannelSerialData((paylaod) => callback(paylaod));
};

function useSerial() {
  const [portList, setPortList] = useState<IPortInfo[]>([]);
  const serialErr = useRef("");

  const sendPacket = (path: string[], packet: number[]) => {
    window.electron.requestPortActions({
      event: "WRITE",
      data: {
        path,
        packet,
      },
    });
  };

  useEffect(() => {
    window.electron.subscribeChannelPortList((portList) => {
      setPortList(portList);
    });
  }, []);

  return {
    portList,
    sendPacket,
    serialErr,
  };
}

export default useSerial;
