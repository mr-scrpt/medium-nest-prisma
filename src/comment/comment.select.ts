export const author = {
  select: {
    id: true,
    username: true,
    bio: true,
    image: true,
  },
};

export const include = {
  author,
};
