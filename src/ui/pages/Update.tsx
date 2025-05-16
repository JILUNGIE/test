import { useEffect, useState } from "react";
import ReactLogo from "../components/svg/ReactLogo";

function Update() {
  const [updateMsg, setUpdateMsg] = useState<string>("");
  useEffect(() => {
    window.electron.subscribeAppVersion((msg) => {
      setUpdateMsg(msg);
    });
  }, []);
  return (
    <main className="flex flex-col justify-center items-center h-full">
      <ReactLogo />
      <span className="font-bold">{updateMsg}</span>
      <input
        type="range"
        className="w-60 mt-2 pointer-events-none"
        min="0"
        max="100"
        value={10}
      />
    </main>
  );
}

export default Update;
