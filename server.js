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
app.use(bodyParser.urlencoded({'extended':'true', 'limit': '50mb'}));
app.use(bodyParser.json({'limit': '50mb'}));            
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
        data: decoded
      };
    }
  });
});

var idUser = [];

app.post('/api/login', (req, res)=>{
  let a = req.body;
  console.log(a);
  if (a.username && a.password) {
    const pass1 = Md5.hashStr(a.password);
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
    db.sequelize.query(`SELECT akses_id, email, gender_id, id, name, position_id, position_name, username, phone, file_id FROM v_user WHERE v_user.created_by = ${hasilJWT.data.id} AND (email ILIKE '%${search}%' OR username ILIKE '%${search}%' OR "name" ILIKE '%${search}%') ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT(*) from v_user WHERE v_user.created_by = ${hasilJWT.data.id} AND (email ILIKE '%${search}%' OR username ILIKE '%${search}%' OR "name" ILIKE '%${search}%')`,
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

app.post('/api/image', (req, res) => {
  let args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    db.sequelize.query(`SELECT file, id FROM m_files WHERE id = ${args.id}`, { type: db.sequelize.QueryTypes.SELECT})
    .then((result) => {
      if (result) {
        const img = result[0];
        res.json({
          sukses: true,
          data: img
        });
      } else {
        res.json({
          sukses:  false,
          msg: 'Image not found'
        });
      }
    })
  } else {
    res.json({
      sukses: false,
      msg: 'Unauthorized User'
    });
  }
})

app.get('/api/users/all', (req, res) => {
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
    db.sequelize.query(`SELECT akses_id, email, gender_id, id, name, position_id, position_name, username, phone, file_id FROM v_user WHERE email ILIKE '%${search}%' OR username ILIKE '%${search}%' OR "name" ILIKE '%${search}%' ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT(*) from v_user WHERE email ILIKE '%${search}%' OR username ILIKE '%${search}%' OR "name" ILIKE '%${search}%'`,
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

app.get('/api/users/list', (req, res) => {
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
    db.sequelize.query(`SELECT id, name, position_id, position_name FROM v_user WHERE created_by = ${hasilJWT.data.id} AND (email ILIKE '%${search}%' OR username ILIKE '%${search}%' OR "name" ILIKE '%${search}%') ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT(*) from v_user WHERE created_by = ${hasilJWT.data.id} AND (email ILIKE '%${search}%' OR username ILIKE '%${search}%' OR "name" ILIKE '%${search}%')`,
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
      const pass2 = Md5.hashStr(pass1 + args.username);
      db.users.findOrCreate({where: {username: args.username}, defaults: {
        name: args.name,
        email: args.email,
        username: args.username,
        password: pass2,
        position_id: args.position_id,
        gender_id: args.gender_id,
        phone: args.phone,
        status: 1,
        akses_id: args.akses_id ? args.akses_id : 2,
        created_by: hasilJWT.data.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }})
      .then(([result, created]) => {
        if (created){
          const userResult = result;
          const user_id = result.id;
          db.m_files.create({
            file: args.image.base64,
            status: 1,
            uploadBy: hasilJWT.data.id,
            file_name: args.image.file_name,
            file_size: args.image.file_size,
            file_type: args.image.file_type,
            createdAt: new Date(),
            updatedAt: new Date()
          }).then(async (created) => {
            await db.rel_user_file.create({
              user_id: user_id,
              file_id: created.id
            });
            res.json({
              sukses: true,
              msg: "User created successfully",
              user: userResult
            })
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

app.post('/api/users/detail', (req, res) => {
  const head = req.headers;
  const body = req.body;
  let token = head.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    db.sequelize.query(`SELECT * FROM v_user where id = ${body.id}`, {type: db.Sequelize.QueryTypes.SELECT})
    .then((result) => {
      const data = result[0];
      delete data.password;
      if (result) {
        res.json({
          sukses: true,
          data: data
        });
      } else {
        res.json({
          sukses: false,
          msg: 'Music Not Found'
        });
      }
    });
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
})

app.post('/api/users/update', (req,res) => {
  const args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    if (hasilJWT.data.akses_id === 1) {
      db.sequelize.query(`SELECT * FROM v_user where id = ${args.id}`, {type: db.Sequelize.QueryTypes.SELECT})
      .then((x) => {
        const pas = JSON.parse(JSON.stringify(x[0])).password;
        console.log(pas);
        const pass1 = Md5.hashStr(args.password);
        const pass2 = Md5.hashStr(pass1 + args.username);
        db.users.update({
          name: args.name,
          email: args.email,
          username: args.username,
          password: args.password ? pass2 : pas,
          position_id: args.position_id,
          gender_id: args.gender_id,
          phone: args.phone,
          status: 1,
          akses_id: args.akses_id ? args.akses_id : 2,
          created_by: hasilJWT.data.id
        }, {returning: true, where: {id: args.id}})
        .then((result) => {
          const updateUser = result;
          if (result) {
            if (args.image && args.image.file_name != '') {
              db.rel_user_file.findOne({where:{user_id: args.id, status: 1}})
              .then((rel) => {
                db.m_files.update({
                  file: args.image.base64,
                  status: 1,
                  uploadBy: hasilJWT.data.id,
                  file_name: args.image.file_name,
                  file_size: args.image.file_size,
                  file_type: args.image.file_type,
                }, {where: {id: rel.file_id}})
                .then((result) => {
                  if (result) {
                    res.json({
                      sukses: true,
                      msg: 'Update member successfully'
                    });  
                  } else {
                    res.json({
                      sukses: false,
                      msg: 'Failed update file user'
                    });
                  }
                }).catch((err) => {
                  console.log(err);
                  res.json({
                    sukses: false,
                    msg: JSON.stringify(err)
                  });
                });
              }).catch((err) => {
                console.log(err);
                res.json({
                  sukses: false,
                  msg: JSON.stringify(err)
                });
              });
            } else {
              res.json({
                sukses: true,
                msg: 'Update member successfully'
              });   
            }
          } else {
            res.json({
              sukses: false,
              msg: 'Failed update data user'
            }); 
          }
        });
      })
    } else {
      res.json({
        sukses: false,
        msg: 'Unauthorized User'
      })
    }
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
})

app.post('/api/users/delete', (req,res) => {
  const args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    if (hasilJWT.data.akses_id === 1) {
      db.sequelize.query(`UPDATE users SET status = 0 WHERE id = ${args.id}`, {type: db.sequelize.QueryTypes.UPDATE})
      .then((result) => {
        if (result) {
          res.json({
            sukses: true,
            msg: 'Delete user successfully'
          });
        } else {
          res.json({
            sukses: false,
            msg: 'Failed Delete user'
          });
        }
      }).catch((err) => {
        res.json({
          sukses:false,
          msg: JSON.stringify(err)
        });
      })
    } else {
      res.json({
        sukses: false,
        msg: 'Unauthorized User'
      })
    }
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
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
    db.sequelize.query(`SELECT * FROM v_music_detail WHERE user_id = ${hasilJWT.data.id} AND (judul ILIKE '%${search}%' OR penyanyi ILIKE '%${search}%' OR link ILIKE '%${search}%') ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT("id") FROM v_music_detail WHERE user_id = ${hasilJWT.data.id} AND (judul ILIKE '%${search}%' OR penyanyi ILIKE '%${search}%' OR link ILIKE '%${search}%')`,
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

app.post('/api/music/delete', (req, res) => {
  const head = req.headers;
  const args = req.body;
  let token = head.authorization;
  let hasilJWT = checkJWT(token)
  if (hasilJWT) {
    db.sequelize.query(`UPDATE music SET status = 0 WHERE id = ${args.id}`, {type: db.Sequelize.QueryTypes.UPDATE})
    .then((result) => {
      if (result) {
        res.json({
          sukses: true,
          msg: 'Delete music successfully'
        });
      } else {
        res.json({
          sukses: true,
          msg: 'Delete music failed'
        });
      };
    }).catch((err) => {
      console.log(err)
      res.json({
        sukses: true,
        msg: 'Delete music failed'
      });
    });
  } else {
    res.json({
      sukses: false,
      msg: 'Unauthrized user'
    });
  }
})

app.get('/api/music/all', (req, res) => {
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
    db.sequelize.query(`SELECT * FROM v_music_detail WHERE judul ILIKE '%${search}%' OR penyanyi ILIKE '%${search}%' OR link ILIKE '%${search}%' ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT("id") FROM v_music_detail WHERE judul ILIKE '%${search}%' OR penyanyi ILIKE '%${search}%' OR link ILIKE '%${search}%'`,
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

app.post('/api/music/detail', (req, res) => {
  const head = req.headers;
  const body = req.body;
  let token = head.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    db.sequelize.query(`SELECT * FROM v_music_detail where id = ${body.id}`, {type: db.Sequelize.QueryTypes.SELECT}).then((result) => {
      if (result) {
        res.json({
          sukses: true,
          data: result[0]
        });
      } else {
        res.json({
          sukses: false,
          msg: 'Music Not Found'
        });
      }
    });
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
})

// Add New Music
app.post('/api/music/create', (req, res) => {
  let args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    // if (hasilJWT.data.akses_id === 1) {
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
  // } else {
    // res.json({
    //   sukses: false,
    //   message: 'Invalid Token'
    // });
  // }
})

app.post('/api/music/update', (req, res) => {
  let args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    // if (hasilJWT.data.akses_id === 1) {
    db.music.update({
      judul: args.judul,
      penyanyi: args.penyanyi,
      lirik: args.lirik,
      chord: args.chord,
      link: args.link,
      user_id: hasilJWT.data.id
    }, {where: {id: args.id}}).then((updated) => {
      if (updated) {
        res.json({
          sukses: true,
          data: updated
        })
      } else {
        res.json({
          sukses: false,
          msg: 'Failed update music'
        });
      }
    }).catch((err) => {
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
  // } else {
    // res.json({
    //   sukses: false,
    //   message: 'Invalid Token'
    // });
  // }
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
    db.sequelize.query(`SELECT id, event_name, event_date, user_id, song_leader_id, vokalis_id, song_leader, vokalis, basis, basis_id, gitaris, gitaris_id, drummer, drummer_id, pianis, pianis_id, music_name, file_id FROM v_schedule WHERE user_id = ${hasilJWT.data.id} AND event_name ILIKE '%${search}%' ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT("id") FROM v_schedule WHERE user_id = ${hasilJWT.data.id} AND event_name ILIKE '%${search}%'`,
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

app.get('/api/schedule/all', (req, res) => {
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
    db.sequelize.query(`SELECT id, event_name, event_date, user_id, song_leader_id, vokalis_id, song_leader, vokalis, basis, basis_id, gitaris, gitaris_id, drummer, drummer_id, pianis, pianis_id, music_name, file_id FROM v_schedule WHERE event_name ILIKE '%${search}%' ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT("id") FROM v_schedule WHERE event_name ILIKE '%${search}%'`,
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

// Create Schedule
app.post('/api/schedule/create', (req, res) => {
  
  let args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    // if (hasilJWT.data.akses_id === 1) {
      db.schedule.create({
        event_date: args.event_date,
        event_name: args.event_name,
        basis: args.basis,
        gitaris: args.gitaris,
        drummer: args.drummer,
        user_id: hasilJWT.data.id,
        pianis: args.pianis,
        createdAt: new Date(),
        updatedAt: new Date()
      }).then( async (created) => {
        const id_schedule = created.id
        const schedule = created;
        if (created) {
          let vl = [];
          await args.vokalis.forEach((value, index) => {
            return vl.push({
              user_id: value,
              schedule_id: id_schedule
            });
          })
          let sl = [];
          await args.song_leader.forEach((value, index) => {
            return sl.push({
              user_id: value,
              schedule_id: id_schedule
            });
          })
          let al = [];
          await args.lagu.forEach((value, index) => {
            return al.push({
              music_id: value,
              schedule_id: id_schedule
            });
          })

          await db.m_vokalis.bulkCreate(vl, {fields: ['user_id', 'schedule_id'], individualHooks: true});
          await db.m_song_leader.bulkCreate(sl, {fields: ['user_id', 'schedule_id'], individualHooks: true});
          await db.rel_schedule_music.bulkCreate(al, {fields: ['music_id', 'schedule_id'], individualHooks: true});
          await db.m_files.create({
            file: args.image.base64,
            status: 1,
            uploadBy: hasilJWT.data.id,
            file_name: args.image.file_name,
            file_size: args.image.file_size,
            file_type: args.image.file_type,
            createdAt: new Date(),
            updatedAt: new Date()
          }).then(async (created) => {
            await db.rel_schedule_files.create({
              schedule_id: id_schedule,
              files_id: created.id
            });
            let idEmail = await getEmailUser(args);
            db.sequelize.query(`SELECT email FROM v_user WHERE id IN (${idUser.join(',')})`, { type: db.sequelize.QueryTypes.SELECT})
            .then((resultEm) => {
              console.log(resultEm);
              // sendEmail(resultEm.email, 'New event is up coming to your team', 'New Event on jcocmusic.org');
            })
            res.json({
              sukses: true,
              msg: "Schedule created successfully",
              schedule: schedule
            })
          }).catch((err) => {
            res.json({
              sukses: false,
              msg: JSON.stringify(err)
            });
          });
        } else {
          res.json({
            sukses: false,
            data: created
          });
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
  // } else {
    // res.json({
    //   sukses: false,
    //   message: 'Invalid Token'
    // });
  // }
})

const getEmailUser = async (data) => {
  idUser = await  [];
  data.basis ? await parseMyId(data.basis) : {};
  data.gitaris ? await parseMyId(data.gitaris) : {};
  data.drummer ? await parseMyId(data.drummer) : {};
  data.pianis ? await parseMyId(data.pianis) : {};
  await parseMyId(data.vokalis);
  await parseMyId(data.song_leader);
  return idUser;
}

// Schedule Detail
app.post('/api/schedule/detail', (req, res) => {
  const head = req.headers;
  let token = head.authorization;
  const body = req.body;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    db.sequelize.query(`SELECT * FROM v_schedule WHERE "id" = ${body.id}`, { type: db.sequelize.QueryTypes.SELECT})
    .then((result) => {
      if(result) {
        res.json({
          sukses: true,
          data: result[0]
        });
      } else {
        res.json({
          sukses: false,
          msg: 'Schedule not found'
        })
      }
    }).catch((err) => {
      res.json({
        sukses: false,
        msg: JSON.stringify(err)
      });
    });
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
})

// DELETE Schedule

app.post('/api/schedule/delete', (req,res) => {
  const args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    // if (hasilJWT.data.akses_id === 1) {
      db.sequelize.query(`UPDATE schedule SET status = 0 WHERE id = ${args.id}`, {type: db.sequelize.QueryTypes.UPDATE})
      .then((result) => {
        if (result) {
          res.json({
            sukses: true,
            msg: 'Delete user successfully'
          });
        } else {
          res.json({
            sukses: false,
            msg: 'Failed Delete user'
          });
        }
      }).catch((err) => {
        res.json({
          sukses:false,
          msg: JSON.stringify(err)
        });
      })
    } else {
      res.json({
        sukses: false,
        msg: 'Unauthorized User'
      })
    }
  // } else {
    // res.json({
    //   sukses: false,
    //   message: 'Invalid Token'
    // });
  // }
})

// Update Schedule

app.post('/api/schedule/update', (req,res) => {
  const args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    // if (hasilJWT.data.akses_id === 1) {
      db.schedule.update({
        event_date: args.event_date,
        event_name: args.event_name,
        basis: args.basis,
        gitaris: args.gitaris,
        drummer: args.drummer,
        user_id: hasilJWT.data.id,
        pianis: args.pianis,
      }, {where: {id: args.id}}).then(async (updated) => {
        if (updated) {
          db.sequelize.query(`UPDATE m_vokalis SET status = 0 WHERE m_vokalis.schedule_id = ${args.id}`).then(() => {
            db.sequelize.query(`UPDATE m_song_leader SET status = 0 WHERE m_song_leader.schedule_id = ${args.id}`).then(() => {
              db.sequelize.query(`UPDATE rel_schedule_music SET status = 0 WHERE rel_schedule_music.schedule_id = ${args.id}`).then(async () => {
                const id_schedule = args.id
                let vl = [];
                await args.vokalis.forEach((value, index) => {
                  return vl.push({
                    user_id: value,
                    schedule_id: id_schedule
                  });
                })
                let sl = [];
                await args.song_leader.forEach((value, index) => {
                  return sl.push({
                    user_id: value,
                    schedule_id: id_schedule
                  });
                })
                let al = [];
                await args.lagu.forEach((value, index) => {
                  return al.push({
                    music_id: value,
                    schedule_id: id_schedule
                  });
                })
                await db.m_vokalis.bulkCreate(vl, {fields: ['user_id', 'schedule_id'], individualHooks: true});
                await db.m_song_leader.bulkCreate(sl, {fields: ['user_id', 'schedule_id'], individualHooks: true});
                await db.rel_schedule_music.bulkCreate(al, {fields: ['music_id', 'schedule_id'], individualHooks: true});
                if (args.image && args.image.file_name) {
                  db.rel_schedule_files.findOne({where: {schedule_id: args.id, status: 1}})
                  .then((resFile) => {
                    let file = resFile.get({plain: true});
                    console.log(file);
                    db.m_files.update({
                      file: args.image.base64,
                      status: 1,
                      uploadBy: hasilJWT.data.id,
                      file_name: args.image.file_name,
                      file_size: args.image.file_size,
                      file_type: args.image.file_type
                    }, {where: {id: file.files_id}})
                    .then((updateImg) => {
                      if (updateImg) {
                        res.json({
                          sukses: true,
                          msg: 'Sukses update schedule'
                        });
                      } else {
                        res.json({
                          sukses: false,
                          msg: 'Failed update schedule'
                        });
                      }
                    }).catch((err) => {
                      console.log(err);
                      res.json({
                        sukses: false,
                        msg: JSON.stringify(err)
                      });
                    })
                  }).catch((err) => {
                    console.log(err);
                    res.json({
                      sukses: false,
                      msg: JSON.stringify(err)
                    });
                  });
                } else {
                res.json({
                  sukses: true,
                  msg: 'Update schedule successfully'
                });
                }
                }).catch(err => {
                  console.log(err);
                  res.json({
                    sukses: false,
                    msg: JSON.stringify(err)
                  });
                });
              });
            });
        } else {
          res.json({
            sukses: false,
            msg: 'Failed update schedule'
          });
        }
      })
    } else {
      res.json({
        sukses: false,
        msg: 'Unauthorized User'
      })
    }
  // } else {
    // res.json({
    //   sukses: false,
    //   message: 'Invalid Token'
    // });
  // }
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

// Get Content List

app.get('/api/content', (req, res) => {
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
    db.sequelize.query(`SELECT id, title, file_id FROM v_content WHERE title ILIKE '%${search}%' ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT(*) from v_content WHERE user_id = ${hasilJWT.data.id} AND (title ILIKE '%${search}%')`,
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

// Create new Content

app.post('/api/content/create', (req, res) => {
  const head = req.headers;
  const args = req.body;
  let token = head.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    db.sequelize.query(`SELECT COUNT(*) FROM v_content WHERE user_id = ${hasilJWT.data.id}`, {type: db.Sequelize.QueryTypes.SELECT})
    .then((count) => {
      if (count[0].count >= 5) {
        res.json({
          sukses: false,
          msg: 'limit'
        });
      } else {
        db.m_files.create({
          file: args.image.base64,
          status: 1,
          uploadBy: hasilJWT.data.id,
          file_name: args.image.file_name,
          file_size: args.image.file_size,
          file_type: args.image.file_type
        }).then((result) => {
          if (result) {
            db.content.create({
              file_id: result.id,
              title: args.title,
              status: 1,
              user_id: hasilJWT.data.id
            }).then((cResult) => {
              res.json({
                sukses: true,
                msg: 'Create content successfully'
              });
            }).catch((err) => {
              console.log(err)
              res.json({
                sukses: false,
                msg: JSON.stringify(err)
              })
            }).catch((err) => {
              console.log(err)
              res.json({
                sukses: false,
                msg: JSON.stringify(err)
              })
            })
          } else {
            res.json({
              sukses: false,
              msg: 'Failed create content'
            });
          }
        });
      }
    })
  } else {
    res.json({
      sukses: false,
      msg: 'Unauthrized user'
    })
  }
})

app.post('/api/content/delete', (req, res) => {
  const head = req.headers;
  const args = req.body;
  let token = head.authorization;
  let hasilJWT = checkJWT(token)
  if (hasilJWT) {
    db.sequelize.query(`UPDATE content SET status = 0 WHERE id = ${args.id}`, {type: db.Sequelize.QueryTypes.UPDATE})
    .then((result) => {
      if (result) {
        res.json({
          sukses: true,
          msg: 'Delete content successfully'
        });
      } else {
        res.json({
          sukses: true,
          msg: 'Delete content failed'
        });
      };
    }).catch((err) => {
      console.log(err)
      res.json({
        sukses: true,
        msg: 'Delete content failed'
      });
    });
  } else {
    res.json({
      sukses: false,
      msg: 'Unauthrized user'
    })
  }
})

// Create new articles

app.post('/api/article/create', (req, res) => {
  const head = req.headers;
  const args = req.body;
  let token = head.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    db.m_files.create({
      file: args.image.base64,
      status: 1,
      uploadBy: hasilJWT.data.id,
      file_name: args.image.file_name,
      file_size: args.image.file_size,
      file_type: args.image.file_type
    }).then((result) => {
      if (result) {
        db.m_articles.create({
          files_id: result.id,
          title: args.title,
          content: args.content,
          status: 1,
          user_id: hasilJWT.data.id
        }).then((cResult) => {
          res.json({
            sukses: true,
            msg: 'Create content successfully'
          });
        }).catch((err) => {
          console.log(err)
          res.json({
            sukses: false,
            msg: JSON.stringify(err)
          })
        }).catch((err) => {
          console.log(err)
          res.json({
            sukses: false,
            msg: JSON.stringify(err)
          })
        })
      } else {
        res.json({
          sukses: false,
          msg: 'Failed create content'
        });
      }
    });
  } else {
    res.json({
      sukses: false,
      msg: 'Unauthrized user'
    })
  }
})

// Delete articles

app.post('/api/article/delete', (req, res) => {
  const head = req.headers;
  const args = req.body;
  let token = head.authorization;
  let hasilJWT = checkJWT(token)
  if (hasilJWT) {
    db.sequelize.query(`UPDATE m_articles SET status = 0 WHERE id = ${args.id}`, {type: db.Sequelize.QueryTypes.UPDATE})
    .then((result) => {
      if (result) {
        res.json({
          sukses: true,
          msg: 'Delete content successfully'
        });
      } else {
        res.json({
          sukses: true,
          msg: 'Delete content failed'
        });
      };
    }).catch((err) => {
      console.log(err)
      res.json({
        sukses: true,
        msg: 'Delete content failed'
      });
    });
  } else {
    res.json({
      sukses: false,
      msg: 'Unauthrized user'
    })
  }
})

// Get Content List

app.get('/api/article', (req, res) => {
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
    db.sequelize.query(`SELECT id, content, title, name, file_id, "createdAt" FROM v_articles WHERE user_id = ${hasilJWT.data.id} AND (title ILIKE '%${search}%') ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT(*) from v_articles WHERE user_id = ${hasilJWT.data.id} AND (title ILIKE '%${search}%')`,
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

app.get('/api/article/all', (req, res) => {
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
    db.sequelize.query(`SELECT id, content, title, name, file_id, "createdAt" FROM v_articles WHERE title ILIKE '%${search}%' ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT(*) from v_articles WHERE title ILIKE '%${search}%'`,
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

// Articles detail

app.post('/api/article/detail', (req, res) => {
  const head = req.headers;
  const body = req.body;
  let token = head.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    db.sequelize.query(`SELECT * FROM v_articles_detail where id = ${body.id}`, {type: db.Sequelize.QueryTypes.SELECT}).then((result) => {
      if (result) {
        res.json({
          sukses: true,
          data: result[0]
        });
      } else {
        res.json({
          sukses: false,
          msg: 'Article Not Found'
        });
      }
    });
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
})

// Update articles

app.post('/api/article/update', (req, res) => {
  const head = req.headers;
  const args = req.body;
  let token = head.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    if (hasilJWT.data.akses_id === 1) {
      console.log(args);
      db.m_articles.update({
        title: args.title,
        content: args.content,
        status: 1,
        user_id: hasilJWT.data.id
      }, {returning: true, where: {id: args.id}}).then((result) => {
        if (args.image && args.image.file_name) {
          db.m_files.update({
            file: args.image.base64,
            status: 1,
            uploadBy: hasilJWT.data.id,
            file_name: args.image.file_name,
            file_size: args.image.file_size,
            file_type: args.image.file_type,
          }, {where: {id: args.files_id}})
          .then((resul) => {
            if (resul) {
              res.json({
                sukses: true,
                msg: "Update article successfully"
              })
            } else {
              res.json({
                sukses: false,
                msg: "Update article failed"
              })
            }
          }).catch((err) => {
            console.log(err);
            res.json({
              sukses: false,
              msg: JSON.stringify(err)
            })
          })
        } else {
          res.json({
            sukses: true,
            msg: "Update article successfully"
          });
        }
      }).catch((err) => {
        console.log(err);
        res.json({
          sukses: false,
          msg: JSON.stringify(err)
        })
      })
    } else {
      res.json({
        sukses: false,
        msg: "Unauthorized user"
      });
    }
  } else {
    res.json({
      sukses: false,
      msg: 'Unauthrized user'
    })
  }
});

app.post('/api/email', (req, res) => {
  sendEmail();
});

const parseMyId = async (data) => {
  if (Array.isArray(data)) {
      idUser.concat(data);
      data.forEach((val, ind) => {
          return idUser.push(val);
      });
      return idUser;
  } else {
      idUser.push(data);
      return idUser;
  };
}

const sendEmail = (email, subject, text) => {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const msg = {
  to: email,
  from: 'eleomessiah@gmail.com',
  subject: subject,
  text: text,
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);
};

const request = require('request');

app.use(express.static('www'));
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/www/index.html');
})
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
