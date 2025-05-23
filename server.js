require('dotenv').config();
const express=require('express');
const jwt=require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const mongoose=require('mongoose');
const { type } = require('os');
const path=require('path');
const app=express();
const port=process.env.PORT;
app.use(express.json());

mongoose.connect(process.env.LOCAL_URI).then(()=>
{
    console.log("CONNECTED TO DB TRAINING");
}).catch((err)=>
{
    if(err)
    {
        console.log("FAILED TO CONNECT TO THE DB \n",err);
    }
});

const register_schema=new mongoose.Schema({
        USERNAME:{
            type:String,
            required:true,
        },
        EMAIL:{
            type:String,
            required:true,
        }
});

const register_model=mongoose.model("USERDATA",register_schema);
app.get('/LOGIN',(req,res)=>
{
    res.sendFile(path.join(__dirname,"login.html"))
})
app.post('/REGISTER',(req,res)=>
{
    const user_data=req.body;
    register_model.create(user_data).
    then((inserted_data)=>
    {
        console.log(inserted_data);
        res.end("SUCCESFULYY REGISTERD");
    }).
    catch((err)=>
    {
        if(err)
        {
            console.log(err);
            res.end("ERROR OCCURED WHILE REGISTERING VERIFY CONSOLE")
        }
    });

});

app.post('/LOGIN',(req,res)=>
{
    const registered_data=req.body;
    register_model.findOne({USERNAME:registered_data.USERNAME,EMAIL:registered_data.EMAIL}).
    then((founded_data)=>
    {
        console.log(`DATA FOUND ${founded_data._id}`);
        data_token={id:founded_data._id};
        const token=jwt.sign(data_token,process.env.SECRET,{expiresIn:"60s"})
        res.json(token);
    }).
    catch((err)=>
    {
        console.log(err);
        res.end("ERROR");
    })
})

app.get('/TODO',(req,res)=>
{
    const token=req.body;
    jwt.verify(token.ENCODED,process.env.SECRET,(err,decoded)=>
    {
        if(err)
        {
            res.end('PLS LOGIN AGAIN');
        }
        else
        {
            res.end("YOU ARE STILL LOGGED IN");
        }
    })
})


app.listen(port,()=>
{
    console.log(`http://localhost:${port}/LOGIN`);
});