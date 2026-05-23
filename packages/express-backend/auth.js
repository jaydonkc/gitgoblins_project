import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "./models/user.js";

function generateAccessToken(username, role) {
  return new Promise((resolve, reject) => {
    const tokenSecret = process.env.TOKEN_SECRET;

    if (!tokenSecret) {
      reject(new Error("TOKEN_SECRET is not configured"));
      return;
    }

    jwt.sign(
      { username: username, role: role },
      tokenSecret,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}

export function registerUser(req, res) {
  const { username, pwd, role = "adopter" } = req.body; // from form
  const normalizedRole = role === "organization" ? "organization" : "adopter";

  if (!username || !pwd) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    userModel
      .findOne({ username })
      .then((existingUser) => {
        if (existingUser) {
          res.status(409).send("Username already taken");
          return undefined;
        }

        return bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(pwd, salt))
          .then((hashedPassword) =>
            userModel.create({
              username,
              name: username,
              email: `${username}@auth.local`,
              hashedPassword,
              role: normalizedRole
            })
          )
          .then(() => generateAccessToken(username, normalizedRole))
          .then((token) => {
            console.log("Token:", token);
            res.status(201).send({ token: token, role: normalizedRole, username });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Failed to register user");
      });
  }
}

export function loginUser(req, res) {
  const { username, pwd } = req.body; // from form

  userModel
    .findOne({ username })
    .then((retrievedUser) => {
      if (!retrievedUser) {
        // invalid username
        res.status(401).send("Unauthorized");
      } else {
        bcrypt
          .compare(pwd, retrievedUser.hashedPassword)
          .then((matched) => {
            if (matched) {
              generateAccessToken(username, retrievedUser.role).then((token) => {
                res.status(200).send({
                  token: token,
                  role: retrievedUser.role,
                  username
                });
              });
            } else {
              // invalid password
              res.status(401).send("Unauthorized");
            }
          })
          .catch(() => {
            res.status(401).send("Unauthorized");
          });
      }
    })
    .catch(() => {
      res.status(401).send("Unauthorized");
    });
}

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  // Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];
  const tokenSecret = process.env.TOKEN_SECRET;

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else if (!tokenSecret) {
    console.log("TOKEN_SECRET is not configured");
    res.status(500).send("Authentication is not configured");
  } else {
    jwt.verify(
      token,
      tokenSecret,
      (error, decoded) => {
        if (decoded) {
          req.user = decoded;
          next();
        } else {
          console.log("JWT error:", error);
          res.status(401).end();
        }
      }
    );
  }
}

export function requireOrganization(req, res, next) {
  if (req.user?.role === "organization") {
    next();
  } else {
    res.status(403).send("Forbidden: organization account required");
  }
}
