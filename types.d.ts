type UnsubscribeFunction = () => void;

interface PortInfo {
  path: string;
  manufacturer: string | undefined;
  serialNumber: string | undefined;
  pnpId: string | undefined;
  locationId: string | undefined;
  productId: string | undefined;
  vendorId: string | undefined;
}

interface Window {
  electron: {
    subscribeAppVersion: (
      callback: (version: string) => void
    ) => UnsubscribeFunction;
    sendTest: () => void;
    subscribeDetectPortList: (
      callback: (portList) => void
    ) => UnsubscribeFunction;
  };
}
