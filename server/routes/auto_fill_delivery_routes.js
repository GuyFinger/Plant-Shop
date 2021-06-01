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

//get city and street for auto fill
router.get('/useradress/:userID', async (req, res) => {
    try {
        const q = `SELECT * FROM users WHERE ID = ${req.params.userID}`
        const users = await Query(q,req.params.userID)
        res.json(users)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
}
)

//get all unavilable delivery slots
router.get('/deliveryslot', async (req, res) => {
    try {
        const q = ` SELECT DELIVERY_DATE, COUNT(*) as qty  FROM shopping_cart WHERE DELIVERY_DATE IS NOT NULL GROUP BY DELIVERY_DATE  HAVING qty >= 3 `
        const takenSlots = await Query(q)
        res.json(takenSlots)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
}
)

module.exports = router;
