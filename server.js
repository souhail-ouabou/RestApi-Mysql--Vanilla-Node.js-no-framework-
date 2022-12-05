const http = require('http')
const fs = require('fs')
const mysql = require('mysql')

const con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '',
    database: 'sakila'
})


const server = http.createServer((req,res)=>{
    

    //res.statusCode = 200;
    //res.statusMessage = 'OK';
   // res.setHeader("Content-Type", "application/json");
    //res.write();
    //res.end(res);
    if(req.url === '/api' && req.method=== 'POST'){
       // res.writeHead(200,{'Content-Type':'application/json'})
        req.on("data", (chunk) => {
            // append the string version to the body
            body += chunk.toString();
        });
        // listen till the end
        req.on("end", () => {
            // send back the data
           console.log(body);
           console.log(JSON.parse(body));
        });
        //res.write("All Good!")
        /* INSERT */
        let body = "";
        con.connect((err)=>{
              if(err){
                  throw err
              }
              console.log("DB Connected");
              if(body !== ''){
                  const data = JSON.parse(body)
                      let sql = "INSERT INTO city SET ?"
                       con.query(sql,data,(err,result)=>{
                           if(err){
                             console.log(err)
                             res.end()
                           }
                           else{
                             res.write(JSON.stringify(result))
                               res.end()
                           }
                         //  console.log(data)
                          // console.log(res)
                       })
                 }
          })        
        
    }
    else{
        res.writeHead(404,{'Content-Type':'application/json'})
        res.end(JSON.stringify({message :'Route Not Found'}))
    }
}) 

server.listen(9000, "localhost", () => {
    console.log("Serveur lancé !!! on 9000");
})
