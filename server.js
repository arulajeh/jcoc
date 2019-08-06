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
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
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
        token: args,
        hasura: decoded.hasura
      };
    }
  });
});

app.post('/api/users/create', (req, res) => {
  let args = req.body;
  let token = req.headers.authorization;
  token = token.replace('Bearer ',''); 
  let hasilJWT = checkJWT(token);
  if (hasilJWT.hasura["x-hasura-allowed-roles"].indexOf('admin') > -1){
    const pass1 = Md5.hashStr(args.password);
    // let pass = Md5.hashStr(a.password + a.email);
    const pass2 = Md5.hashStr(pass1 + args.email);
    db.users.findOrCreate({where: {email: args.email}, defaults: {
      name: args.name,
      email: args.email,
      password: pass2,
      date_of_birth: args.date_of_birth,
      dayof: args.dayof,
      no_rek: args.no_rek,
      nip: args.nip,
      entity_id: args.entity_id,
      kepegawaian_id: args.kepegawaian_id,
      bank_id: args.bank_id,
      probation_date: args.probation_date,
      join_date: args.join_date,
      status: 1
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
  }else{
    res.json({
      sukses: false,
      msg: "Not Authorize",
      user: null
    })
  }
})

app.post('/api/login', (req, res)=>{
  let a = req.body;
  console.log(a);
  if (a.email && a.password) {
    let pass = Md5.hashStr(a.password + a.email);
    console.log(pass);
    db.users.findOne({where:{email: a.email, password: pass}})
    .then((hasil2) => {
      if (hasil2) {
        let hasil = hasil2.get({plain: true});
        delete hasil.password;
        db.sequelize.query(`SELECT * FROM view_user_roles where user_id=${hasil.id}`, 
          { type: db.sequelize.QueryTypes.SELECT})
        .then(view_user_roles =>{
          let roles = view_user_roles[0].roles_name;
          let hasura = {
            "X-Hasura-User-Id": hasil.id.toString(),
            "X-Hasura-Entity-Id": hasil.entity_id.toString(),
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": roles
          }
          let token = jwt.sign({
            hasura: hasura
          }, jwtSecret, { algorithm: 'HS256'});
          db.sequelize.query(`SELECT * FROM alur_reimburse where user_id=${hasil.id} and entity_id=${hasil.entity_id}`, 
          { type: db.sequelize.QueryTypes.SELECT})
          // db.alur_reimburse.findOne({where: {entity_id: hasil.entity_id, user_id: hasil.id}})
          .then((hasil_alur2) => {
            let hasil_alur = hasil_alur2[0]//.get({plain: true});
            console.log(hasil_alur);
            if (hasil_alur && hasil_alur.step) {
              console.log(view_user_roles);
              hasura['X-Hasura-Max-Step-Reimburse'] = hasil_alur.step.toString();
              token = jwt.sign({
                hasura: hasura
              }, jwtSecret, { algorithm: 'HS256'});
              res.json({
                sukses: true,
                token: token,
                hasura: hasura,
                roles: roles,
                entity_id: hasil.entity_id,
                max_reimburse_step: hasil_alur.step,
                msg: "Sukses Login"
              })
            } else {
              console.log(view_user_roles);
              hasura['X-Hasura-Max-Step-Reimburse'] = '3';
              token = jwt.sign({
                hasura: hasura
              }, jwtSecret, { algorithm: 'HS256'});
              res.json({
                sukses: true,
                token: token,
                hasura: hasura,
                roles: roles,
                entity_id: hasil.entity_id,
                max_reimburse_step: 3,
                msg: "Sukses Login"
              })
            }
          }).catch(err => {
            console.log('Error');
            console.log(err);
            let roles = view_user_roles[0].roles_name;
            let hasura = {
              "X-Hasura-User-Id": hasil.id.toString(),
              "X-Hasura-Entity-Id": hasil.entity_id.toString(),
              "x-hasura-default-role": "user",
              "x-hasura-allowed-roles": roles,
              "X-Hasura-Max-Step-Reimburse": '3'
            }
            let token = jwt.sign({
              hasura: hasura
            }, jwtSecret, { algorithm: 'HS256'});
            res.json({
              sukses: true,
              token: token,
              hasura: hasura,
              roles: roles,
              entity_id: hasil.entity_id,
              max_reimburse_step: 3,
              msg: "Sukses Login"
            })
          });
        }).catch(err => {
          let roles = ["user"];
          let hasura = {
            "X-Hasura-User-Id": hasil.id.toString(),
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": roles,
            "X-Hasura-Max-Step-Reimburse": '3'
          }
          let token = jwt.sign({
            hasura: hasura
          }, jwtSecret, { algorithm: 'HS256'});
          res.json({
            sukses: true,
            token: token,
            hasura: hasura,
            roles: roles,
            entity_id: hasil.entity_id,
            max_reimburse_step: 3,
            msg: "Sukses Login"
          })
        });
      }else{
        res.json({
          sukses: false,
          msg: "Failed Login"
        })
      }
    })
  }else{
    res.json({
      sukses: false,
      msg: "Failed Login"
    })
  }
})

const request = require('request');

app.post('/startgps/login', (req, res) => {
  const headers = req.headers;
  let url1 = 'https://devmobile.startgps.id/m.dev/login';
  console.log(req.body);
  request.post({
    url: url1,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    "rejectUnauthorized": false, 
    body: JSON.stringify(req.body)}, function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err);
      }
      console.log('Upload successful!');//  Server responded with:', JSON.stringify(body));
      console.log(httpResponse);
      console.log(body);
      res.send(body);
  })
});
app.get('/startgps/monitoring/position.geojson', (req, res) => {
  const headers = req.headers;
  let url1 = 'https://devmobile.startgps.id/m.dev/monitoring/position.geojson';
  request.get({
    url: url1,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Token': headers['x-token']
    },
    "rejectUnauthorized": false, 
    }, function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err);
      }
      console.log('Upload successful!');//  Server responded with:', JSON.stringify(body));
      res.send(body);
  })
});

app.get('/startgps/monitoring/route.geojson?*', (req, res) => {
  const headers = req.headers;
  console.log(headers);
  let fullUrl = req.originalUrl.replace('/startgps','');
  
  let url1 = 'https://devmobile.startgps.id/m.dev' + fullUrl;
  console.log(url1);
  request.get({
    url: url1,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Token': headers['x-token']
    },
    "rejectUnauthorized": false, 
    }, function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err);
      }
      console.log('Upload successful!');//  Server responded with:', JSON.stringify(body));
      res.send(body);
  })
});


app.use(express.static('www'));
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/www/index.html');
})
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
