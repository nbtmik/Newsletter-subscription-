const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");
const request = require("request");
const app = express();

app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static("public"));

app.post("/",function(req,res){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const mail = req.body.mail;

    const data = {
        members: [
            {
                email_address:mail,
                status:"subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }
            }
        ]
    };
    const jsondata = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/61deb00862";

    const Options ={
        method : "POST",
        auth : "mik:4b8b929ce964a6888d8767ebe36d6805-us17"
    }

    const request = https.request(url,Options,function(response){
        console.log("STATUS:"+response.statusCode);
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsondata);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.get("/",function(req,res){
    res.sendFile(__dirname+"/sign.html");


});


app.listen(process.env.PORT ||3000,function(){
    console.log("Server is running on port 3000");
});

// API KEY 4b8b929ce964a6888d8767ebe36d6805-us17
// audience id - 61deb00862
// https://usx.api.mailchimp.com/3.0/lists