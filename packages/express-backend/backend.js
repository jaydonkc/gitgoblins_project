// backend.js
import express from "express";
import cors from "cors";
import "./config/database.js";
import userRoutes from "./routes/user-routes.js";
import orgRoutes from "./routes/org-routes.js";
import petRoutes from "./routes/pet-routes.js";
import inquiryRoutes from "./routes/inquiry-routes.js";
import swipeRoutes from "./routes/swipe-routes.js";
import { loginUser, registerUser } from "./auth.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.post("/signup", registerUser);
app.post("/login", loginUser);

app.use("/users", userRoutes);
app.use("/orgs", orgRoutes);
app.use("/pets", petRoutes);
app.use("/inquiries", inquiryRoutes);
app.use("/swipes", swipeRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `REST API is listening on port ${process.env.PORT || port}.`
  );
});
