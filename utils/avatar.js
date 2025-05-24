const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generateAvatarUrl = (name) => {
  const encodedName = encodeURIComponent(name.trim());
  const bgColor = getRandomColor();
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&backgroundColor=${bgColor}`;
};

export { generateAvatarUrl };
