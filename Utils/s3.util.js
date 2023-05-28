require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");

const config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_IAM_USER_KEY,
    secretAccessKey: process.env.AWS_IAM_USER_SECRET,
  },
};
const s3 = new S3Client(config);

module.exports = s3;
