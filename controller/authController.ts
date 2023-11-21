import * as db from "../fake-db";

async function createUser(uname: string, password: string) {
  return db.createUser({ uname, password });
}
export { createUser };
