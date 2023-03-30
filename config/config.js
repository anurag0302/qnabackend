module.exports = {
  // aws_table_name: "users",
  aws_local_config: {
    //Provide details for local configuration
  },
  aws_remote_config: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_SECRET_KEY,
    region: process.env.AWS_REGION,
  },
};
