const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { prisma } = require("../db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// admin signup
router.post(
  "/signup",
  [
    check("email", "Please input valid email").isEmail(),
    check(
      "password",
      "Please input a password with a minium of 6 character"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await prisma.admin.findUnique({
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

    const newUser = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    const token = await JWT.sign(
      newUser,
      process.env.JSON_WEB_TOKEN_SECRET_ADMIN,
      {
        expiresIn: 3600000,
      }
    );
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

// ADMIN login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.admin.findUnique({
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
  };

  const userPayload = {
    id: user.id,
    email: user.email,
  };
  const token = await JWT.sign(
    userPayload,
    process.env.JSON_WEB_TOKEN_SECRET_ADMIN,
    {
      expiresIn: 3600000,
    }
  );
  return res.json({
    user: sendingPayload,
    token,
  });
});

module.exports = router;
