const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1618578",
  key: "0fc4fc03768ac1db6774",
  secret: "04a7344b0bc8b36670db",
  cluster: "eu",
  useTLS: true,
});

module.exports = pusher;
