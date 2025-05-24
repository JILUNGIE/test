import { PropsWithChildren, useRef } from "react";
import baudRateList from "../utils/BaudrateList";

interface IPortSelectItem {
  port: IPortInfo;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    path: string,
    baudRate: number
  ) => void;
}

function PortSelectItem({
  children,
  port,
  handleChange,
}: PropsWithChildren<IPortSelectItem>) {
  const selecteRef = useRef<HTMLSelectElement>(null);

  return (
    <li className="flex items-center justify-between mb-5 ">
      <div className="flex justify-start items-center w-full">
        <input
          id="checkbox"
          onSelect={() => console.log("hi")}
          onChange={(e) =>
            handleChange(
              e,
              port.path,
              Number(selecteRef.current?.value) || 115200
            )
          }
          type="checkbox"
          className="mr-3"
        />
        <div className="w-20">{children}</div>
        <div
          className={`${
            port.status === "connected" ? `bg-green-400` : `bg-red-400`
          } w-2 h-2 rounded-2xl`}
        />
      </div>

      <div>
        <select
          id="select"
          ref={selecteRef}
          defaultValue={115200}
          onChange={(e) =>
            handleChange(
              e,
              port.path,
              Number(selecteRef.current?.value) || 115200
            )
          }
          className="dark:bg-gray-700 bg-[#c7c7c7] rounded-xl mr-2"
          name="baudrateList"
        >
          {baudRateList.map((baudRate) => (
            <option key={baudRate} value={String(baudRate)}>
              {baudRate}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
}

export default PortSelectItem;
