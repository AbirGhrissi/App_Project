const express =require('express');
const mysql=require('mysql');
const cors = require("cors");
const bcrypt = require('bcrypt');
const bodyParser=require("body-parser");
const cookieparser=require("cookie-parser")
const session=require("express-session");
const saltRounds = 10;
const multer = require('multer');



const upload = multer({ dest: 'uploads/' });

const PORT=process.env.PORT || 3001;

const app=express();


app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));
app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    key:"userId",
    secret:"atanu",
    resave:false,
    saveUninitialized:false,
    // cookie:{
    //     expires:60*60*60*24,
    // }
}))

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'etudiants'
})





app.get("/",(req,res)=>{
    res.send("hi");
})

app.post("/register",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    bcrypt.hash(password,saltRounds,(errr,hash)=>{
        const data={
       
            email:req.body.email,
            password:hash, 
            nom:req.body.nom,
            prenom:req.body.prenom,
            carte_etu:req.body.carte_etu,
            classe:req.body.classe    
       
       };
       if(errr)
       {
        console.log(err);
       }
       else{
        let sqll=`select * from etudiants where email='${email}'`;
        db.query(sqll,(er,ress)=>{
            if(ress.length > 0)
            {
                res.send({msg:"User Email Already Present"})

            }
            else{
                let sql="INSERT INTO `etudiants` SET ?";
                db.query(sql,data,(err,result)=>{
                    if(err)
                    {
                        console.log(err)
                    }
                    else{
                        //  console.log(result);
                         res.send(result);
                        // res.send()
            
                    }
                })
            }
        })

       

       }
      

    })
   
    
     
})
app.post("/registerAdmin",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    bcrypt.hash(password,saltRounds,(errr,hash)=>{
        const data={
       
            email:req.body.email,
            password:hash, 
           
       };
       if(errr)
       {
        console.log(err);
       }
       else{
        let sqll=`select * from admin where email='${email}'`;
        db.query(sqll,(er,ress)=>{
            if(ress.length > 0)
            {
                res.send({msg:"User Email Already Present"})

            }
            else{
                let sql="INSERT INTO `admin` SET ?";
                db.query(sql,data,(err,result)=>{
                    if(err)
                    {
                        console.log(err)
                    }
                    else{
                        //  console.log(result);
                         res.send(result);
                        // res.send()
            
                    }
                })
            }
        })

       

       }
      

    })
   
    
     
})

app.post("/login",(req,res)=>{
   const email=req.body.email;
    const password=req.body.password;

    // console.log(email);
        
      
        let sql=`select * from etudiants where email='${email}'`;
        // console.log(sql);
        db.query(sql,(err,result)=>{
            if(err)
            {
                // res.send({err:err})
                console.log(err);
            }
            else{
              
               if(result.length > 0)
               {
                bcrypt.compare(password,result[0].password,(errr,response)=>{
                    if(response)
                    {
                        req.session.user=result;
                        // console.log(req.session.user);
                     
                     res.send({login:true,useremail:email});
                    }
                    else{
                     res.send({login:false,msg:"Wrong Password"});
                    
                    }
                })

                

               }
               else{
                    res.send({login:false,msg:"User Email Not Exits"});
                // console.log("noo email ")
               }
                
    
            }
        })

      
    
     
})
app.post("/loginAdmin",(req,res)=>{
    const email=req.body.email;
     const password=req.body.password;
 
     // console.log(email);
         
       
         let sql=`select * from admin where email='${email}'`;
         // console.log(sql);
         db.query(sql,(err,result)=>{
             if(err)
             {
                 // res.send({err:err})
                 console.log(err);
             }
             else{
               
                if(result.length > 0)
                {
                 bcrypt.compare(password,result[0].password,(errr,response)=>{
                     if(response)
                     {
                         req.session.user=result;
                         // console.log(req.session.user);
                      
                      res.send({login:true,useremail:email});
                     }
                     else{
                      res.send({login:false,msg:"Wrong Password"});
                     
                     }
                 })
 
                 
 
                }
                else{
                     res.send({login:false,msg:"User Email Not Exits"});
                 // console.log("noo email ")
                }
                 
     
             }
         })
 
       
     
      
 })


       
     
      

 app.get("/login",(req,res)=>{
    if(req.session.user)
    {
        res.send({login:true,user:req.session.user});
    }
    else{
        res.send({login:false});
    }
})

app.get("/loginAdmin",(req,res)=>{
    if(req.session.user)
    {
        res.send({login:true,user:req.session.user});
    }
    else{
        res.send({login:false});
    }
})





app.post('/upload', upload.single('image'), (req, res) => {
    
    const imageFile = req.file;
  
   
    const { originalname, filename, path } = imageFile;
    const imageUrl = `http://yourdomain.com/uploads/${filename}`;
  
    const insertQuery = 'INSERT INTO images (original_name, file_name, url) VALUES (?, ?, ?)';
    db.query(insertQuery, [originalname, filename, imageUrl], (err, result) => {
      if (err) {
        console.error('Error saving image metadata to database:', err);
        res.status(500).send('Error saving image metadata to database');
      } else {
        console.log('Image metadata saved to database');
        res.status(200).send('Image uploaded successfully');
      }
    });
  });
app.listen(PORT,()=>{
    console.log(`app running in ${PORT}` )
})