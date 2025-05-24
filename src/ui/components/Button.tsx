interface IButton {
  color: string;
  padding: number;
  value: string;
  onClick: () => void;
}

function Button({ color, padding, value, onClick }: IButton) {
  return (
    <button
      onClick={() => {
        onClick();
      }}
      className={`${color} hover:cursor-pointer rounded-xl h-10 transition duration-150 hover:opacity-80 p-${padding}`}
    >
      {value}
    </button>
  );
}

export default Button;
