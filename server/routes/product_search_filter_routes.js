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


router.get('/products', async (req, res) => {
    try {
        const q = `SELECT products.ID,PRODUCT_NAME,PRICE,IMAGE,CATEGORY FROM products INNER JOIN categories ON products.PRODUCT_CATEGORY = categories.ID`
        const products = await Query(q)
        const dbToUi = products.map(product => {
            return { id: product.ID, name: product.PRODUCT_NAME, price: product.PRICE, category: product.CATEGORY, img: product.IMAGE }
        })
        console.log(dbToUi)
        res.json(dbToUi)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
}
)
router.post('/productbyname', async (req, res) => {
    try {

        const q = `SELECT * FROM products INNER JOIN categories ON products.PRODUCT_CATEGORY = categories.ID WHERE PRODUCT_NAME LIKE '%${req.body.productName}%' `
        const product = await Query(q)
        const dbToUi = product.map(prd => {
            return { id: prd.ID, name: prd.PRODUCT_NAME, price: prd.PRICE, category: prd.CATEGORY, img: prd.IMAGE }
        })
console.log(dbToUi)
        res.json(dbToUi)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
}
)
router.post('/productbycategory', async (req, res) => {
    try {
        if(req.body.productCategory == 'all'){
            const q = `SELECT * FROM products  INNER JOIN categories ON products.PRODUCT_CATEGORY = categories.ID`
            const product = await Query(q)
            const dbToUi = product.map(prd => {
                return { id: prd.ID, name: prd.PRODUCT_NAME, price: prd.PRICE, category: prd.CATEGORY, img: prd.IMAGE }
            })
            res.json(dbToUi)
        }else{

            const q = `SELECT * FROM products  INNER JOIN categories ON products.PRODUCT_CATEGORY = categories.ID WHERE CATEGORY ="${req.body.productCategory}"`
            const product = await Query(q)
            const dbToUi = product.map(prd => {
                return { id: prd.ID, name: prd.PRODUCT_NAME, price: prd.PRICE, category: prd.CATEGORY, img: prd.IMAGE }
            })
            res.json(dbToUi)
        }
       
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
}
)


module.exports = router;
