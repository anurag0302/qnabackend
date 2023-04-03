const express = require("express"); //import express
const { v4: uuidv4 } = require("uuid");
const { s3 } = require("../config/connection");
const router = express.Router();

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
  const { question, answer, status, dateLog, secondary } = JSON.parse(
    req.body.data
  );
  let id = uuidv4();

  try {
    let imageLocation = "null";
    if (req.file) {
      uploadImage(req.file, id);
    }

    const qa = question.toLowerCase() + " " + answer.toLowerCase();
    const qnavalue = {
      question: question,
      answer: answer,
      questionId: id,
      qa: qa,
      status: status,
      dateLog: dateLog,
      secondary: secondary,
      imageLocation: imageLocation,
    };
    const newQuestion = addOrUpdateQuestion(qnavalue);
    res.json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.put("/questions/:id", upload, async (req, res) => {
  const question = JSON.parse(req.body.data);
  let imageLocation = "null";

  const { id } = req.params;
  if (req.file) {
    uploadImage(req.file, id);
  }

  question.id = id;
  try {
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
