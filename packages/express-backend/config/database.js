import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.set("debug", true);
dotenv.config();

function getMongoURI(dbname) {
  // Pull the single connection string from the environment
  const connection_string = process.env.MONGODB_URI || process.env.MONGO_CONNECTION_STRING;

  if (!connection_string) {
    console.error(
      "Error: MONGODB_URI is not defined in .env"
    );
    return "";
  }

  // Ensure there is exactly one slash between the URI and the dbname
  const baseURI = connection_string.endsWith("/")
    ? connection_string
    : `${connection_string}/`;

  const finalURI = `${baseURI}${dbname}?retryWrites=true&w=majority`;

  console.log("Connecting to MongoDB database:", dbname);
  return finalURI;
}

const mongoURI = getMongoURI("primaryDB");

if (mongoURI) {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((error) => console.log("Connection Error:", error));
} else {
  console.error("MongoDB connection skipped until MONGODB_URI is configured.");
}
