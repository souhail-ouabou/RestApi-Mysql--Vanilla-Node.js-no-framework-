const http = require('http')
const fs = require('fs')
const con = require('./connection');
var url = require('url');
const server = http.createServer((req, res) => {
       /*-----------------GET ------------------ */ 
    let body = "";
    if (req.url != '/api' && req.method === 'GET') {
        var q = url.parse(req.url);
        var countryName = decodeURIComponent(q.pathname.substring(5));
        console.log("country :" + countryName)
    let sql = `SELECT city FROM city,country where city.country_id = country.country_id and country.country="${countryName}"`
    console.log("GET BEGIN..!");
    con.query(sql,(err, result) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(err))
        }
        else {
            // res.write("INSERTED")
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(result))
        }
    })
    }
    /*-----------------POST ------------------ */ 
    else if (req.url !== '/api' && req.method === 'POST') {
        req.on("data", (chunk) => {
            // append the string version to the body
            body += chunk.toString(); // convert Buffer to string
        });
        // listen till the end
        req.on("end", () => {
            // send back the data
            if (body !== '') {      
                let countryId;
                var q = url.parse(req.url);
                var countryName = decodeURIComponent(q.pathname.substring(5));
                console.log("country :" + countryName)
                let sqlGet = `SELECT country_id FROM country WHERE country.country="${countryName}"`
                  /* GET COUNTRYID */
                  console.log("GET CountryId BEGIN..!");
                  con.query(sqlGet, (err, result) => {
                      if (err) {
                          res.writeHead(404, { 'Content-Type': 'application/json' })
                          res.end(JSON.stringify(err))
                      }
                      else {
                          //res.writeHead(200, { 'Content-Type': 'application/json' })
                          countryId = result[0].country_id;
                          console.log("countryId",countryId);
                         // res.end(JSON.stringify(result))
                         console.log(body);
                         console.log(JSON.parse(body));
                        console.log("countryId",countryId);
                        let data = JSON.parse(body)
                        let sql = `INSERT INTO city SET city="${data.city}", country_id=${countryId}`
                  /* INSERT */
                console.log("INSERT BEGIN..!");
                con.query(sql, data, (err, result) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify(err))
                    }
                    else {
                        // res.write("INSERTED")
                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify(result))
                    }
                })
            }
        })
            }
            else {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Body Not Found !' }))
            }
        });
        //res.write("All Good!")
    }
     /*-----------------PUT ------------------ */ 
   else if(req.url != '/api' && req.method === 'PUT'){
        req.on("data", (chunk) => {
            // append the string version to the body
            body += chunk.toString(); // convert Buffer to string
        });
        // listen till the end
        req.on("end", () => {
            // send back the data
            if (body !== '') {
                var q = url.parse(req.url);
                var ciytId = decodeURIComponent(q.pathname.substring(5));
                console.log(ciytId)
                /* UPDATE BY CITY ID */
                    console.log("UPDATE BEGIN ... !");
                    const data = JSON.parse(body)
                    let sql = `UPDATE city SET city="${data.city}" ,country_id=${data.country_id} where city_id = ${ciytId}`
                    con.query(sql, data, (err, result) => {
                        if (err) {
                            res.writeHead(404, { 'Content-Type': 'application/json' })
                            res.end(JSON.stringify(err))
                        }
                        else {
                            // res.write("INSERTED")
                            res.writeHead(200, { 'Content-Type': 'application/json' })
                            res.end(JSON.stringify(result))
                        }
                    })
            }
            else {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Body Not Found !' }))
            }
        });

    } 
     /*-----------------DELETE ------------------ */ 
   else if(req.url != '/api' && req.method === 'DELETE'){
        req.on("data", (chunk) => {
            // append the string version to the body
            body += chunk.toString(); // convert Buffer to string
        });
        // listen till the end
        req.on("end", () => {
            // send back the data
                var q = url.parse(req.url);
                var ciytId = decodeURIComponent(q.pathname.substring(5));
                console.log(ciytId)
                /* DELETE BY CITY ID */
                    console.log("DELETE BEGIN ... !");
                    let sql = `DELETE FROM city WHERE city_id = ${ciytId}`
                    con.query(sql, (err, result) => {
                        if (err) {
                            res.writeHead(404, { 'Content-Type': 'application/json' })
                            res.end(JSON.stringify(err))
                        }
                        else {
                            // res.write("INSERTED")
                            res.writeHead(200, { 'Content-Type': 'application/json' })
                            res.end(JSON.stringify(result))
                        }
                    })
        });

    } 
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Route Not Found' }))
    }
})

server.listen(9000, "localhost", () => {
    console.log("Serveur lancé !!! on 9000");
    con.connect((err) => {
        if (err) {
            throw err
        }
        console.log("DB Connected !");
    })
})
