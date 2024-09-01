const router = require("express").Router();
const { prisma } = require("../db");
const {
  authenticateToken,
  authenticateAdminToken,
} = require("../middlewares/auth");

// create order
router.post("/add", authenticateToken, async (req, res) => {
  const { orderArr, totalAmount } = req.body;

  try {
    // get user address
    const oldUser = await prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
    });

    const newOrder = await prisma.orders.create({
      data: {
        orderDetails: orderArr,
        orderAmount: totalAmount,
        address: oldUser.address,
        customerId: oldUser.id,
      },
      select: {
        orderId: true,
        orderDetails: true,
        orderAmount: true,
        address: true,
      },
    });
    res.json({ message: "ok created" });
  } catch (error) {
    console.log("error in creating order", error);
  }
});

// list all order for ADMIN
router.get("/allorders", authenticateAdminToken, async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(orders);
  } catch (error) {
    console.log("error in getting all order", error);
  }
});

// get all order of user
router.get("/userorders", authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      where: {
        customerId: req.user.id,
      },
    });
    res.json(orders);
  } catch (error) {
    console.log("error in getting all order", error);
  }
});

module.exports = router;
