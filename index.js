//express

const express = require("express");
const app = express();

//date
const {getFormatTime} = require("./date/date")
const {getDistanceTime} = require("./date/date")

 const upload = require("./middlewares/fileUpload")
//database
const db = require("./connection/db");
const { Connection, Client } = require("pg");
const { query, request, response } = require("express");
const { array } = require("./middlewares/fileUpload");
const e = require("express");

//port
const port = 8000;



// set view engine
app.set("view engine", "hbs");

//directory(save data static)
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.urlencoded({ extended: false }));

//conditionall
let isLogin = true;







//connect DataBase
db.connect((err, client, done) => {
  if (err) throw err; //error ceonection

  // app.get("/register", (request, response) => {
  //   response.render("register");
  // });
  
  // app.get("/login", (request, response) => {
  //   response.render("login");
  // });


  //home_page
  app.get("/",upload.single('inputImage'), (request, response) => {

    let query = "SELECT * FROM tb_project";
    client.query(query, (err, X) => {
      if (err) throw err; 

      let responseDB = X.rows;
      console.log(responseDB)
      console.log('pass')
      response.render("index", { isLogin, reload: responseDB });
    });
  });
  //contact_page
  app.get("/contact", (request, response) => {
    response.render("contact");
  });
  
  //blog_page
  app.get("/blog/:id", upload.single('inputImage'),  (request, response) => {
    //take params
    let id =  request.params.id;
    //take data from DB
   client.query(`SELECT * FROM tb_project where id=${id}`,(err, x) => {
        if (err) throw err;
        let responseDB = x.rows[0];
        console.log(responseDB);
        response.render("blog", responseDB);
      });
  });



  // _________fitur

   //________input
  app.get("/project", (request, response) => {
    response.render("project");
  });

  app.post("/project", upload.single('inputImage'), (request, response) => {
    const data = request.body;
    const image =request.file.filename;

    function tecno () {
      tes = []

      data.js?tes.push(data.js):"null",
      data.php?tes.push(data.php):"null",
      data.java?tes.push(data.java):"null",
      data.react?tes.push(data.react):"null"

      return tes ;
    }

    const query = `INSERT INTO tb_project(title,description,start_date,end_date,image,technologies)
    
    VALUES ($1,$2,$3,$4,$5,$6)`;
    
    client.query(query,[data.inputTitle,data.inputDescription,data.inputStartDate,data.inputEndDate,image,tecno()],(err, x) => {
      if (err) throw err;
      response.redirect("/");
    })
  });


  //____________edit
  app.get("/edit-blog/:id",(request, response) => {

    let id =  request.params.id;
    //take data from DB
   client.query(`SELECT * FROM tb_project where id=${id}`,(err, x) => {
        if (err) throw err;
        let responseDB = x.rows[0];
    response.render("edit-blog",responseDB);
   })
  });
  
  app.post("/edit-blog/:id",upload.single('inputImage') , (request, response) => {
    let id =request.params.id
    let data=request.body;
    const image =request.file.filename;

    function tecno () {
      tes = []

      data.js?tes.push(data.js):"null",
      data.php?tes.push(data.php):"null",
      data.java?tes.push(data.java):"null",
      data.react?tes.push(data.react):"null"

      return tes ;
    }
    
    const query = `UPDATE public.tb_project
    SET title=$1, description=$2, start_date=$3, end_date=$4, image=$5, technologies=$6
    WHERE id=${id}`

    client.query(query ,[data.inputTitle,data.inputDescription,data.inputStartDate,data.inputEndDate,image,tecno()],(err, x)=>{
      let responseDB = x;
      console.log('check nih')
      console.log(responseDB);
      response.redirect("/");
    })

  });

  // delete data
  app.get("/delete-blog/:id", (request, response) => {
    const id = request.params.id;

    client.query(`DELETE FROM tb_project WHERE id=${id};`,(err, result) =>{
      if(err) throw err;
      response.redirect("/");
    })
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



