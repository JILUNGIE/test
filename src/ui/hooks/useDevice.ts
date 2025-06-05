import { useState, useEffect } from "react";
import deviceStore from "../store/deviceStore";

function useDevice() {
  const [deviceList, setDeviceList] = useState(deviceStore.getDeviceList());

  useEffect(() => {
    const unsubscribeChannel = window.electron.subscribeChannelPortList(
      (deviceList) => {
        deviceStore.setDeviceList(deviceList);
      }
    );

    return () => {
      unsubscribeChannel();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = deviceStore.subscribe(() => {
      setDeviceList(deviceStore.getDeviceList());
    });

    return () => {
      unsubscribe();
    };
  });

  return {
    deviceList,
  };
}

export default useDevice;
