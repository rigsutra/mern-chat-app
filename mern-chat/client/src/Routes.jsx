import { useContext } from "react";
import RegisterAndLogin from "./RegisterAndLogin";
import { UserContext } from "./UserContext";

export default function Routes() {
  const { username, id } = useContext(UserContext);

  console.log(id);

  if (username) {
    return "Logged in!" + username;
  }

  return <RegisterAndLogin />;
}
