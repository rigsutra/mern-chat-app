import { useState } from "react";
import { useEffect } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUsersId, setSelectedUsersId] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  function showOnLinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(event) {
    const messageData = JSON.parse(event.data);
    if ("online" in messageData) {
      showOnLinePeople(messageData.online);
    }
  }

  // function selectContact(userId) {}

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 ">
        <Logo />
        {Object.keys(onlinePeople).map((userId) => (
          <div
            key={userId}
            onClick={() => setSelectedUsersId(userId)}
            className={
              "border-b border-gray-100 py-2 pl-4 flex items-center gap-2  cursor-pointer " +
              (userId === selectedUsersId ? "bg-blue-50" : " ")
            }
          >
            <Avatar username={onlinePeople[userId]} userId={userId} />
            <span className="text-gray-800">{onlinePeople[userId]}</span>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 w-2/3 p-2 flex flex-col">
        <div className="flex-grow">Message of the selected person</div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message here..."
            className="bg-white border p-2 flex-grow rounded-sm"
          />
          <button className="bg-blue-500 p-2 text-white rounded-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
