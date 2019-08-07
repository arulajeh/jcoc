var express  = require('express');
var app      = express();                               
var morgan = require('morgan');            
var bodyParser = require('body-parser');    
var cors = require('cors');
/*
import db from "./models";
import http from 'http';
import {Md5} from 'ts-md5/dist/md5';
*/
var db = require('./models');
var md = require('ts-md5/dist/md5');
var Md5 = md.Md5;
var jwt = require('jsonwebtoken');

const jwtSecret = "ArgyiuehgHjhbehrg7853hgjngdyu4jkn7";
const hash_md5 = "JunAjaYa";
 
app.use(morgan('dev'));                                        
app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(cors());
 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, POST, GET');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Token");
  next();
});

var checkJWT = (args => {
  return jwt.verify(args, jwtSecret, function(err, decoded) {
    console.log('Verify token');
    if (err){
      console.log(err);
      throw new Error('Invalid Token');
    }else{
      return {
        data: decoded
      };
    }
  });
});

app.post('/api/login', (req, res)=>{
  let a = req.body;
  console.log(a);
  if (a.username && a.password) {
    let pass = Md5.hashStr(a.password + a.username);
    console.log(pass);
    db.users.findOne({where:{username: a.username, password: a.password}})
    .then((hasil2) => {
      if (hasil2) {
        let hasil = hasil2.get({plain: true});
        delete hasil.password;
        let token = jwt.sign(hasil, jwtSecret, {algorithm: "HS256"});
        res.json({
          sukses: true,
          token: token,
          data: {
            username: hasil.username,
            full_name: hasil.name,
            position: hasil.position,
            email: hasil.email,
            akses: hasil.akses_id
          }
        });
      //   let hasil = hasil2.get({plain: true});
      //   delete hasil.password;
      //   db.sequelize.query(`SELECT * FROM view_user_roles where user_id=${hasil.id}`, 
      //     { type: db.sequelize.QueryTypes.SELECT})
      //   .then(view_user_roles =>{
      //     let roles = view_user_roles[0].roles_name;
      //     let hasura = {
      //       "X-Hasura-User-Id": hasil.id.toString(),
      //       "X-Hasura-Entity-Id": hasil.entity_id.toString(),
      //       "x-hasura-default-role": "user",
      //       "x-hasura-allowed-roles": roles
      //     }
      //     let token = jwt.sign({
      //       hasura: hasura
      //     }, jwtSecret, { algorithm: 'HS256'});
      //     db.sequelize.query(`SELECT * FROM alur_reimburse where user_id=${hasil.id} and entity_id=${hasil.entity_id}`, 
      //     { type: db.sequelize.QueryTypes.SELECT})
      //     // db.alur_reimburse.findOne({where: {entity_id: hasil.entity_id, user_id: hasil.id}})
      //     .then((hasil_alur2) => {
      //       let hasil_alur = hasil_alur2[0]//.get({plain: true});
      //       console.log(hasil_alur);
      //       if (hasil_alur && hasil_alur.step) {
      //         console.log(view_user_roles);
      //         hasura['X-Hasura-Max-Step-Reimburse'] = hasil_alur.step.toString();
      //         token = jwt.sign({
      //           hasura: hasura
      //         }, jwtSecret, { algorithm: 'HS256'});
      //         res.json({
      //           sukses: true,
      //           token: token,
      //           hasura: hasura,
      //           roles: roles,
      //           entity_id: hasil.entity_id,
      //           max_reimburse_step: hasil_alur.step,
      //           msg: "Sukses Login"
      //         })
      //       } else {
      //         console.log(view_user_roles);
      //         hasura['X-Hasura-Max-Step-Reimburse'] = '3';
      //         token = jwt.sign({
      //           hasura: hasura
      //         }, jwtSecret, { algorithm: 'HS256'});
      //         res.json({
      //           sukses: true,
      //           token: token,
      //           hasura: hasura,
      //           roles: roles,
      //           entity_id: hasil.entity_id,
      //           max_reimburse_step: 3,
      //           msg: "Sukses Login"
      //         })
      //       }
      //     }).catch(err => {
      //       console.log('Error');
      //       console.log(err);
      //       let roles = view_user_roles[0].roles_name;
      //       let hasura = {
      //         "X-Hasura-User-Id": hasil.id.toString(),
      //         "X-Hasura-Entity-Id": hasil.entity_id.toString(),
      //         "x-hasura-default-role": "user",
      //         "x-hasura-allowed-roles": roles,
      //         "X-Hasura-Max-Step-Reimburse": '3'
      //       }
      //       let token = jwt.sign({
      //         hasura: hasura
      //       }, jwtSecret, { algorithm: 'HS256'});
      //       res.json({
      //         sukses: true,
      //         token: token,
      //         hasura: hasura,
      //         roles: roles,
      //         entity_id: hasil.entity_id,
      //         max_reimburse_step: 3,
      //         msg: "Sukses Login"
      //       })
      //     });
      //   }).catch(err => {
      //     let roles = ["user"];
      //     let hasura = {
      //       "X-Hasura-User-Id": hasil.id.toString(),
      //       "x-hasura-default-role": "user",
      //       "x-hasura-allowed-roles": roles,
      //       "X-Hasura-Max-Step-Reimburse": '3'
      //     }
      //     let token = jwt.sign({
      //       hasura: hasura
      //     }, jwtSecret, { algorithm: 'HS256'});
      //     res.json({
      //       sukses: true,
      //       token: token,
      //       hasura: hasura,
      //       roles: roles,
      //       entity_id: hasil.entity_id,
      //       max_reimburse_step: 3,
      //       msg: "Sukses Login"
      //     })
      //   });
      }else{
        res.json({
          sukses: false,
          msg: "Invalid Username or Password"
        })
      }
    })
  }else{
    res.json({
      sukses: false,
      msg: "Input your username and password"
    })
  }
})

