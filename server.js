const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");
const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
const port = process.env.PORT;

mongoose
  .createConnection(db)
  .asPromise()
  .then(() => {
    console.log("DB Connected Succesffully");
    app.listen(port, () => {
      console.log(`App Running on port ${port}`);
    });
  });

// Run The Server
