export const  getInitials=(name)=>{

if(!name) return "U";

const parts=name.trim().split(" ").filter(Boolean);

if(parts.length===1)
return parts[0][0].toUpperCase();

return (
    parts[0][0].toUpperCase() +
    parts[parts.length - 1][0].toUpperCase()
  );
};

export function getAvatarColor(name = "") {
  const colors = [
    "bg-indigo-500",
    "bg-green-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-teal-500",
  ];

  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }

  return colors[hash % colors.length];
};

export function getAvatar(name) {
  return {
    initials: getInitials(name),
    color: getAvatarColor(name),
  };
};

