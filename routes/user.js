const express = require("express");
const router = express.Router();


const {login , signup} = require("../controllers/auth")
const {auth, isStudent, isAdmin} = require("../middlewares/auth")



router.post("/login", login)
router.post("/signup", signup )

//protected routes

router.get("/student",auth , isStudent, (req,res) =>{
    res.json({
        success:true,
        message:" Welcome to the procted Route for Student"
    })
});

router.get("/admin",auth , isAdmin, (req,res) =>{
    res.json({
        success:true,
        message:" Welcome to the procted Route for Admin"
    })
});

module.exports = router;