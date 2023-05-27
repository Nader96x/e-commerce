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
    .connect(db,{
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser:true,
        useFindAndModify:false
    })
    .then(() => {
        console.log("DB Connected Successfully");

        // Run The Server
        app.listen(port, () => {
            console.log(`App Running on port ${port}`);
        });
    });

// Handle Unhandled Rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting Down...");
  console.log(err.name, err.message);
  process.exit(1);
});
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting Down...");
  console.log(err.name, err.message);
  process.exit(1);
});
