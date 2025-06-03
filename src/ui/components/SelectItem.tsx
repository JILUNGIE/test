import { PropsWithChildren, useState } from "react";
import baudRateList from "../utils/BaudrateList";
import useCheckBox from "../hooks/useCheckBox";

interface ISelectItem {
  port: IPortInfo;
  value: string;
}

function SelectItem({ port, value }: PropsWithChildren<ISelectItem>) {
  const [optionBaudRate, setOptionBaudRate] = useState(115200);
  const { checked, toggle, changeOption } = useCheckBox({
    path: port.path,
    baudRate: optionBaudRate,
  });

  return (
    <li className="flex items-center justify-between mb-5 ">
      <div className="flex justify-start items-center w-full">
        <input
          id="checkbox"
          checked={checked}
          onChange={toggle}
          type="checkbox"
          className="mr-3"
        />
        <div className="w-20">{value}</div>
        <div
          className={`${
            port.status === "connected" ? `bg-green-400` : `bg-red-400`
          } w-2 h-2 rounded-2xl`}
        />
      </div>

      <div>
        <select
          id="select"
          value={optionBaudRate}
          onChange={(e) => {
            setOptionBaudRate(Number(e.currentTarget.value));
            changeOption(Number(e.currentTarget.value));
          }}
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

export default SelectItem;
