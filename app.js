const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/singup.html");
});

app.post("/", function(req, res) {

const firstName = req.body.fName;
const lastNmae = req.body.lName;
const email = req.body.email;

const data = {
    members: [
        {
            email_address:email,
            status:"subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastNmae
            }
        }
    ]
}   

const jsonData = JSON.stringify(data);

const url = process.env.url;

const option = {
    method: "POST",
    auth: process.env.auth
}

const request = https.request(url, option, function(response) {

    if(response.statusCode == 200){
        res.sendFile( __dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }

   response.on("data", function(data) {
    console.log(JSON.parse(data));
   })
})

request.write(jsonData);
request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
});
app.listen(process.env.PORT || 3000, function() {
    console.log("server is runing on port 3000");
});

