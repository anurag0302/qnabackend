const express = require("express"); //import express
const { v4: uuidv4 } = require("uuid");
const { s3 } = require("../config/connection");
const router = express.Router();
const { dynamoClient } = require("../config/connection");

const {
  addOrUpdateQuestion,
  getQuestions,
  deleteQuestion,
  getQuestionById,
  getSearchResult,
  updateQuestion,
  uploadImage,
} = require("../controller/questioninfo");
const { upload } = require("../utils/imageStorage");

router.get("/questions", async (req, res) => {
  try {
    const questions = await getQuestions();
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get("/questions/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const question = await getQuestionById(id);
    //console.log(question);
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get("/questionsans/:data", async (req, res) => {
  const data = req.params.data;

  try {
    const question = await getSearchResult(data);

    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.post("/questions", upload, async (req, res) => {
  const {
    question,
    answer,
    status,
    dateLog,
    secondary,
    createdBy,
    authorRole,
  } = JSON.parse(req.body.data);

  // const { preview, data } = JSON.parse(req.body.image);
  // console.log(preview);
  //console.log(req.files);

  try {
    let imageLocation = [];
    let id = uuidv4();
    if (req.files) {
      // uploadImage(req.file, id);
      //is the id need to be unique for images?
      req.files.map((file) => {
        uploadImage(file, id);
      });
    }
    // console.log(imageLocation);
    // const params = {
    //   TableName: "QuestionAnswer",
    //   Key: {
    //     questionId: id,
    //   },
    //   UpdateExpression: "set imageLocation = :r",
    //   ExpressionAttributeValues: {
    //     ":r": imageLocation,
    //   },
    // };
    // await dynamoClient.update(params).promise();


    const qa = question.toLowerCase() + " " + answer.toLowerCase();
    const qnavalue = {
      question: question,
      answer: answer,
      questionId: id,
      createdBy: createdBy,
      authorRole: authorRole,
      qa: qa,
      status: status,
      dateLog: dateLog,
      secondary: secondary,
      imageLocation: imageLocation,
    };
    //console.log("addimageloc",qnavalue);
    const newQuestion = addOrUpdateQuestion(qnavalue);
    res.json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.put("/questions/:id", upload, async (req, res) => {
  const question = JSON.parse(req.body.data);
  let imageLocation = [];
  //console.log("question",question);
  const { id } = req.params;
  // if (req.file) {
  //   uploadImage(req.file, id);
  // }

  if (req.files) {
    // uploadImage(req.file, id);
    //is the id need to be unique for images?
    req.files.map((file) => {
      uploadImage(file, id);
    });
  }

  question.id = id;
  try {
    //console.log("imagelocation",question.imgLocation);
    const newQuestion = await updateQuestion(question, imageLocation);
    res.json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    res.json(await deleteQuestion(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = router;
