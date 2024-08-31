const router = require("express").Router();
const { prisma } = require("../db");
const { authenticateToken, authenticateAdminToken } = require("../middlewares/auth");

router.get('/allusers' , async (req,res) => {
    

    try {

        const alluser = await prisma.user.findMany({})
        res.json(alluser)
    } catch (error) {
        console.log('error in creating order',error)
    }
})

router.delete('/deleteuser/:id' , authenticateAdminToken, async (req,res) => {
    //{id: 1, name: 'BERRILUM',Image: one, price: 10, stars: 5 },
    const id = parseInt(req.params.id, 10)
    console.log('from delete product',id)

    try {

        const newProduct = await prisma.user.delete({
            where: {
                id: id
            }
        }
        
        )
        res.json({message: "ok deleted"})
    } catch (error) {
        console.log('error in creating order',error)
    }
})


module.exports = router;

















