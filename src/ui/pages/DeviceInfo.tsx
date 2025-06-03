import { Canvas } from "@react-three/fiber";
import Model from "../components/Model";
import { useEffect, useRef } from "react";
import BaseChart from "../components/BaseChart";

// interface IOutletContext {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   serialData: any;
// }

function DeviceInfo() {
  const serialDataRef = useRef<number[][]>([]);
  const RPYdata = useRef<{
    roll: number;
    pitch: number;
    yaw: number;
  }>({
    roll: 0,
    pitch: 0,
    yaw: 0,
  });
  const IMUdata = useRef<{
    gyroX: number;
    gyroY: number;
    gyroZ: number;

    accelX: number;
    accelY: number;
    accelZ: number;
  }>({
    gyroX: 0,
    gyroY: 0,
    gyroZ: 0,

    accelX: 0,
    accelY: 0,
    accelZ: 0,
  });

  // const toInt16 = (msb: number, lsb: number) => {
  //   const val = (msb << 8) | lsb;
  //   return val > 32767 ? val - 65536 : val;
  // };

  useEffect(() => {
    window.electron.subscribeChannelSerialData((payload) => {
      if (payload.data.message === "assemblePacket") {
        serialDataRef.current = payload.data.packet;
      }

      console.log(serialDataRef.current[0]);
    });
  }, []);

  useEffect(() => {
    console.log(RPYdata);
  }, [RPYdata]);
  useEffect(() => {
    console.log(IMUdata);
  }, [IMUdata]);
  //const { path } = useParams();
  return (
    <div className="flex w-full h-full 2xl:flex-col mt-2 2xl:mt-10">
      <div className="w-full h-full flex flex-col justify-between 2xl:h-[50%]">
        <span>X</span>
        <div className="w-full h-15 ">
          <BaseChart
            data={[
              { value: 1 },
              { value: 4 },
              { value: 5 },
              { value: 4 },
              { value: 4 },
              { value: 4 },
              { value: 4 },
            ]}
          />
        </div>
        <span>Y</span>
        <div className="w-full h-15">
          <BaseChart data={[{ value: 10 }, { value: 20 }, { value: 30 }]} />
        </div>
        <span>Z</span>
        <div className="w-full h-15">
          <BaseChart data={[{ value: 10 }, { value: 20 }, { value: 30 }]} />
        </div>
      </div>

      <div className="w-10"></div>
      <div className="w-100 h-full 2xl:w-full 2xl:h-[40%] ">
        <div className=" h-full">
          <span>3D</span>
          <Canvas>
            <Model
              roll={RPYdata.current.roll}
              pitch={RPYdata.current.pitch}
              yaw={RPYdata.current.yaw}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

export default DeviceInfo;
