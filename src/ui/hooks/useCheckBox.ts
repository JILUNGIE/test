import { useEffect, useState } from "react";
import checkBoxStore from "../store/checkboxStore";

function useCheckBox({ path, baudRate }: { path: string; baudRate: number }) {
  const [checked, setChecked] = useState(checkBoxStore.isChecked(path));

  const toggle = () => {
    checkBoxStore.toggle({ path, baudRate });
  };

  const getCheckBox = () => {
    return checkBoxStore.getChecked();
  };

  const changeOption = (value: number) => {
    checkBoxStore.changeOption({ path, baudRate: value });
  };

  useEffect(() => {
    const unsubscribe = checkBoxStore.subscribe(() => {
      setChecked(checkBoxStore.isChecked(path));
    });

    return unsubscribe;
  }, [path]);

  return { checked, toggle, getCheckBox, changeOption };
}

export default useCheckBox;
