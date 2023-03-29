const { dynamoClient, docClient } = require("../config/connection");

const TABLE_NAME = "UsersInfo";

const getUsers = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const questions = await dynamoClient.scan(params).promise();
  return questions;
};

const getUserById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
  };
  return await dynamoClient.get(params).promise();
};

const login = async (data) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: data.id,
    },
    // FilterExpression: "password = :pass",
    // ExpressionAttributeValues: {
    //     ":pass" : data.password
    // }
  };
  return await dynamoClient.get(params).promise();
};

const addUser = async (userinfo) => {
  console.log(userinfo.id);
  const params = {
    TableName: TABLE_NAME,
    Item: userinfo,
    ConditionExpression: "attribute_not_exists(id)",
  };
  return await dynamoClient.put(params).promise();
};

const updateUser = async (user) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: user.id,
    },
    UpdateExpression: "set rolePosition = :rolePosition",
    ExpressionAttributeValues: {
      ":rolePosition": user.rolePosition,
    },
  };
  return await dynamoClient.update(params).promise();
};

const deleteUser = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
  };
  return await dynamoClient.delete(params).promise();
};

module.exports = {
  getUsers,
  login,
  addUser,
  updateUser,
  deleteUser,
  getUserById,
};
