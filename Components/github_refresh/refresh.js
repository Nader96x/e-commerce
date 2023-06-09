const { exec } = require("child_process");

module.exports = (req, res) => {
  exec("git pull origin main", (error) => {
    if (error) {
      console.error(`Error executing git pull: ${error.message}`);
      return res.status(500).send("Failed to execute git pull");
    }

    console.log("Git pull successful");
    res.send("Git pull successful");
  });
};
