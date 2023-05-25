"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
db_1.db.from("profiles")
    .select("*")
    .then((data) => console.log(data));
