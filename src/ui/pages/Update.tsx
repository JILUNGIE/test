import { useEffect, useState } from "react";
import ReactLogo from "../assets/svg/ReactLogo";

function Update() {
  const [updateState, setUpdateState] = useState<IUpdatePayload>({
    event: null,
    data: { message: "", progress: 0 },
  });

  useEffect(() => {
    window.electron.subscribeChannelAppUpdate((payload) => {
      setUpdateState({
        event: null,
        data: {
          progress: payload.data.progress,
          message: payload.data.message,
        },
      });
    });
  }, []);

  return (
    <main className="bg-[#1A1A1E] flex flex-col justify-center items-center h-full text-white">
      <ReactLogo />
      <span className="font-bold">{updateState.data.message}</span>
      {updateState.data.progress === 0 ? null : (
        <input
          type="range"
          className="w-60 mt-2 pointer-events-none"
          min="0"
          max="100"
          value={updateState.data.progress}
          readOnly
        />
      )}
    </main>
  );
}

export default Update;
