const express = require("express");
const router = express.Router();
const User = require("../db/models/user-model");
const Step = require("../db/models/step-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const cors = require("cors");
const config = require("config");
const auth = require("../middleware/auth");
const Photo = require("../db/models/image-model");

var fs = require("fs");
var multer = require("multer");

const bodyParser = require("body-parser");

router.use(express.json({ extended: false }));
router.use(bodyParser.json());
router.use(cors());

router.post("/register", (req, res) => {
  const { email, password, username } = req.body;
  console.log(email, password, username);

  let newUser = new User({
    email,
    password,
    username
  });

  newUser
    .save()
    .then(user => {
      if (!user) {
        return res.status(400).send();
      }
      var newStep = new Step({ user: user.id, numberstep: 0, money: 0 });

      newStep
        .save()
        .then(step => {
          return res.status(201).send(user);
        })
        .catch(err => console.log(err));
    })
    .catch(err => {
      if (err) {
        return res.status(400).send({ error: err });
      }
      return res.status(400).send();
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("/login");
  User.findOne({ email })
    .then(user => {
      if (!user) {
        console.log(user);
        return res.status(400).send();
      }
      console.log("user");
      bcrypt
        .compare(password, user.password)
        .then(match => {
          if (!match) {
            return res.status(401).send();
          }
          const payload = {
            user: {
              id: user.id
            }
          };

          jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              console.log(token);
              res.append("x-auth-token", token).json({ token });
            }
          );
        })
        .catch(err => {
          return res.status(401).json({ error: err });
        });
    })

    .catch(err => {
      if (err) {
        return res.status(401).send(err);
      }
    });
});

const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "profile-" + new Date().toISOString() + "." + filetype);
  }
});

const upload = multer({ storage: Storage });

router.get("/api/image", auth, (req, res) => {
  Photo.find({ user: req.user.id })
    .then(photos => res.json(photos))
    .catch(error => {
      console.log(error);
      res.status(500).send("Server Error");
    });
});

router.post("/api/upload", auth, upload.single("photo"), (req, res) => {
  console.log("file", req.file);
  console.log("body", req.body);

  let photo = new Photo({
    user: req.user.id,
    categorie: req.body.categorie,
    name: req.file.filename,
    path: req.file.path
  });

  photo
    .save()
    .then(result => {
      res.status(201).json({
        message: "Image is upload !",
        result: result
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send("Server Error");
    });
});

// router.get("/data", (req, res) => {
//   db.User.findOne().then(console.log(res));
// });

// router.get("/data", checkToken, (req, res) => {
//   //verify the JWT token generated for the user
//   jwt.verify(req.token, "privatekey", (err, authorizedData) => {
//     if (err) {
//       //If error send Forbidden (403)
//       console.log("ERROR: Could not connect to the protected route");
//       res.sendStatus(403);
//     } else {
//       //If token is successfully verified, we can send the autorized data
//       res.json({
//         message: "Successful log in",
//         authorizedData
//       });
//       console.log("SUCCESS: Connected to protected route");
//     }
//   });
// });

// const checkToken = (req, res, next) => {
//   const header = req.headers["authorization"];

//   if (typeof header !== "undefined") {
//     const bearer = header.split(" ");
//     const token = bearer[1];

//     req.token = token;
//     next();
//   } else {
//     //If header is undefined return Forbidden (403)
//     res.sendStatus(403);
//   }
// };

module.exports = router;
