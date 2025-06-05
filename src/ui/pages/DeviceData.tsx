import { Canvas } from "@react-three/fiber";
import Model from "../components/Model";
import { useEffect, useRef, useState } from "react";
import BaseChart from "../components/BaseChart";
import useTheme from "../hooks/useTheme";

function DeviceData() {
  const serialDataRef = useRef<number[][]>([]);
  const [gyro, setGyro] = useState<
    {
      x: number;
      y: number;
      z: number;
    }[]
  >([
    {
      x: 0,
      y: 0,
      z: 0,
    },
  ]);
  const RPYdata = useRef<{
    roll: number;
    pitch: number;
    yaw: number;
  }>({
    roll: 0,
    pitch: 0,
    yaw: 0,
  });

  const { isDark } = useTheme();

  const toInt16 = (msb: number, lsb: number) => {
    const val = (msb << 8) | lsb;
    return val > 32767 ? val - 65536 : val;
  };

  useEffect(() => {
    window.electron.subscribeChannelSerialData((payload) => {
      if (payload.data.message === "assemblePacket") {
        serialDataRef.current = payload.data.packet;
      }

      if (serialDataRef.current[0]) {
        switch (serialDataRef.current[0][1]) {
          case 0x09:
            RPYdata.current.roll = toInt16(
              serialDataRef.current[0][3],
              serialDataRef.current[0][4]
            );
            RPYdata.current.pitch = toInt16(
              serialDataRef.current[0][5],
              serialDataRef.current[0][6]
            );
            RPYdata.current.yaw = toInt16(
              serialDataRef.current[0][7],
              serialDataRef.current[0][8]
            );
            break;
          case 0x06: {
            const gyroData = {
              x: toInt16(
                serialDataRef.current[0][3],
                serialDataRef.current[0][4]
              ),
              y: toInt16(
                serialDataRef.current[0][5],
                serialDataRef.current[0][6]
              ),
              z: toInt16(
                serialDataRef.current[0][7],
                serialDataRef.current[0][8]
              ),
            };
            setGyro((prev) => {
              if (prev.length < 10) {
                return [...prev, gyroData];
              } else {
                return [...prev.slice(1), gyroData];
              }
            });
            break;
          }
        }
      }
    });
  }, []);

  //const { path } = useParams();
  const xData = gyro.map((g) => ({ value: g.x }));
  const yData = gyro.map((g) => ({ value: g.y }));
  const zData = gyro.map((g) => ({ value: g.z }));

  return (
    <div className="flex w-full h-full 2xl:flex-col mt-2 2xl:mt-10">
      <div className="w-full h-full flex flex-col justify-between 2xl:h-[50%]">
        <span>X</span>
        <div className="w-full h-15 ">
          <BaseChart data={xData} isDark={isDark} />
        </div>
        <span>Y</span>
        <div className="w-full h-15">
          <BaseChart data={yData} isDark={isDark} />
        </div>
        <span>Z</span>
        <div className="w-full h-15">
          <BaseChart data={zData} isDark={isDark} />
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

export default DeviceData;
