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

// 게시글 전체 조회
app.get('/customers', async(req,res)=>{
    connection.query(
        "SELECT * FROM customers",
        (err, rows, fields) => {    // 콜백함수!(에러, 결과, 컬럼)
            res.send(rows);
        }
    )
})
// 해당 c_no의 게시글 조회
app.get('/customers/:id', async(req,res)=>{
    const param = req.params;
    connection.query(
        `SELECT * FROM customers where c_no = ${param.id}`,
        (err, rows, fields) => {    // 콜백함수!(에러, 결과, 컬럼)
            res.send(rows);
        }
    )
})
// 테이블에 post 전송 받은 항목을 insert
// app.post(경로, 함수)
app.post('/addCustomer', async(req,res)=>{
    const { c_name, c_phone, c_birthday, c_gender, c_addr } = req.body    // post로 전송하는 값들은 요청(req) 측의 body에 있다.
    // insert into 테이블 이름(컬럼 이름1, 컬럼 이름2, 컬럼 이름 3, ...) values (값1, 값2, 값3, ...)
    // 두 번째 파라미터로 받는 배열의 값들이 values(?,?,?,?,?)에 순서대로 대입된다.
    connection.query('insert into customers(c_name, c_phone, c_birthday, c_gender, c_addr) values(?,?,?,?,?);', [c_name, c_phone, c_birthday, c_gender, c_addr], function(err, result, fields){
        console.log(result);
    })
    res.send('등록되었습니다.')
})

// 삭제
// delete from 테이블이름 where 컬럼명 = 값
app.delete('/customers/:id', async(req,res)=>{
    const param = req.params;
    connection.query(`delete from customers where c_no = ${param.id}`,(err, rows, fields)=>{
        res.send(rows);
    })
})

// 수정
// update 테이블이름 set (컬럼명1, 컬럼명2, 컬럼명3) = ('값1', '값2', '값3') where 컬럼명 = 값
app.post('/customers/:id/update', async(req,res)=>{
    const { c_name, c_phone, c_birthday, c_gender, c_addr } = req.body
    const param = req.params;
    connection.query(`update customers set (c_name, c_phone, c_birthday, c_gender, c_addr) = (?,?,?,?,?)`,[c_name, c_phone, c_birthday, c_gender, c_addr],function(err,result,fields){
        console.log(result);
    })
    res.send('수정되었습니다.')
})

// 세팅한 app을 실행
app.listen(port, ()=>{
    console.log('고객서버가 실행중입니다.')
})