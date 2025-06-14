const connection = require('../mysql_connect')
const { connect } = require('../route')


class Account {
  user_registration(req, res) {
    if (req.method == "GET") {
      res.render('register.ejs')
    }
    else {
      connection.getConnection((err, myconnect) => {
        if (err) {
          res.send(err)
        }
        else {
          const { name,email, password1, password2, mobile, gender, address } = req.body;
          const photo = req.file ? req.file.filename : null;

          if (password1 == password2) {
            const check_email = `select * from thrift_users where email='${req.body.email}'`
            myconnect.query(check_email, (err, record) => {
              if (err) {
                res.send(err)
              }
              else {
                if (record.length > 0) {
                  res.render('register.ejs', { result: req.body.email + ' Already Registred' })
                }
                else {

                  const query = `INSERT INTO thrift_users ( name,email, password, mobile, gender, address, photo, status)VALUES ( '${name}','${email}', '${password1}', '${mobile}', '${gender}', '${address}', '${photo}', 1)`;

                  myconnect.query(query, (err) => {
                    if (err) {
                      res.send(err)
                    }
                    else {
                      res.render('register.ejs', { result: "Registered Successfully. Please login to continue." })
                    }
                  })

                }
              }
            })


          }
          else {
            myconnect.release()
            res.render('register.ejs', { result: "Password Mismatch" })
          }
        }
      })


    }


  }
  user_login(req, res) {
    if (req.method == 'GET') {
      res.render('login')
    }
    else {
      connection.getConnection((err, connect) => {
        if (err) {
          res.send(err)
        }
        else {
          const email = req.body.email
          const password = req.body.password
          const q = `select * from thrift_users where email='${email}' and password='${password}'`
          connect.query(q, (err, record) => {
            if (err) {
              res.send(err)
            }
            else {
              if (record.length > 0) {
                const user = record[0];
                if (user.status == 1) {
                  req.session.userid = user.id
                  req.session.emailid = email;
                  req.session.username = user.name;
                  req.session.mobile = user.mobile;
                  req.session.gender = user.gender;
                  req.session.useraddress = user.address;
                  req.session.photo = user.photo;
                  res.redirect('/user/user-dashboard')
                }
                else {
                  res.render('blockuser')
                }
              }
              else {

                res.render('login', { message: 'invalid credentials' })


              }
            }
          })
        }
      })
    }
  }


change_password(req,res)
   {
    if(req.session.emailid!=null && req.session.username!=null)
      {
          if(req.method=='GET')
          {
              res.render('user/change-password.ejs',{name:req.session.username})
          }
          else 
          {
            connection.getConnection((err,myconnect)=>{
              if(err){
                res.send(err)
              }
              else{
                const { currpass, newpass, confirmpass } = req.body;
                const email = req.session.emailid;
                if(newpass==confirmpass)
                         {
                              const q1=`select * from thrift_users where email='${email}' and password='${currpass}'`
                              myconnect.query(q1,(err,record)=>
                              {
                                 if(err)
                                 {
                                    res.send(err)
                                 }
                                 else 
                                 {
                                     if(record.length>0)
                                     {
                                      console.log(record)
                                       const q2=`update thrift_users set password='${newpass}' where email='${email}'`
                                       myconnect.query(q2,(err)=>
                                      {
                                         if(err)
                                         {
                                            res.send(err)
                                         }
                                         else 
                                         {
                                             res.render('user/change-password.ejs',{name:req.session.username,message:"Password changed successfully"})
                                         }
                                      })
                                     }
                                     else 
                                     {
                                      res.render('user/change-password.ejs',{name:req.session.username,message:"Old password incorrect!"})
                                     }
                                 }
                              })
                         }
                else{
                  res.render('user/change-password.ejs',{name:req.session.username,message:"Passwords do not match"})
                }
              }
            })
          }
      }
      else 
      {
        res.render('login',{message:'login here....'})
      }
   }

user_profile(req,res)
   {
    if(req.session.emailid!=null && req.session.username!=null)
      {
          if(req.method=='GET')
          {
              res.render('user/user-profile.ejs', {
        name: req.session.username,
        email: req.session.emailid,
        mobile: req.session.mobile,
        gender: req.session.gender,
        address: req.session.useraddress,
        status: req.session.status,
        photo: req.session.photo 
      });
          }
          else 
          {

          }
      }
      else 
      {
        res.render('login',{message:'login here....'})
      }
   }


edit_profile(req, res) {
  if (req.session.userid != null) {
    connection.getConnection((err, myconnect) => {
      if (err) {
        res.send(err);
      } else {
        if (req.method === 'GET') {
          const q = `SELECT * FROM thrift_users WHERE id='${req.session.userid}'`;
          myconnect.query(q, (err, result) => {
            if (err) {
              res.send(err);
            } else {
              const user = result[0];

              res.render('user/edit-profile.ejs', {
                user,
                photo: user.photo,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                gender: user.gender,
                address: user.address,
              });
            }
          });
        } else {
          const { name, mobile, gender, address } = req.body;

          let photoUpdateQuery = '';
          let photoFilename = null;

          // If photo uploaded, prepare part of query to update it
          if (req.file) {
            photoFilename = req.file.filename;
            photoUpdateQuery = `, photo='${photoFilename}'`;
          }

          const q2 = `
            UPDATE thrift_users 
            SET name='${name}', mobile='${mobile}', gender='${gender}', address='${address}'${photoUpdateQuery} 
            WHERE id='${req.session.userid}'
          `;

          myconnect.query(q2, (err) => {
            if (err) {
              res.send(err);
            } else {
              // Update session
              req.session.username = name;
              req.session.mobile = mobile;
              req.session.gender = gender;
              req.session.useraddress = address;

              if (photoFilename) {
                req.session.userphoto = photoFilename;
              }

              res.redirect('/user/edit-profile');
            }
          });
        }
      }
    });
  } else {
    res.render('login', { message: 'Login here....' });
  }
}
  
}

const obj = new Account()

module.exports = obj