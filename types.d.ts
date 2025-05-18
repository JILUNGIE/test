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

interface IReqList {
  path: string;
  baudRate: number;
}

interface Window {
  electron: {
    subscribeAppVersion: (
      callback: (version: string) => void
    ) => UnsubscribeFunction;
    subscribeDetectPortList: (
      callback: (portList) => void
    ) => UnsubscribeFunction;
    subscribeConnectPortList: (
      callback: (portList: []) => void
    ) => UnsubscribeFunction;
    subscribeErrorMessage: (
      callback: (msg: string[]) => void
    ) => UnsubscribeFunction;
    requestDetectPortList: () => void;
    reqPort: (
      status: string,
      reqList: IReqList[] | string[],
      data: number[] | undefined
    ) => void;
  };
}
