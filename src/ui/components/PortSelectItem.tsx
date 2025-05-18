import { PropsWithChildren, useRef } from "react";
import baudRateList from "../utils/BaudrateList";

interface IPortSelectItem {
  connectedPortList: Map<string, number>;
  onSelect: (path: string, checked: boolean, baudRate: number) => void;
}

function PortSelectItem({
  children,
  connectedPortList,
  onSelect,
}: PropsWithChildren<IPortSelectItem>) {
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const selecteRef = useRef<HTMLSelectElement>(null);

  const handleChange = () => {
    const checked = checkBoxRef.current?.checked ?? false;
    const buadRate = Number(selecteRef.current?.value) || 115200;
    onSelect(String(children), checked, buadRate);
  };

  return (
    <li className="flex items-center justify-between mb-5 ">
      <div className="flex justify-start items-center w-full">
        <input
          ref={checkBoxRef}
          onChange={handleChange}
          type="checkbox"
          className="mr-3"
        />
        <div className="w-20">{children}</div>
        <div
          className={`${
            connectedPortList.has(String(children))
              ? `bg-green-400`
              : `bg-red-400`
          } w-2 h-2 rounded-2xl`}
        />
      </div>

      <div>
        <select
          ref={selecteRef}
          defaultValue={115200}
          onChange={handleChange}
          className="bg-gray-700 rounded-xl mr-2"
          name="baudrateList"
          id="id"
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
