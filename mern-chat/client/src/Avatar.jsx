import PropTypes from "prop-types";

export default function Avatar({ userId, username, online }) {
  const colors = [
    "bg-teal-200",
    "bg-purple-200",
    "bg-yellow-200",
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-orange-200", // Replaced duplicate color
  ];

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div
      className={
        "w-8 h-8 rounded-full flex items-center " + color + " relative"
      }
    >
      <div className="text-center w-full opacity-70">
        {username ? username[0] : "-"} {/* Changed fallback character */}
      </div>
      {online && (
        <div className="absolute w-3 h-3 bg-green-400 -bottom-1 -right-1 rounded-full border border-white"></div>
      )}
      {!online && (
        <div className="absolute w-3 h-3 bg-gray-400 -bottom-1 -right-1 rounded-full border border-white"></div>
      )}
    </div>
  );
}

Avatar.propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  online: PropTypes.bool,
};
