import { useEffect, useState } from "react";
import checkBoxStore from "../store/checkboxStore";

function useCheckBoxList() {
  const [checkBoxList, setCheckBoxList] = useState(() =>
    checkBoxStore.getChecked()
  );

  useEffect(() => {
    const unsubscribe = checkBoxStore.subscribe(() => {
      setCheckBoxList([...checkBoxStore.getChecked()]);
    });

    return unsubscribe;
  }, []);

  return { checkBoxList };
}

export default useCheckBoxList;
