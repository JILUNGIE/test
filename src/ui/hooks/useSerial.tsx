import { useEffect, useState } from "react";

function useSerial() {
  const [detectedPortList, setPortList] = useState<PortInfo[]>([]);
  const [connectedPortList, setConnectedPortList] = useState<
    Map<string, number>
  >(new Map());

  const sendData = (path: string[], data: number[]) => {
    window.electron.reqPort("SEND_DATA", path, data);
  };

  useEffect(() => {
    window.electron.subscribeDetectPortList((list) => {
      setPortList(list);
    });

    window.electron.subscribeConnectPortList((list) => {
      const obj2map = new Map(
        list.map(({ path, baudRate }) => [path, baudRate])
      );

      setConnectedPortList(obj2map);
    });
  }, []);
  return { detectedPortList, connectedPortList, sendData };
}

export default useSerial;
