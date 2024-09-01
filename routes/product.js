const router = require("express").Router();
const { prisma } = require("../db");
const {
  authenticateToken,
  authenticateAdminToken,
} = require("../middlewares/auth");

// get all products
router.get("/getall", async (req, res) => {
  try {
    const allProduct = await prisma.product.findMany({});
    res.json(allProduct);
  } catch (error) {
    console.log("error in creating order", error);
  }
});

// get details of single product
router.get("/oneproduct/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const newProduct = await prisma.product.findFirst({
      where: {
        id: id,
      },
    });
    res.json(newProduct);
  } catch (error) {
    console.log("error in creating order", error);
  }
});

// add product
router.post("/addproduct", authenticateAdminToken, async (req, res) => {
  const { productName, productdescription, price, availability, productImage } =
    req.body;

  const newPrice = parseInt(price);

  try {
    const newProduct = await prisma.product.create({
      data: {
        productName,
        productdescription,
        price: newPrice,
        availability,
        productImage,
      },
    });
    res.json(newProduct);
  } catch (error) {
    console.log("error in creating order", error);
  }
});

// delete product
router.delete(
  "/deleteproduct/:id",
  authenticateAdminToken,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
      const newProduct = await prisma.product.delete({
        where: {
          id: id,
        },
      });
      res.json({ message: "ok deleted" });
    } catch (error) {
      console.log("error in creating order", error);
    }
  }
);

module.exports = router;
