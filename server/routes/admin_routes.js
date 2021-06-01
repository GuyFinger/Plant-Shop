const router = require('express').Router()
const mysql = require('mysql');



const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'project4'
});

const Query = (q, ...values) => {
    return new Promise((resolve, reject) => {
        con.query(q, values, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}
//get selected product

router.get('/product/:id', async (req, res) => {
    try {
        const q = `SELECT products.ID,PRODUCT_NAME,PRICE,IMAGE,PRODUCT_CATEGORY,CATEGORY FROM products INNER JOIN categories ON products.PRODUCT_CATEGORY = categories.ID WHERE products.ID = ${req.params.id}`
        const selectedProduct = await Query(q,req.params.id)
        res.json(selectedProduct)
        console.log(selectedProduct)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
}
)//add products
router.post('/addproduct', async (req, res) => {
    try {
        const { productName, productCategoty, productPrice, productImage } = req.body

        const q = `insert into products (PRODUCT_NAME,PRODUCT_CATEGORY,PRICE,IMAGE)VALUES (?,?,?,?)`

        await Query(q, productName, productCategoty, productPrice, productImage)
        const qq = 'SELECT * FROM products'
        const updateproducts = await Query(qq)
        res.json(updateproducts)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})

//edit product 
router.put('/editproduct', async (req, res) => {
    try {
        const { productName, productCategoty, productPrice, productImage, productID } = req.body

        const q = `UPDATE products SET 
        PRODUCT_NAME = "${productName}" , 
        PRODUCT_CATEGORY = "${productCategoty}",
        PRICE ="${productPrice}" ,
        IMAGE = "${productImage}"
        WHERE ID = ${productID}`;

        await Query(q, productName, productCategoty, productPrice, productImage, productID)
        const qq = 'SELECT * FROM products'
        const updateproducts = await Query(qq)
        res.json(updateproducts)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})


module.exports = router;
