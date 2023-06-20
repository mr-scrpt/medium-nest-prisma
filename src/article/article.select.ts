export const author = {
  select: {
    id: true,
    username: true,
    bio: true,
    image: true,
  },
};
export const favoritedBy = {
  select: {
    id: true,
    userId: true,
    articleId: true,
  },
};
// export const tagList = {
//   select: {
//     tag: {
//       select: {
//         name: true,
//       },
//     },
//   },
// };
export const tagList = {
  select: {
    id: true,
    tagId: true,
    articleId: true,
  },
};

export const include = {
  author,
  favoritedBy,
  tagList,
};
