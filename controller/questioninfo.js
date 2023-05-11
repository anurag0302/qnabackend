const { dynamoClient, docClient, s3 } = require("../config/connection");
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
      "set question = :q, answer = :a, qa = :qa, dateLog = :dt,secondary=:sc,imageLocation = :imgl,createdBy=:cb,authorRole=:ar",
    ExpressionAttributeValues: {
      ":q": question.question,
      ":a": question.answer,
      ":qa":
        question.question.toLowerCase() + " " + question.answer.toLowerCase(),
      ":dt": question.dateLog,
      ":sc": question.secondary,
      ":imgl": imageLocation,
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
  return await dynamoClient.delete(params).promise();
};

const uploadImage = async (file, id) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // bucket that we made earlier
    Key: id + file.originalname, // Name of the image
    Body: file.buffer, // Body which will contain the image in buffer format
    ACL: "public-read-write", // defining the permissions to get the public link
    ContentType: "image/jpeg",
  };

  s3.upload(params, async (error, data) => {
    if (error) {
      console.log(error);
      res.status(500).send({ err: error });
    } else {
      // console.log(data.Location);
      // imagesArray.push(data.Location);
      // console.log(imagesArray);

      const params = {
        TableName: "QuestionAnswer",
        Key: {
          questionId: id,
        },
        UpdateExpression: "SET #listAttr = list_append(#listAttr, :newString)",
        ExpressionAttributeNames: {
          "#listAttr": "imageLocation",
        },
        ExpressionAttributeValues: {
          ":newString": [data.Location],
        },
      };

      dynamoClient.update(params, function (err, data) {
        if (err) {
          console.log("Error:", err);
        } else {
          console.log("Item updated successfully:", data);
        }
      });
    }
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
};
