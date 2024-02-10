const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then( () => console.log("Db connected successfully"))
    .catch( (err) => {
        console.log("internal db coonection problem");
        console.log(err);
       
        process.exit(1);
    })
}
