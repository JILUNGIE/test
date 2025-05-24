import { useEffect, useState } from "react";
import GridBox from "../components/GridBox";
import PortSelectItem from "../components/PortSelectItem";
import { Link, Outlet, useNavigate, useOutletContext } from "react-router";
import Button from "../components/Button";
import { ButtonActionList } from "../utils/ButtonActionList";

interface IOutletContext {
  portList: IPortInfo[];
  sendPacket: (path: string[], data: number[]) => void;
  serialData: number[][];
}

function Home() {
  const { portList, sendPacket, serialData } =
    useOutletContext<IOutletContext>();
  const [selectedPorts, setSelectedPorts] = useState<Map<string, number>>(
    new Map()
  );
  const [isPath, setIsPath] = useState<boolean>();
  const navigate = useNavigate();

  const toggleCheck = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    path: string,
    baudRate: number
  ) => {
    const newMap = new Map(selectedPorts);

    if (e.currentTarget.id === "checkbox") {
      if (newMap.has(path)) {
        newMap.delete(path);
      } else {
        newMap.set(path, baudRate);
      }
    } else if (e.currentTarget.id === "select") {
      newMap.set(path, baudRate);
    }
    setSelectedPorts(newMap);
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const ports = portList.filter((port) => selectedPorts.has(port.path));
    const pathList = ports.map((port) => port.path);
    const baudRate = selectedPorts.get(ports[0].path);
    //const pathList = ports.map(port => port.path);
    window.electron.requestPortActions({
      event: e.currentTarget.id as "CONNECT" | "DISCONNECT",
      data: {
        path: pathList,
        baudRate,
      },
    });
  };

  useEffect(() => {
    const firstConnected = portList.find((port) => port.status === "connected");

    if (firstConnected && location.pathname !== firstConnected.path) {
      navigate(firstConnected.path);
    }
  }, [portList, navigate]);

  useEffect(() => {
    const result = portList.some((port) => port.status === "connected");

    for (const path of selectedPorts.keys()) {
      const ret = portList.some((port) => port.path === path);
      if (!ret) {
        console.log(path);
        selectedPorts.delete(path);
      }
    }
    setIsPath(result);
  }, [portList]);

  useEffect(() => {
    window.electron.requestPortList();
  }, []);

  return (
    <div className="h-full w-full font-black ">
      <div className="grid grid-cols-6 grid-rows-5 gap-4 h-full">
        <GridBox gridInfo="col-span-3 row-span-2 2xl:col-span-2 2xl:row-span-5">
          {portList.length === 0 ? (
            <div className="h-full flex justify-center items-center">
              no Port...
            </div>
          ) : (
            <ul className="h-full w-full flex flex-col overflow-auto ">
              <div>
                {portList.map((port: IPortInfo) => (
                  <PortSelectItem
                    port={port}
                    handleChange={(e, path, baudRate) =>
                      toggleCheck(e, path, baudRate)
                    }
                    key={port.path}
                  >
                    {port.path}
                  </PortSelectItem>
                ))}
              </div>

              <div className="flex mt-auto ml-auto">
                <button
                  id="CONNECT"
                  disabled={selectedPorts.size === 0 ? true : false}
                  onClick={onClick}
                  className={`bg-green-400 rounded-xl  p-1 mr-3 transition duration-150 ease-in-out ${
                    selectedPorts.size === 0
                      ? `opacity-60`
                      : `hover:opacity-80  `
                  } `}
                >
                  connect
                </button>
                <button
                  id="DISCONNECT"
                  disabled={selectedPorts.size === 0 ? true : false}
                  onClick={onClick}
                  className={`bg-red-400 rounded-xl  p-1 mr-3 transition duration-150 ease-in-out ${
                    selectedPorts.size === 0
                      ? `opacity-60`
                      : `hover:opacity-80  `
                  } `}
                >
                  disconnect
                </button>
              </div>
            </ul>
          )}
        </GridBox>
        <GridBox gridInfo="col-span-3 row-span-2 col-start-4 2xl:col-span-2 2xl:row-span-5 2xl:col-start-3 ">
          <div className=" w-full h-full grid grid-cols-4 grid-rows-3 gap-2 2xl:grid-cols-4 2xl:grid-rows-10">
            {ButtonActionList.map((button, index) => (
              <Button
                key={index}
                value={button.value}
                padding={button.padding}
                color={button.color}
                onClick={() =>
                  sendPacket(Array.from(selectedPorts.keys()), button.packet)
                }
              />
            ))}
          </div>
        </GridBox>
        <GridBox gridInfo="col-span-6 row-span-3 row-start-3 2xl:col-span-2 2xl:row-span-5 2xl:col-start-5">
          <div className="h-full w-full">
            {portList.map((port) =>
              port.status === "connected" ? (
                <Link
                  key={port.path}
                  className="w-full h-full mr-10 p-2 hover:dark:bg-[#1A1A1E] hover:bg-[#F5F5F5] rounded-2xl"
                  to={port.path}
                >
                  {port.path}
                </Link>
              ) : null
            )}
            <div className="h-[90%] 2xl:h-[97%]">
              {isPath ? (
                <Outlet context={{ serialData: { ...serialData } }} />
              ) : (
                <div className="flex justify-center items-center h-full">
                  Nothing Connected...
                </div>
              )}
            </div>
          </div>
        </GridBox>
      </div>
    </div>
  );
}

export default Home;
