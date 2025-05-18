import { useParams } from "react-router";

function DeviceInfo() {
  const { path } = useParams();
  console.log(path);
  return <div>{path}</div>;
}

export default DeviceInfo;
