import { useOutletContext, useParams } from "react-router";
import { Canvas } from "@react-three/fiber";
import Model from "../components/Model";
import { useEffect, useRef } from "react";
import { subscribeSerialData } from "../hooks/useSerial";

// interface IOutletContext {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   serialData: any;
// }

function DeviceInfo() {
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

  const toInt16 = (msb: number, lsb: number) => {
    const val = (msb << 8) | lsb;
    return val > 32767 ? val - 65536 : val;
  };

  useEffect(() => {
    subscribeSerialData(console.log);
  }, []);

  useEffect(() => {
    console.log(RPYdata);
  }, [RPYdata]);
  useEffect(() => {
    console.log(IMUdata);
  }, [IMUdata]);
  const { path } = useParams();
  return (
    <div className="flex w-full h-full">
      <div className="w-full h-full">{path}</div>
      <div className="w-10"></div>
      <div className="w-full h-full">
        <Canvas>
          <Model
            roll={RPYdata.current.roll}
            pitch={RPYdata.current.pitch}
            yaw={RPYdata.current.yaw}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default DeviceInfo;
