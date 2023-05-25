import { db } from "./db";

db.from("profiles")
  .select("*")
  .then((data) => console.log(data));
