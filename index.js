// commonJS에서는 import 구문 대신 require 사용
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const fs = require('fs');
const dataj = fs.readFileSync("./database.json");
const parseData = JSON.parse(dataj);    // 받아온 json파일을 객체 형태로
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: parseData.host,
    user: parseData.user,
    password: parseData.password,
    port: parseData.port,
    database: parseData.database
})

app.use(express.json()) // json 형식의 데이터를 처리할 수 있도록 설정해줌.
app.use(cors()) // 다양한 브라우저에 대응하기 위해 설정

app.get('/customers', async(req,res)=>{
    connection.query(
        "SELECT * FROM customers",
        (err, rows, fields) => {    // 콜백함수!
            res.send(rows);
        }
    )
})
app.post('/createcustomer', async(req,res)=>{
    res.send('등록되었습니다.')
})

// 세팅한 app을 실행
app.listen(port, ()=>{
    console.log('고객서버가 실행중입니다.')
})