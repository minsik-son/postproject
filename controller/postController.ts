import * as db from "../fake-db";

// Make calls to your db from this file!

async function getPosts(n = 5, sub: string | undefined = undefined) {
  return db.getPosts(n, sub);
}

type User = {
  id: number;
  uname: string;
  password: string;
};

async function createPost({
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
}): Promise<any> {
  const errors: string[] = [];

  if (!title) {
    errors.push("Title is missing");
  }

  if (!link) {
    errors.push("Link is missing");
  }

  if (!description) {
    errors.push("Description is missing");
  }

  if (!creator) {
    errors.push("Creator information is missing");
  } 
  else {
    if (!creator.id) {
      errors.push("Creator ID is missing");
    }

    if (!creator.uname) {
      errors.push("Creator username is missing");
    }

    if (!creator.password) {
      errors.push("Creator password is missing");
    }
  }

  if (!subgroup) {
    errors.push("Subgroup is missing");
  }

  if (errors.length > 0) {
    throw new Error(`Missing required information: ${errors.join(", ")}`);
  }
  const newPost = db.addPost({ title, link, description, creator, subgroup });
  return newPost;
}

async function getOnePost(postId: number) {
  return db.getPost(postId);
}

async function getSubs() {
  return db.getSubs();
}

async function editPost(post_id: number, changes = {}) {
  return db.editPost(post_id, changes);
}

async function deletePost(post_id: number) {
  return db.deletePost(post_id);
}

async function addComment(post_id: number, creator: User, description: string) {
  return db.addComment(post_id, creator, description);
}

async function deleteComment(comment_id: number) {
  return db.deleteComment(comment_id);
}
async function getComment(comment_id: number) {
  return db.getComment(comment_id);
}

async function votePost(postId: number, action: string, user: User) {
  return db.votePost(postId, action, user);
}
export {
  getPosts,
  createPost,
  getOnePost,
  getSubs,
  editPost,
  deletePost,
  addComment,
  deleteComment,
  getComment,
  votePost,
};
