const router = require("express").Router();
const { prisma } = require("../db");
const { authenticateToken,authenticateAdminToken } = require("../middlewares/auth");

router.get("/getall", async (req, res) => {
  try {
    const allProduct = await prisma.product.findMany({});
    res.json(allProduct);
  } catch (error) {
    console.log("error in creating order", error);
  }
});

// return all product from a category
// router.get("/categoryproducts/:id", async (req, res) => {
//   //{id: 1, name: 'BERRILUM',Image: one, price: 10, stars: 5 },
//   const id = parseInt(req.params.id, 10);
//   //console.log("from category product", id);

//   try {
//     if (isNaN(id)) {
//       return res.status(400).send({ message: "Category ID must be a number." });
//     }

//     const categoryProduct = await prisma.product.findMany({
//       where: {
//         categoryId: id,
//       },
//     });

//     res.json(categoryProduct);
//   } catch (error) {
//     console.log("error in creating order", error);
//   }
// });

// get details of single product 
router.get("/oneproduct/:id", async (req, res) => {
  //{id: 1, name: 'BERRILUM',Image: one, price: 10, stars: 5 },
  const id = parseInt(req.params.id, 10);
  //console.log("from oneProduct product", id);

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

router.post("/addproduct", authenticateAdminToken ,async (req, res) => {
  // {id: 1, productName: 'dino', productImage: bsProduct3, price: 12 , discount: 16, stars: 4, category: 'baby',quantity: 10, sales: 20, featured: true, discription: 'Lorem ipsum dolor sit,  iste?'},
  const {
    productName,
    productdescription,
    price,
    availability,
    productImage
  } = req.body;

  const newPrice = parseInt(price);
  

  try {
    const newProduct = await prisma.product.create({
      data: {
        productName,
        productdescription,
        price: newPrice,
        availability,
        productImage
      },
    });
    res.json(newProduct);
  } catch (error) {
    console.log("error in creating order", error);
  }
});

router.delete("/deleteproduct/:id", authenticateAdminToken ,async (req, res) => {
  //{id: 1, name: 'BERRILUM',Image: one, price: 10, stars: 5 },
  const id = parseInt(req.params.id, 10);
  // console.log("from delete product", id);

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
});

module.exports = router;
