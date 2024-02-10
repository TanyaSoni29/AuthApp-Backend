const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {

try {
    const {token} = req.body || req.cookies || req.header("Authorization").replace("Bearer ", "");
   
    if(!token || token === undefined ){
        return res.status(401).json({
            success: false,
            message: "Token Missing"
        })
    }
    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET) // verify method se hum authentication kar pa rahe hai
        console.log(decode);
        req.user = decode 
    } catch(error) {
        return res.status(401).json({
            success: false,
            message: "Token is Invalid"
        })
    }
    next();

} catch (error) {
     return res.status(401).json({
            success: false,
            message: "Failled in Authentication"
        })
}
}

exports.isStudent = (req, res, next) => {

try {
    if(req.user.role !== "Student"){
        return res.status(401).json({
            success: false,
            message: "This is a Protected route."
        })
    }
    next();
    // yaha humne success ki nhi ki kyunki humne usse route define karrte waqt daal diya hai
    
} catch (error) {
    return res.status(401).json({
        success: false,
        message: " User Role is not matching"
    })
}

    
}


exports.isAdmin = (req, res, next) => {

try {

    if(req.user.role !== "Admin"){
        return res.status(401).json({
            success: false,
            message: "This is a Protected route."
        })

    }
    next();
    
} catch (error) {
    return res.status(401).json({
        success: false,
        message: " User Role is not matching."
    })
}

    
}