// backend.js
import express from "express";
import cors from "cors";
import "./config/database.js";
import userRoutes from "./routes/user-routes.js";
import orgRoutes from "./routes/org-routes.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/orgs", orgRoutes);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