app.get('/api/users', (req, res) => {
  const head = req.headers;
  let token = head.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    let pageNumber = head.page_number ? head.page_number : 1;
    let pageSize = head.page_size ? head.page_size : 5;
    let sortBy = head.sort_by ? head.sort_by : 'ASC';
    let orderBy = head.order_by ? head.order_by : 'id';
    let search = head.search ? head.search : '';
    let offset = (pageNumber - 1) * pageSize;
    db.sequelize.query(`SELECT username, "name", email, image, akses_id, gender_id, position_id FROM users WHERE email LIKE '%${search}%' AND username LIKE '%${search}%' AND "name" LIKE '%${search}%' AND email LIKE '%${search}%' ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT("id") FROM users WHERE email LIKE '%${search}%' AND username LIKE '%${search}%' AND "name" LIKE '%${search}%' AND email LIKE '%${search}%'`,
      { type: db.sequelize.QueryTypes.SELECT})
      .then((row) => {
        let totalPage = parseInt(parseInt(row[0].count) / parseInt(pageSize));
        res.json({
          data: resultDB,
          page_information: {
            currentPage: parseInt(pageNumber),
            pageSize: parseInt(pageSize),
            totalPage: totalPage,
            firstPage: 1,
            totalData: parseInt(row[0].count)
          },
          userDetail: hasilJWT.data
        })
      });
    });  
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
  console.log(head);
})
app.post('/api/users/create', (req, res) => {
  let args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    if (hasilJWT.data.akses_id === 1) {
      const pass1 = Md5.hashStr(args.password);
    // let pass = Md5.hashStr(a.password + a.email);
      const pass2 = Md5.hashStr(pass1 + args.email);
      db.users.findOrCreate({where: {username: args.username}, defaults: {
        name: args.name,
        email: args.email,
        username: args.username,
        password: pass2,
        position_id: args.position,
        gender_id: args.gender,
        image: args.image,
        status: 1,
        akses_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }})
      .then(([result, created]) => {
        if (created){
          res.json({
            sukses: true,
            msg: "sukses",
            user: result
          })
        }else{
          res.json({
            sukses: false,
            msg: "User Sudah Ada",
            user: result
          })
        }
      }).catch(err => {
        console.log(err);
        res.json({
          sukses: false,
          msg: JSON.stringify(err),
          user: null
        })
      })
    } else {
      res.json({
        data: "kamu bukan admin"
      });
    }
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
})

app.post('/api/users/update/:id', (req,res) => {
  const args = req.body;
  db.sequelize.query(`UPDATE users SET "name" = '${args.name}', "password" = '${args.password}', "position_id" = ${args.position_id}, gender_id = ${args.gender_id}, image = '${args.image}' WHERE "id" = ${req.params.id}`,
    {type: db.sequelize.QueryTypes.UPDATE})
    .then((result) => {
      res.json({
        sukses: true,
        msg: 'Update Successfully',
        data: result
      })
    })
    .catch((err) => {
      res.json({
        sukses: false,
        msg: err
      })
    })
  // const updateData = {
  //   name: args.name,
  //   username: args.username,
  //   password: args.password || 'a',
  //   position_id: args.position_id,
  //   gender_id: args.gender_id,
  //   image: args.image
  // };
  // db.users.findOneAndUpdate({id = req.params.id}, 
  //   {$set: updateData},{new: true}, function(err, result) {
  //   if (err) {
  //     res.json({
  //       sukses: false,
  //       msg: "Failed update"
  //     })
  //   } else {
  //     res.json({
  //       sukses: true,
  //       msg: "Update user Successfully"
  //     })
  //   }
  // })
})

const request = require('request');

app.use(express.static('www'));
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/www/index.html');
})
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
