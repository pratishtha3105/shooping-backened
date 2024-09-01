const router = require("express").Router();
const { prisma } = require("../db");
const {
  authenticateToken,
  authenticateAdminToken,
} = require("../middlewares/auth");

// all user lists for admin
router.get("/allusers", authenticateAdminToken,async (req, res) => {
  try {
    const alluser = await prisma.user.findMany({});
    res.json(alluser);
  } catch (error) {
    console.log("error in creating order", error);
  }
});

// delete existing user for admin pannel
router.delete("/deleteuser/:id", authenticateAdminToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log("from delete product", id);

  try {
    const newProduct = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.json({ message: "ok deleted" });
  } catch (error) {
    console.log("error in creating order", error);
  }
});

module.exports = router;
