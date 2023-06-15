const express = require("express"); //import express
const jwt = require("jsonwebtoken");
const utils = require("../utils/utils");
const router = express.Router();

const {
  getUsers,
  login,
  addUser,
  deleteUser,
  updateUser,
  getUserById,
} = require("../controller/userinfo");

router.get("/userinfo", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get("/userinfo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.post("/logininfo", async (req, res) => {
  const { id, password } = req.body;
  //console.log(req.body);
  try {
    const newUser = await login(req.body);
    console.log(newUser);
    if (newUser?.Item?.password === password) {
      const token = utils.generateToken(newUser.Item);
      // get basic user details
      const userObj = utils.getCleanUser(newUser.Item);
      // return the token along with user details
      return res.json({ Item: userObj, token });
      //return res.json(newUser)
    } else {
      console.log("else");
      res.status(401).json({ err: "Invalid cred Found" });
    }
  } catch (err) {
    console.log("catch");
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.post("/userinfo", async (req, res) => {
  const { id, fullName, password, rolePosition } = req.body;

  const data = {
    id: id,
    fullName: fullName,
    password: password,
    rolePosition: rolePosition,
  };
  try {
    const newUser = await addUser(data);
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err });
  }
});

//==================================================================

router.post("/tokeninfo", async (req, res) => {
  const { token } = req.body;

  var decodedClaims = jwt.verify(token, process.env.JWT_SECRET);
  const { id, password } = decodedClaims;
  try {
    const newUser = await login(decodedClaims);
    if (newUser.Item.password === password) {
      const userObj = utils.getCleanUser(newUser.Item);

      return res.json({ Item: userObj });
      //return res.json(newUser)
    } else {
      res.status(500).json({ err: "Invalid cred Found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

//==================================================================

router.put("/userinfo/:id", async (req, res) => {
  const user = req.body;
  const { id } = req.params;

  user.id = id;
  try {
    const editUser = await updateUser(user);
    res.json(editUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.delete("/userinfo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    res.json(await deleteUser(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = router;
