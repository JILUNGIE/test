import { useEffect, useState } from "react";
import GridBox from "../components/GridBox";
import PortSelectItem from "../components/PortSelectItem";
import { Link, Outlet, useOutletContext } from "react-router";

interface IOutletContext {
  detectedPortList: PortInfo[];
  connectedPortList: Map<string, number>;
  sendData: (path: string[], data: number[]) => void;
}

function Home() {
  const { detectedPortList, connectedPortList, sendData } =
    useOutletContext<IOutletContext>();
  const [checkPort, setCheckPort] = useState<Map<string, number>>(new Map());
  const onSelectCheckPortInfo = (
    path: string,
    checked: boolean,
    baudRate: number
  ) => {
    setCheckPort((prev) => {
      const newMap = new Map(prev);
      if (checked) {
        newMap.set(path, baudRate);
      } else {
        newMap.delete(path);
      }

      return newMap;
    });
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const obj = Object.fromEntries(checkPort);
    const arr = Object.entries(obj).map(([path, baudRate]) => ({
      path,
      baudRate,
    }));

    console.log("obj: ", obj);
    console.log("arr: ", arr);

    window.electron.reqPort(e.currentTarget.id, arr, undefined);
  };

  useEffect(() => {
    window.electron.requestDetectPortList();
  }, []);

  return (
    <div className="h-full w-full font-black ">
      <div className="grid grid-cols-6 grid-rows-5 gap-4 h-full">
        <GridBox gridInfo="col-span-3 row-span-2 2xl:col-span-2 2xl:row-span-5">
          {detectedPortList.length === 0 ? (
            <div className="h-full flex justify-center items-center">
              no Port...
            </div>
          ) : (
            <ul className="h-full w-full flex flex-col overflow-auto ">
              <div>
                {detectedPortList.map((portInfo) => (
                  <PortSelectItem
                    connectedPortList={connectedPortList}
                    onSelect={onSelectCheckPortInfo}
                    key={portInfo.path}
                  >
                    {portInfo.path}
                  </PortSelectItem>
                ))}
              </div>

              <div className="flex mt-auto ml-auto">
                <button
                  id="CONNECT"
                  disabled={checkPort.size === 0 ? true : false}
                  onClick={onClick}
                  className={`bg-green-400 p-1 mr-3 transition duration-150 ease-in-out ${
                    checkPort.size === 0 ? `opacity-60` : `hover:opacity-80  `
                  } `}
                >
                  connect
                </button>
                <button
                  id="DISCONNECT"
                  disabled={checkPort.size === 0 ? true : false}
                  onClick={onClick}
                  className={`bg-red-400 p-1 mr-3 transition duration-150 ease-in-out ${
                    checkPort.size === 0 ? `opacity-60` : `hover:opacity-80  `
                  } `}
                >
                  disconnect
                </button>
              </div>
            </ul>
          )}
        </GridBox>
        <GridBox gridInfo="col-span-3 row-span-2 col-start-4 2xl:col-span-2 2xl:row-span-5 2xl:col-start-3">
          <div className=" w-full h-full grid grid-cols-3 grid-rows-3 gap-2">
            <button
              onClick={() =>
                sendData(
                  Array.from(connectedPortList.keys()),
                  [0xa5, 0x99, 0, 0x53, 0xfe, 0x0a, 0x0d]
                )
              }
              className="bg-amber-400 h-10 transition duration-150 hover:opacity-80"
            >
              LED
            </button>
            <button className="bg-pink-400 h-10 transition duration-150 hover:opacity-80">
              BATTERY
            </button>
            <button className="bg-sky-400 h-10 transition duration-150 hover:opacity-80">
              RPY
            </button>
            <button className="bg-sky-400 h-10 transition duration-150 hover:opacity-80">
              ...?
            </button>
          </div>
        </GridBox>
        <GridBox gridInfo="col-span-6 row-span-3 row-start-3 2xl:col-span-2 2xl:row-span-5 2xl:col-start-5">
          <div className="h-full w-full">
            <div className="w-full h-10">
              {Array.from(connectedPortList.entries()).map(([key]) => (
                <Link className="w-full h-full mr-10 p-2 " key={key} to={key}>
                  {key}
                </Link>
              ))}
            </div>
            <Outlet />
          </div>
        </GridBox>
      </div>
    </div>
  );
}

export default Home;
