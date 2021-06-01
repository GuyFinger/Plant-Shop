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



router.post('/newcart',async (req,res)=>{
    try{
        const q=`SELECT * FROM shopping_cart WHERE USER_IDENTIFIER = ${req.body.userID}
        AND ORDER_STATUS = 0`
        const openCart = await Query(q)
        const o = `INSERT INTO shopping_cart (USER_IDENTIFIER, CREATION_DATE, ORDER_STATUS) VALUES (${req.body.userID},now(),0)`
        
        if(openCart.length === 0){
            await Query(o)
            const openNewCart = await Query(q)
            res.json(openNewCart) 
        }else{
            res.json(openCart)
        }        
    }catch(err){
    console.log(err)
    res.sendStatus(500)
}}
)

//check item qty

router.post('/cart',async(req,res)=>{
    try{
        const q = `SELECT PRODUCT_IDENTIFIER,cart_item.ID,QTY,cart_item.PRICE,PRODUCT_NAME,IMAGE FROM cart_item INNER JOIN products ON cart_item.PRODUCT_IDENTIFIER = products.ID WHERE SHOPPING_CART_IDENTIFIER = ${req.body.cartID}`
        const cart = await Query(q)
        res.json(cart)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})

router.post('/qty',async(req,res)=>{
    try{
        const q = `SELECT cart_item.ID,QTY,SHOPPING_CART_IDENTIFIER,PRODUCT_IDENTIFIER,USER_IDENTIFIER FROM cart_item INNER JOIN shopping_cart ON cart_item.SHOPPING_CART_IDENTIFIER = shopping_cart.ID WHERE SHOPPING_CART_IDENTIFIER =${req.body.cartID}  AND QTY > 0 `
        const qty= await Query (q)
        res.json(qty)
    }catch (err){
        console.log(err);
        res.sendStatus(500)
    }
})
//add item to cart
router.post('/addtocart', async (req, res) => {
    
    try {
        const { product_ID, cart_ID, qty } = req.body
        const q = `INSERT INTO cart_item (PRODUCT_IDENTIFIER,SHOPPING_CART_IDENTIFIER,QTY,PRICE) VALUES (?,?,?, cart_item.QTY *(SELECT PRICE FROM products WHERE ID = ${req.body.product_ID}))`
        const check = `SELECT * FROM cart_item WHERE SHOPPING_CART_IDENTIFIER = ${cart_ID} AND PRODUCT_IDENTIFIER = ${product_ID}`
        const changeQty = `UPDATE cart_item SET QTY = QTY + 1, PRICE = cart_item.QTY * (SELECT PRICE FROM products WHERE ID = cart_item.PRODUCT_IDENTIFIER) WHERE PRODUCT_IDENTIFIER = ${product_ID} AND SHOPPING_CART_IDENTIFIER = ${cart_ID}`
        const checked = await Query(check,cart_ID,product_ID)
        if(checked.length == 0){
            await Query(q, product_ID, cart_ID, qty, req.body.product_ID)

        }else{

            if(checked[0].PRODUCT_IDENTIFIER == product_ID ){
                await Query(changeQty,product_ID,cart_ID)
                
            }else{
                
                await Query(q, product_ID, cart_ID, qty, req.body.product_ID)
            }
        }
            const qq = 'SELECT * FROM cart_item'
        const updatedCart = await Query(qq)
        res.json(updatedCart)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
}
)


//change amount of item in cart
router.put('/changeqty', async (req, res) => {
    try {
        const q = `UPDATE cart_item SET QTY = "${req.body.qty}" , PRICE = cart_item.QTY * (SELECT PRICE FROM products WHERE ID = cart_item.PRODUCT_IDENTIFIER) WHERE PRODUCT_IDENTIFIER = ${req.body.productID} AND SHOPPING_CART_IDENTIFIER=${req.body.cartID}`
        await Query(q, req.body.qty, req.body.product_ID)
        const qq = 'SELECT * FROM cart_item'
        const updatedCart = await Query(qq)
        res.json(updatedCart)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})

router.post('/getCartIdByProductID',async(req,res)=>{
    try{
        const q=`SELECT ID FROM cart_item WHERE PRODUCT_IDENTIFIER = ${req.body.id}`
        const cartIdFromProductID = await Query(q,req.body.id)
        res.json(cartIdFromProductID[0].ID)
    }catch (err){
        console.log(err)
        res.sendStatus(500)
    }
})
//delete single item from cart
router.delete('/deleteitem/:productID', async (req, res) => {
    try {
        const q = `DELETE FROM cart_item WHERE ID = ${req.params.productID} `
        await Query(q, req.params.productID)
        const qq = 'SELECT * FROM cart_item'
        const updatedCart = await Query(qq)
        res.json(updatedCart)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})

//delete all items from cart
router.delete('/deleteall/:cartID', async (req, res) => {
    try {
        const q = `DELETE FROM cart_item WHERE SHOPPING_CART_IDENTIFIER = ${req.params.cartID}`
        await Query(q, req.params.cartID)
        const qq = 'SELECT * FROM cart_item'
        const updatedCart = await Query(qq)
        res.json(updatedCart)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})


module.exports = router;
