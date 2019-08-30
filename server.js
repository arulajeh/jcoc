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
            .then(async (resultEm) => {
              // console.log(resultEm);
              let listEmailing = [];
              await resultEm.forEach((val, inde) => {
                return listEmailing.push(val.email);
              });
              console.log(listEmailing);
              const html = `https://jcocmusic.herokuapp.com/view-schedule?id=${id_schedule}`
              sendEmail(listEmailing, 'New event is coming', 'JCOC Music notification', args, id_schedule);
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

const sendEmail = (email, subject, text, body, id) => {

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
  <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
  <meta content="width=device-width" name="viewport"/>
  <!--[if !mso]><!-->
  <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
  <!--<![endif]-->
  <title></title>
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css"/>
  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"/>
  <!--<![endif]-->
  <style type="text/css">
      body {
        margin: 0;
        padding: 0;
      }
  
      table,
      td,
      tr {
        vertical-align: top;
        border-collapse: collapse;
      }
  
      * {
        line-height: inherit;
      }
  
      a[x-apple-data-detectors=true] {
        color: inherit !important;
        text-decoration: none !important;
      }
    </style>
  <style id="media-query" type="text/css">
      @media (max-width: 720px) {
  
        .block-grid,
        .col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
  
        .block-grid {
          width: 100% !important;
        }
  
        .col {
          width: 100% !important;
        }
  
        .col>div {
          margin: 0 auto;
        }
  
        img.fullwidth,
        img.fullwidthOnMobile {
          max-width: 100% !important;
        }
  
        .no-stack .col {
          min-width: 0 !important;
          display: table-cell !important;
        }
  
        .no-stack.two-up .col {
          width: 50% !important;
        }
  
        .no-stack .col.num4 {
          width: 33% !important;
        }
  
        .no-stack .col.num8 {
          width: 66% !important;
        }
  
        .no-stack .col.num4 {
          width: 33% !important;
        }
  
        .no-stack .col.num3 {
          width: 25% !important;
        }
  
        .no-stack .col.num6 {
          width: 50% !important;
        }
  
        .no-stack .col.num9 {
          width: 75% !important;
        }
  
        .video-block {
          max-width: none !important;
        }
  
        .mobile_hide {
          min-height: 0px;
          max-height: 0px;
          max-width: 0px;
          display: none;
          overflow: hidden;
          font-size: 0px;
        }
  
        .desktop_hide {
          display: block !important;
          max-height: none !important;
        }
      }
    </style>
  </head>
  <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #E6E6E6;">
  <!--[if IE]><div class="ie-browser"><![endif]-->
  <table bgcolor="#E6E6E6" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #E6E6E6; width: 100%;" valign="top" width="100%">
  <tbody>
  <tr style="vertical-align: top;" valign="top">
  <td style="word-break: break-word; vertical-align: top;" valign="top">
  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#E6E6E6"><![endif]-->
  <div style="background-image:url(https://jcocmusic.herokuapp.com/assets/img/hand.jpg);background-position:top center;background-repeat:no-repeat;background-color:transparent;">
  <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 700px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
  <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image:url('images/photo-1531206715517-5c0ba140b2b8.jpg');background-position:top center;background-repeat:no-repeat;background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:700px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
  <!--[if (mso)|(IE)]><td align="center" width="700" style="background-color:transparent;width:700px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 35px; padding-top:60px; padding-bottom:5px;"><![endif]-->
  <div class="col num12" style="min-width: 320px; max-width: 700px; display: table-cell; vertical-align: top; width: 700px;">
  <div style="width:100% !important;">
  <!--[if (!mso)&(!IE)]><!-->
  <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:60px; padding-bottom:5px; padding-right: 0px; padding-left: 35px;">
  <!--<![endif]-->
  <div align="left" class="img-container left autowidth" style="padding-right: 0px;padding-left: 0px;">
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="left"><![endif]--><img alt="JCOC Music" border="0" class="left autowidth" src="https://jcocmusic.herokuapp.com/assets/img/jcoc.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 60px; display: block;" title="Image" width="60"/>
  <div style="font-size:1px;line-height:20px"> </div>
  <!--[if mso]></td></tr></table><![endif]-->
  </div>
  <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
  <tbody>
  <tr style="vertical-align: top;" valign="top">
  <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 0px; padding-left: 0px;" valign="top">
  <table align="left" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 9px solid #F6C025; height: 0px; width: 50%;" valign="top" width="50%">
  <tbody>
  <tr style="vertical-align: top;" valign="top">
  <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
  <div style="color:#555555;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;line-height:120%;padding-top:0px;padding-right:10px;padding-bottom:0px;padding-left:0px;">
  <div style="font-size: 12px; line-height: 14px; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; color: #555555;">
  <p style="font-size: 14px; line-height: 76px; margin: 0;"><span style="font-size: 64px; color: #ffffff;"><span style="line-height: 45px; font-size: 38px;">You have a new event</span></span></p>
  <p style="font-size: 14px; line-height: 69px; margin: 0;"><span style="font-size: 58px; color: #ffffff;">${body.event_name}</span></p>
  </div>
  </div>
  <!-- [if mso]></td></tr></table><![endif] -->
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
  <div style="color:#555555;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;line-height:120%;padding-top:0px;padding-right:10px;padding-bottom:0px;padding-left:0px;">
  <div style="line-height: 14px; font-size: 12px; font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif; color: #555555;">
  <p style="line-height: 36px; font-size: 12px; margin: 0;"><span style="font-size: 30px;"><span style="color: #ffffff; font-size: 30px; line-height: 36px;"><span style="line-height: 36px; font-size: 30px;">Event at ${new Date(body.event_date).getDate()}/${new Date(body.event_date).getMonth()}/${new Date(body.event_date).getFullYear()}</span></span></span></p>
  </div>
  </div>
  <!--[if mso]></td></tr></table><![endif]-->
  <div align="left" class="button-container" style="padding-top:20px;padding-right:10px;padding-bottom:10px;padding-left:0px;">
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 20px; padding-right: 10px; padding-bottom: 10px; padding-left: 0px" align="left"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:37.5pt; width:126.75pt; v-text-anchor:middle;" arcsize="8%" stroke="false" fillcolor="#F6C025"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Tahoma, Verdana, sans-serif; font-size:20px"><![endif]-->
  <div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#F6C025;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #F6C025;border-right:1px solid #F6C025;border-bottom:1px solid #F6C025;border-left:1px solid #F6C025;padding-top:5px;padding-bottom:5px;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:20px;display:inline-block;">
  <span style="font-size: 16px; line-height: 32px;"><span style="font-size: 20px; line-height: 40px;">GIVE TODAY</span></span>
  </span></div>
  <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
  </div>
  <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
  <tbody>
  <tr style="vertical-align: top;" valign="top">
  <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="405" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 405px; width: 100%;" valign="top" width="100%">
  <tbody>
  <tr style="vertical-align: top;" valign="top">
  <td height="405" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <!--[if (!mso)&(!IE)]><!-->
  </div>
  <!--<![endif]-->
  </div>
  </div>
  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
  <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
  </div>
  </div>
  </div>
  <div style="background-color:transparent;">
  <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 700px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
  <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:700px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
  <!--[if (mso)|(IE)]><td align="center" width="700" style="background-color:transparent;width:700px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:5px;"><![endif]-->
  <div class="col num12" style="min-width: 320px; max-width: 700px; display: table-cell; vertical-align: top; width: 700px;">
  <div style="width:100% !important;">
  <!--[if (!mso)&(!IE)]><!-->
  <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
  <!--<![endif]-->
  <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
  <tbody>
  <tr style="vertical-align: top;" valign="top">
  <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 10px; padding-left: 0px;" valign="top">
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 9px solid #F6C025; height: 0px; width: 100%;" valign="top" width="100%">
  <tbody>
  <tr style="vertical-align: top;" valign="top">
  <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
  <div style="color:#555555;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;line-height:120%;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
  <div style="font-size: 12px; line-height: 14px; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; color: #555555;">
  <p style="font-size: 14px; line-height: 16px; text-align: center; margin: 0;">Copyright © Organization, all rights reserved.</p>
  </div>
  </div>
  <!--[if mso]></td></tr></table><![endif]-->
  <!--[if (!mso)&(!IE)]><!-->
  </div>
  <!--<![endif]-->
  </div>
  </div>
  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
  <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
  </div>
  </div>
  </div>
  <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
  </td>
  </tr>
  </tbody>
  </table>
  <!--[if (IE)]></div><![endif]-->
  </body>
  </html>`
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const msg = {
  to: email,
  from: 'eleomessiah@gmail.com',
  subject: subject,
  text: text,
  html: html,
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
