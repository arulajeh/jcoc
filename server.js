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
    db.sequelize.query(`SELECT akses_id, email, file, gender_id, id, name, position_id, position_name, username FROM v_user WHERE email LIKE '%${search}%' OR username LIKE '%${search}%' OR "name" LIKE '%${search}%' ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT(*) from v_user WHERE email LIKE '%${search}%' OR username LIKE '%${search}%' OR "name" LIKE '%${search}%'`,
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
          // db.m_files = 
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

app.post('/api/users/update', (req,res) => {
  const args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    if (hasilJWT.data.akses_id === 1) {
      db.sequelize.query(`UPDATE users SET status = 0 WHERE id = ${args.id}`)
      .then(() => {
        // console.log(xyz);
        // if (xyz) {
          const pass1 = Md5.hashStr(args.password);
          const pass2 = Md5.hashStr(pass1 + args.username);
          db.users.create({
            name: args.name,
            email: args.email,
            username: args.username,
            password: pass2,
            position_id: args.position_id,
            gender_id: args.gender_id,
            phone: args.phone,
            status: 1,
            akses_id: args.akses_id ? args.akses_id : 2,
            created_by: hasilJWT.data.id
          }).then((users) => {
            const new_user_id = users.id;
            if (users) {
              if (args.image && args.image.file_name) {
                db.sequelize.query(`UPDATE rel_user_file SET status = 0 WHERE user_id = ${args.id}`)
                .then(() => {
                  // if (x) {
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
                        msg: "Update user successfully",
                        user: created
                      })
                    }).catch((err) => {
                      res.json({
                        sukses: false,
                        msg: JSON.stringify(err)
                      })
                    })
                  // } else {
                  //   res.json({
                  //     sukses: false,
                  //     msg: 'Failed update file'
                  //   })
                  // }
                })
              } else {
                db.sequelize.query(`SELECT * from rel_user_file WHERE user_id = ${args.id}`, {type: db.sequelize.QueryTypes.SELECT})
                .then((rel) => {
                  const rel_music_id = JSON.parse(JSON.stringify(rel[0]));
                  // res.json({
                  //   sukses:  false
                  // })
                  console.log(rel_music_id)
                  // res.json({
                  //   sukses: false,
                  //   data: rel_music_id.file_id
                  // });
                  db.rel_user_file.create({
                    user_id: new_user_id,
                    file_id = rel_music_id.file_id
                  }).then(() => {
                    res.json({
                      sukses: true,
                      msg: 'Update user Succesfully'
                    })
                  }).catch((err) => {
                    res.json({
                      sukses:false,
                      msg: JSON.stringify(err)
                    })
                  })
                }).catch((err) => {
                  res.json({
                    sukses:false,
                    msg: JSON.stringify(err)
                  })
                })
              }
            } else {
              res.json({
                sukses: false,
                msg: 'Failed update user'
              })
            }
          })
        // } else {
        //   res.json({
        //     sukses: false,
        //     msg: 'Failed update user'
        //   });
        // }
      }).catch((err) => {
        console.log(err);
        res.json({
          sukses:false,
          msg: 'ERROR CHANGE STATUS USERS'
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

app.post('/api/music/detail', (req, res) => {
  const head = req.headers;
  const body = req.body;
  let token = head.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    db.sequelize.query(`SELECT * FROM v_music_detail where id = ${body.id}`).then((result) => {
      if (result) {
        res.json({
          sukses: true,
          data: result
        });
      } else {
        res.json({
          sukses: false,
          msg: 'Music Not Found'
        });
      }
    })
    // db.music.findByPk(body.id).then((result) => {
    //   if (result) {
    //     res.json({
    //       sukses: true,
    //       data: result
    //     });  
    //   } else {
    //    res.json({
    //      sukses: false,
    //      msg: "Music Not Found"
    //    });
    //   }
    // }).catch((err) => {
    //   res.json({
    //     sukses:false,
    //     msg: JSON.stringify(err)
    //   });
    // });
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
});

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
    db.sequelize.query(`SELECT * FROM v_schedule WHERE user_id = ${hasilJWT.data.id} AND event_name LIKE '%${search}%' ORDER BY ${orderBy} ${sortBy} LIMIT ${pageSize} OFFSET ${offset}`,
    { type: db.sequelize.QueryTypes.SELECT})
    .then( async (result) => {
      let resultDB = result;
      db.sequelize.query(`SELECT COUNT("id") FROM v_schedule WHERE user_id = ${hasilJWT.data.id} AND event_name LIKE '%${search}%'`,
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

app.post('/api/schedule/create', (req, res) => {
  let args = req.body;
  let token = req.headers.authorization;
  let hasilJWT = checkJWT(token);
  if (hasilJWT) {
    if (hasilJWT.data.akses_id === 1) {
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
              music_name: value,
              schedule_id: id_schedule
            });
          })

          await db.m_vokalis.bulkCreate(vl, {fields: ['user_id', 'schedule_id'], individualHooks: true});
          await db.m_song_leader.bulkCreate(sl, {fields: ['user_id', 'schedule_id'], individualHooks: true});
          await db.master_lagu.bulkCreate(al, {fields: ['music_name', 'schedule_id'], individualHooks: true});
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
  } else {
    res.json({
      sukses: false,
      message: 'Invalid Token'
    });
  }
})

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
          data: result
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
    // db.v_schedule.findByPk(body.id).then((result) => {
    //   if(result) {
    //     res.json({
    //       sukses: true,
    //       data: result
    //     });
    //   } else {
    //     res.json({
    //       sukses: false,
    //       msg: 'Schedule not found'
    //     })
    //   }
    // }).catch((err) => {
    //   res.json({
    //     sukses: false,
    //     msg: JSON.stringify(err)
    //   });
    // }); 
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
