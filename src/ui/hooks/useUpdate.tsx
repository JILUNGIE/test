// import { useEffect, useState } from "react";

// function useUpdate() {
//   const [updateMsg, setUpdateMsg] = useState<string>("");
//   useEffect(() => {
//     window.electron.subscribeChannelAppUpdate((msg) => {
//       setUpdateMsg(msg.message);
//     });
//   }, []);

//   return { updateMsg };
// }

// export default useUpdate;
