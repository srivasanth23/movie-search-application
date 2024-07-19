import { PuffLoader } from "react-spinners";

const LoaderView = () => {
  return (
    <div className="wrapper flexCenter" style={{ height: "30vh" }}>
      <PuffLoader color="white" height="80" width="80" />
    </div>
  );
};

export default LoaderView;
