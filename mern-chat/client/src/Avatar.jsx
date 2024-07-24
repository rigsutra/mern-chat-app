import PropTypes from "prop-types";

export default function Avatar({ userId, username }) {
  const colors = [
    "bg-teal-200",
    "bg-purple-200",
    "bg-yellow-200",

    "bg-red-200",
    "bg-blue-200",

    "bg-green-200",
    // Fixed typo here

    "bg-teal-200",
  ];

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div className={"w-8 h-8 rounded-full flex items-center " + color}>
      <div className="text-center w-full  opacity-70">
        {username ? username[0] : "?"}
      </div>
    </div>
  );
}

Avatar.propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};
