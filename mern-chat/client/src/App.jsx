import axios from "axios";
import { UserContextProvider } from "./UserContext";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import Routes from "./Routes";

const App = () => {
  axios.defaults.baseURL = "http://localhost:4000";
  // this is to set the default ural now that in the othe pages you juast have to give the page url name to that axios palce
  axios.defaults.withCredentials = true;
  const { username } = useContext(UserContext);
  console.log(username);

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
};

export default App;
