type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeAppVersion: (
      callback: (version: string) => void
    ) => UnsubscribeFunction;
    sendTest: () => void;
  };
}
