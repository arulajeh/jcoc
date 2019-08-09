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
    const pass1 = Md5.hashStr(a.password);
    // let pass = Md5.hashStr(a.password + a.email);
    const pass2 = Md5.hashStr(pass1 + a.username);
    db.users.findOne({where:{username: a.username, password: pass2}})
    .then((hasil2) => {
      if (hasil2) {
        let hasil = hasil2.get({plain: true});
        delete hasil.password;
        hasil.time = new Date();
        let token = jwt.sign(hasil, jwtSecret, {algorithm: "HS256"});
        res.json({
          sukses: true,
          token: token,
          data: {
            id: hasil.id,
            username: hasil.username,
            full_name: hasil.name,
            position: hasil.position,
            email: hasil.email,
            akses: hasil.akses_id,
            image: hasil.image
          }
        });
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

// Get List Users
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
    db.sequelize.query(`SELECT username, "name", email, image, akses_id, gender_id, position_id, position_name FROM users INNER JOIN position ON position_id = "position"."id" WHERE email LIKE '%${search}%' AND username LIKE '%${search}%' AND "name" LIKE '%${search}%' AND email LIKE '%${search}%' ORDER BY users.${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT(users."id") FROM users INNER JOIN position ON position_id = "position"."id" WHERE email LIKE '%${search}%' AND username LIKE '%${search}%' AND "name" LIKE '%${search}%' AND email LIKE '%${search}%'`,
      { type: db.sequelize.QueryTypes.SELECT})
      .then((row) => {
        let totalPage = Math.ceil(parseInt(row[0].count) / parseInt(pageSize));
        res.json({
          sukses: true,
          data: resultDB,
          page_information: {
            currentPage: parseInt(pageNumber),
            pageSize: parseInt(pageSize),
            totalPage: totalPage > 0 ? totalPage : 1,
            firstPage: 1,
            totalData: parseInt(row[0].count)
          }
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
      const pass2 = Md5.hashStr(pass1 + args.username);
      db.users.findOrCreate({where: {username: args.username}, defaults: {
        name: args.name,
        email: args.email,
        username: args.username,
        password: pass2,
        position_id: args.position_id,
        gender_id: args.gender_id,
        image: args.image,
        status: 1,
        akses_id: args.akses_id ? args.akses_id : 2,
        created_by: hasilJWT.data.id,
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
          msg: JSON.stringify(err)
        })
      })
    } else {
      res.json({
        data: "Unauthorized user"
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
  if (args.name && args.email && args.position_id && args.gender_id && args.image) {
    db.sequelize.query(`SELECT "password" FROM users WHERE "id" = ${req.params.id}`, {type: db.sequelize.QueryTypes.SELECT})
    .then((pass) => {
      let pass1;
      let pass2;
      if (args.password.length > 0) {
        pass1 = Md5.hashStr(args.password);
        pass2 = Md5.hashStr(pass1 + args.username);
      } 
      db.sequelize.query(`UPDATE users SET "name" = '${args.name}', "password" = '${pass2 || args.password}', "position_id" = ${args.position_id}, gender_id = ${args.gender_id}, image = '${args.image}' WHERE "id" = ${req.params.id}`,
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
          msg: JSON.stringify(err)
        })
      })
    })  
  } else {
    res.json({
      sukses: false,
      msg: 'Data tidak lengkap'
    })
  }
})

// Get Music List
app.get('/api/music', (req, res) => {
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
    db.sequelize.query(`SELECT * FROM music WHERE user_id = ${hasilJWT.data.id} AND judul LIKE '%${search}%' AND penyanyi LIKE '%${search}%' AND link LIKE '%${search}%' ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT("id") FROM music WHERE user_id = ${hasilJWT.data.id} AND judul LIKE '%${search}%' AND penyanyi LIKE '%${search}%' AND link LIKE '%${search}%'`,
      { type: db.sequelize.QueryTypes.SELECT})
      .then((row) => {
        let totalPage = Math.ceil(parseInt(row[0].count) / parseInt(pageSize));
        res.json({
          sukses: true,
          data: resultDB,
          page_information: {
            currentPage: parseInt(pageNumber),
            pageSize: parseInt(pageSize),
            totalPage: totalPage > 0 ? totalPage : 1,
            firstPage: 1,
            totalData: parseInt(row[0].count)
          }
        })
      });
    });  
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
})

app.get('/api/test_schedule', (req, res) => {
  db.sequelize.query(`SELECT * from v_schedule`, {type: db.sequelize.QueryTypes.SELECT})
  .then((result) => {
    res.json({
      data: result
    });
  });
})

// Add New Music
app.post('/api/music/create', (req, res) => {
  let args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    if (hasilJWT.data.akses_id === 1) {
      db.music.create({
        judul: args.judul,
        penyanyi: args.penyanyi,
        lirik: args.lirik,
        chord: args.chord,
        link: args.link,
        user_id: hasilJWT.data.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }).then((created) => {
        if (created) {
          res.json({
            sukses: true,
            data: created
          })
        } else {
          res.json({
            sukses: false,
            data: created
          })
        }
      }).catch(err => {
        console.log(err);
        res.json({
          sukses: false,
          msg: JSON.stringify(err)
        })
      })
    } else {
      res.json({
        data: "Unauthorized user"
      });
    }
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
})

// Get Schedule List
app.get('/api/schedule', (req, res) => {
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
    db.sequelize.query(`SELECT * FROM v_schedule WHERE user_id = ${hasilJWT.data.id} AND judul LIKE '%${search}%' AND penyanyi LIKE '%${search}%' AND link LIKE '%${search}%' ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT("id") FROM music WHERE user_id = ${hasilJWT.data.id} AND judul LIKE '%${search}%' AND penyanyi LIKE '%${search}%' AND link LIKE '%${search}%'`,
      { type: db.sequelize.QueryTypes.SELECT})
      .then((row) => {
        let totalPage = Math.ceil(parseInt(row[0].count) / parseInt(pageSize));
        res.json({
          sukses: true,
          data: resultDB,
          page_information: {
            currentPage: parseInt(pageNumber),
            pageSize: parseInt(pageSize),
            totalPage: totalPage > 0 ? totalPage : 1,
            firstPage: 1,
            totalData: parseInt(row[0].count)
          }
        })
      });
    });  
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
})

// Get Master Positions
app.get('/api/position', (req, res) => {
  const head = req.headers;
  let token = head.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    db.sequelize.query(`SELECT "id", position_name FROM "position"`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      res.json({
        sukses: true,
        data: result
      })
    }); 
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
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
