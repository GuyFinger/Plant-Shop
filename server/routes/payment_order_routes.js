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


//open a new shopping cart
router.post('/addcart', async (req, res) => {
    try {
        const { user_ID } = req.body
        const q = `INSERT INTO shopping_cart (USER_IDENTIFIER,CREATION_DATE,ORDER_STATUS) VALUES (?,now(),false)`
        await Query(q, user_ID)
        const qq = 'SELECT * FROM shopping_cart'
        const newCart = await Query(qq)
        res.json(newCart)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
}
)



//update delivery and cart status upon order
router.put('/order', async (req, res) => {
    try {
        const {deliveryDate,userID,cartID,city,street,credit} = req.body
        const q = `UPDATE shopping_cart SET ORDER_STATUS = 1 , DELIVERY_DATE = "${deliveryDate}" WHERE USER_IDENTIFIER = "${userID}"`;

        await Query(q, deliveryDate,userID)
        const qq = 'SELECT * FROM shopping_cart'
        const storeOrder = `insert into orders(USER_IDENTIFIER, SHOPPING_CART_IDENTIFIER, FINAL_PRICE, CITY, STREET, SHIPPMENT_DATE, ORDER_DATE, CREDIT_CARED)
        values 
        ("${userID}",
         "${cartID}",
        (SELECT SUM(PRICE) AS FINAL_PRICE FROM cart_item  WHERE SHOPPING_CART_IDENTIFIER = "${cartID}"),
        '${city}',
        "${street}",
        "${deliveryDate}",
        now(),"${credit}");`
        await Query(storeOrder)
        const deleteCart = `DELETE FROM cart_item WHERE SHOPPING_CART_IDENTIFIER = ${cartID}`
        await Query(deleteCart)
        const updatedCart = await Query(qq)
        res.json(updatedCart)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }ז
})

//get all products in cart (recipt)
router.get('/cartsum/:id',async (req,res)=>{
    try{
        const q =`SELECT SUM(PRICE)
        AS price
        FROM cart_item
        WHERE SHOPPING_CART_IDENTIFIER = ${req.params.id};`
        const qq = await Query(q,req.params.id)
        res.json(qq)
    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})

router.get('/loggedUser/:id',async (req,res)=>{
    try{
        const q = `SELECT F_NAME,L_NAME,EMAIL,CITY,STREET FROM users WHERE ID = ${req.params.id} `
        const qq = await Query(q,req.params.id)
        res.json(qq)
    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
})


module.exports = router;
