import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export default function RegisterAndLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedInOrRegister, setIsLoggedInOrRegister] = useState("Register");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    const url = isLoggedInOrRegister === "Register" ? "register" : "login";
    // to prevent the form from submitting the data and refreshing the page

    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id); // this will set the id in the UserContext which is used to get the id in other components.
    } catch (err) {
      console.error(err);
      // handle the error here
    }

    // this will send the data and this will send the data to the backend.

    // if this thing send the data then we can get the data in const or in a { object } so you can have any of it here it is not required
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLoggedInOrRegister === "Register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {isLoggedInOrRegister === "Register" && (
            <div>
              Already a member?
              <button onClick={() => setIsLoggedInOrRegister("Login")}>
                Login Here
              </button>
            </div>
          )}

          {isLoggedInOrRegister === "Login" && (
            <div>
              Not a member?
              <button onClick={() => setIsLoggedInOrRegister("Register")}>
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
