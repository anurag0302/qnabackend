const { dynamoClient, docClient, s3 } = require("../config/connection");
const { v4: uuidv4 } = require("uuid");

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
  // console.log("question",question);
  // console.log("imageLoc",imageLocation);
  //console.log("last imageloc", question.secondary[0].imgdata);
  const params = {
    TableName: TABLE_NAME,
    Key: {
      questionId: question.id,
    },
    UpdateExpression:
      "set question = :q, answer = :a, qa = :qa, dateLog = :dt,secondary=:sc,imageLocation = :imgl,createdBy=:cb,authorRole=:ar",
    ExpressionAttributeValues: {
      ":q": question.question,
      ":a": question.answer,
      ":qa":
        question.question.toLowerCase() + " " + question.answer.toLowerCase(),
      ":dt": question.dateLog,
      ":sc": question.secondary,
      ":imgl": [...imageLocation, ...question.imgLocation],
      ":cb": question.createdBy,
      ":ar": question.authorRole,
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
  console.log("first");
  return await dynamoClient.delete(params).promise();
};

const deleteS3Object = async (objectKey) => {
  try {
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: objectKey,
    };
    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data); // successful response
    });
  } catch (error) {
    console.error("Error deleting object:", error);
  }
};

const uploadImage = (file, id) => {
  const uniqueId = uuidv4();

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueId + file.originalname,
      Body: file.buffer,
      ContentType: file.type,
    };

    s3.upload(params, async (error, data) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        const params = {
          TableName: "QuestionAnswer",
          Key: {
            questionId: id,
          },
          UpdateExpression:
            "SET #listAttr = list_append(#listAttr, :newString), #anotherAttr = list_append(#anotherAttr, :newData)",
          ExpressionAttributeNames: {
            "#listAttr": "imageLocation",
            "#anotherAttr": "s3Keys",
          },
          ExpressionAttributeValues: {
            ":newString": [data.Location],
            ":newData": [uniqueId + file.originalname],
          },
        };

        dynamoClient.update(params, function (err, data) {
          if (err) {
            console.log("thissssss");
            // console.log("Error:", err);
            reject(err);
          } else {
            console.log("Item updated successfully:", data);
            resolve(data);
          }
        });
      }
    });
  });
};

module.exports = {
  dynamoClient,
  uploadImage,
  getQuestions,
  getQuestionById,
  addOrUpdateQuestion,
  getSearchResult,
  deleteQuestion,
  updateQuestion,
  deleteS3Object,
};
