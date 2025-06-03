type UnsubscribeFunction = () => void;

type UpdateEventType =
  | "checking-for-update"
  | "update-available"
  | "update-not-available"
  | "error"
  | "download-progress"
  | "update-downloaded";

interface IPortInfo {
  path: string;
  manufacturer: string | "unknwon";
  baudRate: number;
  status: "disconnected" | "connected";
}

interface IPortActions {
  event: "CONNECT" | "DISCONNECT" | "WRITE";
  data: {
    port: {
      path: string;
      baudRate: number;
    }[];
    packet?: number[];
  };
}

interface IUpdatePayload {
  event: UpdateEventType | null;
  data: {
    message: string;
    progress?: number;
  };
}

interface IThemePayload {
  event: "toggle" | "getTheme";
  dark?: boolean;
}

interface ChannelEventMapping {
  CHANNEL_APP_UPDATE: IUpdatePayload;
  CHANNEL_THEME: IThemePayload;
  CHANNEL_PORT_INFO: IPortInfo[];
  CHANNEL_PORT_ACTIONS: IPortActions;
  CHANNEL_SERIAL_DATA: ISerialData;
}

interface ISerialData {
  path: string;
  data: {
    message: string;
    packet: number[][];
  };
}

interface Window {
  electron: {
    subscribeChannelAppUpdate: (
      callback: (payload: IUpdatePayload) => void
    ) => UnsubscribeFunction;
    subscribeChannelPortList: (
      callback: (portList: IPortInfop[]) => void
    ) => UnsubscribeFunction;
    subscribeErrorMessage: (
      callback: (msg: string[]) => void
    ) => UnsubscribeFunction;
    subscribeChannelSerialData: (
      callback: (payload: ISerialData) => void
    ) => void;
    theme: (payload: IThemePayload) => Promise<IThemePayload>;
    requestPortList: () => void;
    requestPortActions: (payload: IPortActions) => void;
  };
}
