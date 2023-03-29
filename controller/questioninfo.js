const { dynamoClient, docClient } = require("../config/connection");
const TABLE_NAME = "QuestionAnswer";
const getQuestions = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const questions = await dynamoClient.scan(params).promise();
  return questions;
};

const getQuestionById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      questionId: id,
    },
  };
  return await dynamoClient.get(params).promise();
};

//Api for searching
const getSearchResult = async (data) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "contains(qa, :qa)",
    ExpressionAttributeValues: {
      ":qa": { S: data },
    },
  };
  return await docClient.scan(params).promise();
};

const addOrUpdateQuestion = async (question) => {
  const params = {
    TableName: TABLE_NAME,
    Item: question,
  };
  return await dynamoClient.put(params).promise();
};
const updateQuestion = async (question, imageLocation) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      questionId: question.id,
    },
    UpdateExpression:
      "set question = :q, answer = :a, qa = :qa, dateLog = :dt,secondary=:sc,imageLocation = :imgl",
    ExpressionAttributeValues: {
      ":q": question.question,
      ":a": question.answer,
      ":qa":
        question.question.toLowerCase() + " " + question.answer.toLowerCase(),
      ":dt": question.dateLog,
      ":sc": question.secondary,
      ":imgl": imageLocation,
    },
  };
  return await dynamoClient.update(params).promise();
};

const deleteQuestion = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      questionId: id,
    },
  };
  return await dynamoClient.delete(params).promise();
};

module.exports = {
  dynamoClient,
  getQuestions,
  getQuestionById,
  addOrUpdateQuestion,
  getSearchResult,
  deleteQuestion,
  updateQuestion,
};
