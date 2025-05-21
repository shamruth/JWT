/* install npm jsonwebtoken for creating a jwt*/
require("dotenv").config();
const jwt = require('jsonwebtoken');
const path=require("path");
const express=require('express');
const app = express();
const secretKey = process.env.secret;
const reg=[];
const myusers={
    USERNAME:"SHAMRUTH",
    PASSWORD:"PASSWORD"
}
app.use(express.json());
app.get("/",(req,res)=>
{

    res.sendFile(path.join(__dirname,"index.html"))
})
app.post("/AUTHENT",(req,res)=>
{
    const data=req.body;
    reg.push(data);
    console.log(reg);
    console.log(data);
    const token = jwt.sign({data}, secretKey, { expiresIn: '45s' });
    console.log(token);
    res.json(token);
})

app.post("/LOGIN",(req,res)=>
{
    const KEY =req.body;
    const token=KEY.TOKEN;

    jwt.verify(token, secretKey, (err, decoded) => 
        {
            if (err) 
            {
                console.log('Token is invalid');
                res.end("INVALID_TOKEN")
            }
            else 
            {
                console.log('Decoded Token:', decoded);
                res.end("SUCCESSFULLY LOGINED ")
            }
        });
})

app.listen(1515,()=>
{
    console.log("http://localhost:1515")
});