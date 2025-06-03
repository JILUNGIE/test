import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import SelectItem from "../components/SelectItem";
import Button from "../components/Button";
import { ButtonActionList } from "../utils/ButtonActionList";
import useDevice from "../hooks/useDevice";
import useCheckBoxList from "../hooks/useCheckBoxList";

function Home() {
  const { deviceList } = useDevice();
  const { checkBoxList } = useCheckBoxList();
  const [isPath, setIsPath] = useState<boolean>();
  const navigate = useNavigate();

  const onSend = (packet: number[]) => {
    window.electron.requestPortActions({
      event: "WRITE",
      data: {
        port: checkBoxList,
        packet,
      },
    });
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    window.electron.requestPortActions({
      event: e.currentTarget.id as "CONNECT" | "DISCONNECT",
      data: {
        port: checkBoxList,
      },
    });
  };

  useEffect(() => {
    const firstConnected = deviceList.find(
      (port) => port.status === "connected"
    );

    if (firstConnected && location.pathname !== firstConnected.path) {
      navigate(firstConnected.path);
    }
  }, [deviceList, navigate]);

  useEffect(() => {
    const result = deviceList.some((port) => port.status === "connected");

    // for (const path of selectedPorts.keys()) {
    //   const ret = deviceList.some((port) => port.path === path);
    //   if (!ret) {
    //     console.log(path);
    //     selectedPorts.delete(path);
    //   }
    // }
    setIsPath(result);
  }, [deviceList]);

  useEffect(() => {
    window.electron.requestPortList();
  }, []);

  return (
    <div className="h-full w-full font-bold ">
      <div className="grid grid-cols-6 grid-rows-5 gap-4 h-full">
        <div className="col-span-3 row-span-2 2xl:col-span-2 2xl:row-span-5 dark:bg-[#121214] bg-[#E6E6E6] rounded-2xl p-5">
          {deviceList.length === 0 ? (
            <div className="h-full flex justify-center items-center">
              No Device...
            </div>
          ) : (
            <ul className="h-full w-full flex flex-col overflow-auto ">
              <div>
                {deviceList.map((port: IPortInfo) => (
                  <SelectItem value={port.path} port={port} key={port.path} />
                ))}
              </div>

              <div className="flex mt-auto ml-auto">
                <button
                  id="CONNECT"
                  disabled={checkBoxList.length === 0 ? true : false}
                  onClick={onClick}
                  className={`bg-green-400 rounded-xl  p-1 mr-3 transition duration-150 ease-in-out ${
                    checkBoxList.length === 0
                      ? `opacity-60`
                      : `hover:opacity-80  `
                  } `}
                >
                  connect
                </button>
                <button
                  id="DISCONNECT"
                  disabled={checkBoxList.length === 0 ? true : false}
                  onClick={onClick}
                  className={`bg-red-400 rounded-xl  p-1 mr-3 transition duration-150 ease-in-out ${
                    checkBoxList.length === 0
                      ? `opacity-60`
                      : `hover:opacity-80  `
                  } `}
                >
                  disconnect
                </button>
              </div>
            </ul>
          )}
        </div>
        <div className="col-span-3 row-span-2 col-start-4 2xl:col-span-2 2xl:row-span-5 2xl:col-start-3 dark:bg-[#121214] bg-[#E6E6E6] rounded-2xl p-5">
          <div className=" w-full h-full grid grid-cols-4 grid-rows-3 gap-2 2xl:grid-cols-4 2xl:grid-rows-10">
            {ButtonActionList.map((button, index) => (
              <Button
                key={index}
                value={button.value}
                padding={button.padding}
                color={button.color}
                onClick={() => onSend(button.packet)}
              />
            ))}
          </div>
        </div>
        <div className="col-span-6 row-span-3 row-start-3 2xl:col-span-2 2xl:row-span-5 2xl:col-start-5 dark:bg-[#121214] bg-[#E6E6E6] rounded-2xl p-5">
          <div className="h-full w-full">
            {deviceList.map((port) =>
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
                // <Outlet context={{ serialData: { ...serialData } }} />
                <Outlet />
              ) : (
                <div className="flex justify-center items-center h-full">
                  Nothing Connected...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
