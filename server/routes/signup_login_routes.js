require('dotenv').config({ path: __dirname + "/.env" })
const router = require('express').Router()
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



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
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//first signup step 
router.post('/signup', async (req, res) => {

    const idDuplicate = `SELECT ID from users where ID ="${req.body.ID}"`
    const emailDuplicate = `SELECT EMAIL from users where EMAIL = "${req.body.email}"`
    idDuplicateRes = await Query(idDuplicate)
    emailDuplicateRes = await Query(emailDuplicate)
    if ((idDuplicateRes.length === 0) && (emailDuplicateRes.length === 0) && ((validateEmail(req.body.email)))) {
        try {



            const hPassword = await bcrypt.hash(req.body.password, 10)
            const user = { ID: req.body.ID, EMAIL: req.body.email, PASSWORD: hPassword }
            const q = `INSERT INTO users (ID,EMAIL,PASSWORD,ADMIN_ROLE) VALUES (?,?,?,false) `
            await Query(q, user.ID, user.EMAIL, user.PASSWORD)
            const qq = `SELECT * FROM users`
            const users = await Query(qq)
            res.json(users)

        } catch (error) {
            console.log(error + "yup that's an error  ");
            res.status(500).send("ID is already in use ")
        }
    } else {
        if (!validateEmail(req.body.email)) {
            console.log("email is invalid")

        }
        else if (idDuplicateRes.length === 0) {

            console.log("email is already reg")
            res.status(500).send("email is already in use")
        } else {
            console.log("ID is already reg")
            res.status(500).send("ID is already in use")
        }
    }
})

//second signup phase
router.put('/signup', async (req, res) => {


    try {

        const user = { F_NAME: req.body.firstName, L_NAME: req.body.lastName, CITY: req.body.city, STREET: req.body.street }
        const q = `UPDATE users
        SET F_NAME = "${user.F_NAME}", L_NAME = "${user.L_NAME}", CITY="${user.CITY}",STREET="${user.STREET}" WHERE ID = "${req.body.ID}"`
        await Query(q, user.F_NAME, user.L_NAME, user.CITY, user.STREET)
        const qq = `SELECT * FROM users`
        const users = await Query(qq)
        res.json(users)

    } catch (error) {
        console.log(error + "yup that's an error  ");
        res.sendStatus(500)
    }

})


router.post('/verify', async (req, res) => {
    const authHeader = (req.body.token)
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        } else {
            console.log(user)
            res.json({ 'token': 'token verified' })
        }

    })
})


//login phase
router.post('/login', async (req, res) => {

    const q = `SELECT * FROM users WHERE EMAIL = "${req.body.email}"`
    const users = await Query(q)


    try {
        if (await bcrypt.compare(req.body.password, users[0].PASSWORD)) {
            const accessToken = jwt.sign(users[0].EMAIL, process.env.ACCESS_TOKEN_SECRET)
            console.log(accessToken)
            let isAdmin = null
            if (users[0].ADMIN_ROLE == '0') {
                isAdmin = false
            } else {

                isAdmin = true
            }
            res.json({ type: isAdmin ? 'admin' : 'user', token: accessToken, id: users[0].ID, isLogged: true })
        } else {
            res.sendStatus(400)
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(`user not found`)
    }
})


//get all users 
router.get('/users', async (req, res) => {
    try {
        const q = `SELECT * FROM users`
        const users = await Query(q)
        res.json(users)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
}
)



module.exports = router;

