interface IButtonAction {
  value: string;
  padding: number;
  color: string;
  packet: number[];
}

const ButtonActionList: IButtonAction[] = [
  {
    value: "led",
    padding: 0,
    color: "bg-amber-400",
    packet: [0xa5, 0x99, 0x00, 0x53, 0xfe, 0x0a, 0x0d],
  },
  {
    value: "Battery",
    padding: 0,
    color: "bg-pink-400",
    packet: [0xa5, 0x02, 0x00, 0xbc, 0xfe, 0x0a, 0x0d],
  },
  {
    value: "Start Raw",
    padding: 0,
    color: "bg-cyan-400",
    packet: [0xa5, 0x04, 0x01, 0x01, 0xc0, 0xfe, 0x0a, 0x0d],
  },
  {
    value: "Stop Raw",
    padding: 0,
    color: "bg-emerald-400",
    packet: [0xa5, 0x04, 0x01, 0x00, 0xbf, 0xfe, 0x0a, 0x0d],
  },
  {
    value: "Start RPY",
    padding: 0,
    color: "bg-indigo-400",
    packet: [0xa5, 0x07, 0x01, 0x01, 0xc3, 0xfe, 0x0a, 0x0d],
  },
  {
    value: "Stop RPY",
    padding: 0,
    color: "bg-lime-400",
    packet: [0xa5, 0x07, 0x01, 0x00, 0xc2, 0xfe, 0x0a, 0x0d],
  },
];

export { ButtonActionList };
