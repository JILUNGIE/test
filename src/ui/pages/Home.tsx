import { useEffect, useState } from "react";
import GridBox from "../components/GridBox";
import PortSelectItem from "../components/PortSelectItem";

function Home() {
  const [portList, setPortList] = useState<PortInfo[]>([]);
  useEffect(() => {
    window.electron.subscribeDetectPortList((list) => {
      setPortList(list);
    });
  }, []); //col-span-2 row-span-2 col-start-3
  return (
    <div className="h-full w-full font-black ">
      <div className="grid grid-cols-4 grid-rows-5 gap-4 h-full">
        <GridBox gridInfo="col-span-2 row-span-2">
          {portList.length === 0 ? (
            <div className="h-full flex justify-center items-center">
              no Port...
            </div>
          ) : (
            <ul>
              {portList.map((portInfo) => (
                <PortSelectItem>{portInfo.path}</PortSelectItem>
              ))}
            </ul>
          )}
        </GridBox>
        <GridBox gridInfo="col-span-2 row-span-2 col-start-3">2</GridBox>
        <GridBox gridInfo="col-span-4 row-span-3 row-start-3 ">3</GridBox>
      </div>
    </div>
  );
}

export default Home;
