// @ts-nocheck

const users = {
  1: {
    id: 1,
    uname: "alice",
    password: "alpha",
  },
  2: {
    id: 2,
    uname: "theo",
    password: "123",
  },
  3: {
    id: 3,
    uname: "prime",
    password: "123",
  },
  4: {
    id: 4,
    uname: "leerob",
    password: "123",
  },
};

const posts = {
  101: {
    id: 101,
    title: "Mochido opens its new location in Coquitlam this week",
    link: "https://dailyhive.com/vancouver/mochido-coquitlam-open",
    description:
      "New mochi donut shop, Mochido, is set to open later this week.",
    creator: 1,
    subgroup: "food",
    timestamp: 1643648446955,
  },
  102: {
    id: 102,
    title: "2023 State of Databases for Serverless & Edge",
    link: "https://leerob.io/blog/backend",
    description:
      "An overview of databases that pair well with modern application and compute providers.",
    creator: 4,
    subgroup: "coding",
    timestamp: 1642611742010,
  },
};

const comments = {
  9001: {
    id: 9001,
    post_id: 102,
    creator: 1,
    description: "Actually I learned a lot :pepega:",
    timestamp: 1642691742010,
  },
};

const votes = [
  { user_id: 2, post_id: 101, value: +1 },
  { user_id: 3, post_id: 101, value: +1 },
  { user_id: 4, post_id: 101, value: +1 },
  { user_id: 3, post_id: 102, value: -1 },
];

function debug() {
  console.log("==== DB DEBUGING ====");
  console.log("users", users);
  console.log("posts", posts);
  console.log("comments", comments);
  console.log("votes", votes);
  console.log("==== DB DEBUGING ====");
}

function getUser(id) {
  return users[id];
}

//signup part
function createUser({ uname, password }) {
  const id = Object.keys(users).length + 1;
  const user = {
    id,
    createdAt: Date.now(),
    uname,
    password,
  };
  users[id] = user;
  return { id, username: uname, createdAt: user.createdAt };
}

function getUserByUsername(uname: string) {
  const user = Object.values(users).find((user) => user.uname === uname);
  return user ? getUser(user.id) : null;
}

function getVotesForPost(post_id) {
  return votes.filter((vote) => vote.post_id === post_id);
}

function votePost(postId: number, action: string, user: User) {
  const post = posts[postId];
  if (!post) {
    throw new Error("Post not found");
  }

  const userVoteIndex = votes.findIndex(
    (vote) => vote.post_id === postId && vote.user_id === user.id
  );

  if (action === "upvote") {
    if (userVoteIndex !== -1) {
      votes.splice(userVoteIndex, 1);
    } 
    else {
      votes.push({ user_id: user.id, post_id: postId, value: 1 });
    }
  } 
  else if (action === "downvote") {
    if (userVoteIndex !== -1) {
      votes.splice(userVoteIndex, 1);
    } 
    else {
      votes.push({ user_id: user.id, post_id: postId, value: -1 });
    }
  } 
  else {
    throw new Error("Invalid");
  }

  const upvotesCount = votes.filter(
    (vote) => vote.post_id === postId && vote.value == 1
  ).length;
  const downvotesCount = votes.filter(
    (vote) => vote.post_id === postId && vote.value == -1
  ).length;

  return {
    success: true,
    upvotesCount,
    downvotesCount,
    userVote:
      action === "upvote" ? "upvote" : action === "downvote" ? "downvote" : "",
  };
}

function decoratePost(post) {
  post = {
    ...post,
    creator: users[post.creator],
    votes: getVotesForPost(post.id),
    comments: Object.values(comments)
      .filter((comment) => comment.post_id === post.id)
      .map((comment) => ({ ...comment, creator: users[comment.creator] })),
  };
  return post;
}

/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} sub which sub to fetch, defaults to all subs
 */
function getPosts(n = 5, sub: string | undefined = undefined) {
  let allPosts = Object.values(posts);
  if (sub) {
    allPosts = allPosts.filter((post) => post.subgroup === sub);
  }
  allPosts.sort((a, b) => b.timestamp - a.timestamp);
  return allPosts.slice(0, n);
}

function getPost(id) {
  return decoratePost(posts[id]);
}

type User = {
  id: number;
  uname: string;
  password: string;
};

function addPost({
  title,
  link,
  description,
  creator,
  subgroup,
}: {
  title: string;
  link: string;
  description: string;
  creator: User;
  subgroup: string;
}) {
  let id = Math.max(...Object.keys(posts).map(Number)) + 1;
  let post = {
    id,
    title,
    link,
    description,
    creator: Number(creator.id),
    subgroup,
    timestamp: Date.now(),
  };
  posts[id] = post;
  return post;
}

function editPost(post_id, changes = {}) {
  let post = posts[post_id];
  if (changes.title) {
    post.title = changes.title;
  }
  if (changes.link) {
    post.link = changes.link;
  }
  if (changes.description) {
    post.description = changes.description;
  }
  if (changes.subgroup) {
    post.subgroup = changes.subgroup;
  }
}

function deletePost(post_id) {
  delete posts[post_id];
}

function getSubs() {
  return Array.from(new Set(Object.values(posts).map((post) => post.subgroup)));
}

async function getCommentsForPost(postId: number) {
  const commentsForPost = Object.values(comments).filter(
    (comment) => comment.post_id === postId
  );

  return commentsForPost;
}

function getComment(commentId) {
  const comment = comments[commentId];
  if (!comment) {
    throw new Error("Comment not found");
  }
  const decoratedComment = {
    ...comment,
    creator: users[comment.creator],
  };
  return decoratedComment;
}

function addComment(post_id, creator, description) {
  let id = Math.max(...Object.keys(comments).map(Number)) + 1;
  let comment = {
    id,
    post_id: Number(post_id),
    creator: Number(creator),
    description,
    timestamp: Date.now(),
  };
  comments[id] = comment;
  return comment;
}

function deleteComment(comment_id) {
  if (comments[comment_id]) {
    delete comments[comment_id];
    return true;
  }
  return false;
}

export {
  debug,
  getUser,
  getUserByUsername,
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  getSubs,
  addComment,
  decoratePost,
  createUser,
  deleteComment,
  getCommentsForPost,
  getComment,
  votePost,
};
