import { useState, useContext, useEffect } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { uniqBy } from "lodash";
import { UserContext } from "./UserContext";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUsersId, setSelectedUsersId] = useState(null);
  const [newMessagesText, setNewMessagesText] = useState(""); // Changed to string
  const [messages, setMessages] = useState([]);
  const { id } = useContext(UserContext);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    ws.addEventListener("message", handleMessage);

    return () => {
      ws.close(); // Cleanup on unmount
    };
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
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function sendMessage(event) {
    event.preventDefault();
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Check if WebSocket is open
      ws.send(
        JSON.stringify({
          recipient: selectedUsersId,
          text: newMessagesText,
        })
      );
      setMessages((prev) => [
        ...prev,
        { text: newMessagesText, sender: id, recipient: selectedUsersId },
      ]);
      setNewMessagesText(""); // Clear input after sending
    } else {
      console.error("WebSocket is not open. Current state:", ws.readyState);
    }
  }

  const onlinePeopleExcludeOurUser = { ...onlinePeople };
  delete onlinePeopleExcludeOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, "id");

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 ">
        <Logo />
        {Object.keys(onlinePeopleExcludeOurUser).map((userId) => (
          <div
            key={userId}
            onClick={() => setSelectedUsersId(userId)}
            className={
              "border-b border-gray-100 flex items-center gap-2 cursor-pointer " +
              (userId === selectedUsersId ? "bg-blue-50" : "")
            }
          >
            {userId === selectedUsersId && (
              <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
            )}
            <div className="flex gap-2 py-2 pl-4 items-center ">
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span className="text-gray-800">{onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 w-2/3 p-2 flex flex-col">
        <div className="flex-grow">
          {!selectedUsersId && (
            <div className="flex h-full items-center justify-center">
              <div className="text-gray-400">
                &larr; Select a Contact from the SideBar
              </div>
            </div>
          )}
          {!!selectedUsersId && (
            <div className="overflow-scroll">
              {messagesWithoutDupes.map((message) => {
                return (
                  // Add return statement
                  <div key={message.id}>
                    <div
                      className={
                        "inline-block p-2 my-2 rounded-sm text-sm " +
                        (message.sender === id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-500")
                      }
                    >
                      {message.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {!!selectedUsersId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessagesText}
              onChange={(e) => setNewMessagesText(e.target.value)}
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
          </form>
        )}
      </div>
    </div>
  );
}
