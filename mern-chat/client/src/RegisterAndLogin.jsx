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
    try {
      const { data } = await axios.post(
        `http://localhost:4000/${url}`,
        { username, password },
        { withCredentials: true }
      );
      setLoggedInUsername(username);
      setId(data.id);
    } catch (err) {
      console.error(err);
    }
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
          type="password"
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
              <button
                type="button"
                onClick={() => setIsLoggedInOrRegister("Login")}
              >
                Login Here
              </button>
            </div>
          )}
          {isLoggedInOrRegister === "Login" && (
            <div>
              Not a member?
              <button
                type="button"
                onClick={() => setIsLoggedInOrRegister("Register")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
