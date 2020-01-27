const jwt = require("jsonwebtoken");

//JWT
let payload = {
  _id: "Hello JWT"
};

let secret = "12345678";

let token = jwt.sign(payload, secret);

// console.log(token);

let decoded = jwt.verify(token, "bad");

console.log(decoded);
