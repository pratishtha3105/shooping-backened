const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { prisma } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

router.post(
  "/signup",
  [
    check("email", "Please input valid email").isEmail(),
    check(
      "password",
      "Please input a password with a minium of 6 character"
    ).isLength({ min: 6 }),
    check(
      "name",
      "Please input a username with a minium of 6 character"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password, name, address, phone } = req.body;
    //console.log(req.body)

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(400).json({
        errors: [{ msg: "This user already exists" }],
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username: name,
        password: hashedPassword,
        address,
        phoneNumber: phone,
      },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        phoneNumber: true,
      },
    });

    const token = await JWT.sign(newUser, process.env.JSON_WEB_TOKEN_SECRET, {
      expiresIn: 3600000,
    });
    return res.json({
      user: newUser,
      token,
    });
  }
);

// Validate that the user does exists
// Validate Password
// Return Jwt
//

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({
      errors: [{ msg: "Invalid Credentials" }],
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      errors: [{ msg: "Invalid Credentials" }],
    });
  }

  const sendingPayload = {
    id: user.id,
    email: user.email,
    username: user.username,
    address: user.address,
    phoneNumber: user.phoneNumber,
  };

  //console.log(user)
  const userPayload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = await JWT.sign(userPayload, process.env.JSON_WEB_TOKEN_SECRET, {
    expiresIn: 3600000,
  });
  return res.json({
    user: sendingPayload,
    token,
  });
});

router.get("/me", async (req, res) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) return res.send(null);

  const jwt = bearerToken.split("Bearer ")[1];
  if (!jwt) return res.send(null);

  let payload;
  try {
    payload = await JWT.verify(jwt, process.env.JSON_WEB_TOKEN_SECRET);
  } catch (error) {
    return res.send(null);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  return res.json(user);
});

module.exports = router;
