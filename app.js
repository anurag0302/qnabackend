require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ credentials: true, origin: process.env.URL }));
app.use("/profile", express.static("upload"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Working on port 5000 ");
});

// Api for QuestionAnswers
const routes = require("./routes/questionRoute");
app.use("/", routes);

//UserInfo Working Api

const routes2 = require("./routes/userRoute");
app.use("/", routes2);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
