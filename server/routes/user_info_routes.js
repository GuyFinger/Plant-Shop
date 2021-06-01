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

router.get('/sitedata', async(req,res)=>{
    try{
        const q= 'SELECT COUNT(*) AS total_orders FROM orders '
        const qq = 'SELECT COUNT(*) AS total_products FROM products '
        const orders = await Query(q)
        const products = await Query(qq)
        res.json({
            orders,
            products
        })
    }catch(err) {
        console.log(err);
        res.sendStatus(500)

    }
})

router.post('/cartstatus', async (req, res) => {
    try {
        const u = `SELECT * FROM users WHERE ID= ${req.body.userID}`
        const user = await Query(u)
        const q = `SELECT * FROM shopping_cart WHERE
        USER_IDENTIFIER = ${req.body.userID}  ORDER BY ID DESC LIMIT 1`
        const userCart = await Query(q)
        const qq = `SELECT * FROM orders WHERE USER_IDENTIFIER = ${req.body.userID}`
        const userOrder = await Query(qq)
        if (!user.length == 0 && !userCart.length == 0) {

            //active cart
            if (userCart[0].ORDER_STATUS == 0) {
                const qqq = `SELECT SUM(PRICE) AS TOTAL_PRICE FROM cart_item  WHERE SHOPPING_CART_IDENTIFIER = ${userCart[0].ID}`
                const totalPrice = await Query(qqq)
                res.json({
                    'cartDate': userCart[0].CREATION_DATE,
                    'price': totalPrice[0].TOTAL_PRICE,
                    'btn': 'proceed',
                    'cart':'open'
                })
                //no active cart && not first order
            } else if ((userCart[0].ORDER_STATUS == 1 || null) && (userOrder[0].USER_IDENTIFIER == req.body.userID)) {
                res.json({
                    'lastBuy': userOrder[0].ORDER_DATE,
                    'btn': 'start',
                    'cart':'null'


                })
                
            }
            
            //first order
        } else if (!user.length == 0 && userCart.length == 0 && userOrder.length == 0 && req.body.role == 'user') {
            res.json({
                'btn': 'first',
                'cart':'null'

            })

        } else if (req.body.role == 'admin'){
            res.json({
                'role': 'admin'
            })

        }else{
            res.sendStatus(500)

        }


    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

module.exports = router;
