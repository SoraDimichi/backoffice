import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const Home = () => {
  const push = useNavigate();

  return (
    <Button className="w-20" onClick={() => push("/")}>
      Home
    </Button>
  );
};
