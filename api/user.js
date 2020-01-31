const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
var sendgrid = require("sendgrid")(process.env.sendgridApiKey);
var notification = require('../models/notification.js');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var hashedPassword = require('password-hash');
var order = require('../models/order.js');
var payment = require('../models/payment.js');
const passport = require('passport');
var multer = require('multer');
var bank = require('../models/bank.js');
var bankaccount = require('../models/bankAccount.js');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var util = require('../config/util.js');

exports.homePage = function (req, res) {
  res.sendFile(__dirname + '/index.html');
}
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.cloudinaryCloudName,
  api_key: process.env.cloudinaryApiKey,
  api_secret: process.env.cloudinaryApiSecret
});

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    //console.log("File : *",file)
    callback(null, '../uploads')
  },
  filename: function (req, file, callback) {
    console.log(file);
    callback(null, Date.now() + file.originalname)
  }
})


exports.register = function (req, res) {
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Request : ", req.body);
  }
  console.log("Request : ", req.body);
  var params = req.body;
  if (params.name != null && params.name != undefined && params.name != '') {
    if (params.email != null && params.email != undefined && params.email != '') {
      if (params.password != null && params.password != undefined && params.password != '') {
        if (params.username != null && params.username != undefined && params.username != '') {
          //  if(params.mobile!=null && params.mobile!=undefined && params.mobile!=''){
          User.findOne({ email: params.email }).exec(function (error, userResult) {
            if (error) {
              res.status(500).send({ success: false, error: error });
            } else {
              if (userResult) {
                res.status(403).send({ success: false, message: "Email already exists." });
              } else {
                User.create(params).then(function (result) {
                  result.password = undefined;
                  var token = jwt.sign({ user: result }, process.env.jwtsecret, { expiresIn: 1000000 });
                  res.status(200).send({ success: true, user: result, token: 'JWT ' + token });
                }).catch(function (e) {
                  console.log("Error in creating user : ", e)
                  if (e.code && e.code == 11000) {
                    if (e.errmsg.indexOf('$email_1') > -1) {
                      res.status(422).send({ message: "Email already exists" });
                    } else if (e.errmsg.indexOf('$mobile_1') > -1) {
                      res.status(422).send({ message: "mobile number already exists" });
                    } else if (e.errmsg.indexOf('$username_1') > -1) {
                      res.status(422).send({ message: "username number already exists" });
                    } else {
                      res.status(500).send({ error: e });
                    }
                  }
                });
              }
            }
          })

          // }else{
          //   res.status(403).send({message:"mobile required"});
          // }
        } else {
          res.status(403).send({ message: "username required" });
        }
      } else {
        res.status(403).send({ message: "password required" });
      }
    } else {
      res.status(403).send({ message: "email required" });
    }
  } else {
    res.status(403).send({ message: "name required" });
  }
}


exports.authenticate = function (req, res) {
  console.log("Request : ", req.body);
  if (req.body.email != null && req.body.email != "") {
    console.log("in email");
    User.findOne({ email: req.body.email, isDeleted: false }).select('+password').exec(function (err, user) {
      if (err) {
        throw err;
      } else if (user) {

        //image.findOne({ userId: user._id }).exec(function (err, image) {

        if (user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {

            user.password = undefined;
            var token = jwt.sign({ user: user }, process.env.jwtsecret, { expiresIn: 1000000 });
            User.findOne({ _id: user._id }).then(function (found) {
              res.status('200').send({ success: true, token: 'JWT ' + token, user: found });
            })

          } else {
            res.status(401).send({ success: false, message: 'password did not match.' });
          }
        }));
        //})
      } else {
        res.status(401).send({ success: false, message: 'user not found' })
      }

    });
  } else {
    res.status(403).send({ message: "Perameters Missing" });
  }
}


// //function used to edit some data in database
exports.edit = function (req, res) {
  console.log("Request : ", req.body);
  var query = {};
  if (req.body.user_id != null && req.body.user_id != undefined && req.body.user_id != '') {
    query = { _id: req.body.user_id };
  } else {
    query = { _id: req.user._id };
  }
  User.findOne(query).select('+password').exec(function (error, result) {
    result.name = req.body.name
    ? req.body.name
    : result.name;
    result.address = req.body.address
    ? req.body.address
    : result.address;
    result.country = req.body.country
    ? req.body.country
    : result.country;
    result.state = req.body.state
    ? req.body.state
    : result.state;
    result.mobile = req.body.mobile
    ? req.body.mobile
    : result.mobile;
    result.type = req.body.type
    ? req.body.type
    : result.type;
    result.customerType = req.body.customerType
    ? req.body.customerType
    : result.customerType;
    if (req.body.isDeleted == true) {
      if (!result.isDeleted) {
        result.isDeleted = req.body.isDeleted
        ? req.body.isDeleted
        : result.isDeleted;
        // result.email = result.email + "/" + new Date(Date.now()).getTime();
      }
    }else{
      result.isDeleted = false
      // console.log("User reActivated*****");
    }


    result.smsVerification = req.body.smsVerification
    ? req.body.smsVerification
    : result.smsVerification;
    result.emailVerfication = req.body.emailVerfication
    ? req.body.emailVerfication
    : result.emailVerfication;
    result.buisnessName = req.body.buisnessName
    ? req.body.buisnessName
    : result.buisnessName;
    result.alternateContact = req.body.alternateContact
    ? req.body.alternateContact
    : result.alternateContact;
    result.ntn = req.body.ntn
    ? req.body.ntn
    : result.ntn;
    result.strn = req.body.strn
    ? req.body.strn
    : result.strn;
    result.ntnStatus = req.body.ntnStatus
    ? req.body.ntnStatus
    : result.ntnStatus;
    result.careOf = req.body.careOf
    ? req.body.careOf
    : result.careOf;

    if (req.body.email != null && req.body.email != undefined && req.body.email != '') {
      User.findOne({ email: req.body.email }).exec(function (error, resultEmail) {
        if (error) {
          res.status(500).send({ success: false, error: error });
        } else {
          if (resultEmail) {
            if (req.body.nic != null && req.body.nic != undefined && req.body.nic != '') {
              User.findOne({ nic: req.body.nic }).exec(function (error, resultNic) {
                if (error) {
                  res.status(500).send({ success: false, error: error });
                } else {
                  if (resultNic) {
                    res.status(403).send({ success: false, message: "NIC already taken." });
                  } else {
                    result.nic = req.body.nic
                    ? req.body.nic
                    : result.nic;
                    result.save(function (error, user) {
                      if (error) {
                        res.status('500').send({ error: error })
                      } else {

                        res.status('200').send({ message: 'Email already taken, Other info updated successfully' })
                      }
                    });
                  }
                }
              })
            } else {
              result.save(function (error, user) {
                if (error) {
                  res.status('500').send({ error: error })
                } else {

                  res.status('200').send({ message: 'Email already taken, Other info updated successfully' })
                }
              });
            }
          } else {
            result.email = req.body.email;
            if (req.body.nic != null && req.body.nic != undefined && req.body.nic != '') {
              User.findOne({ nic: req.body.nic }).exec(function (error, resultNic) {
                if (error) {
                  res.status(500).send({ success: false, error: error });
                } else {
                  if (resultNic) {
                    res.status(403).send({ success: false, message: "NIC already taken." });
                  } else {
                    result.nic = req.body.nic
                    ? req.body.nic
                    : result.nic;
                    result.save(function (error, user) {
                      if (error) {
                        res.status('500').send({ error: error })
                      } else {

                        res.status('200').send({ message: 'updated' })
                      }
                    });
                  }
                }
              })
            } else {
              result.save(function (error, user) {
                if (error) {
                  res.status('500').send({ error: error })
                } else {

                  res.status('200').send({ message: 'updated' })
                }
              });
            }
          }
        }
      })
    } else {
      if (req.body.nic != null && req.body.nic != undefined && req.body.nic != '') {
        User.findOne({ nic: req.body.nic }).exec(function (error, resultNic) {
          if (error) {
            res.status(500).send({ success: false, error: error });
          } else {
            if (resultNic) {
              res.status(403).send({ success: false, message: "NIC already taken." });
            } else {
              result.nic = req.body.nic
              ? req.body.nic
              : result.nic;
              result.save(function (error, user) {
                if (error) {
                  res.status('500').send({ error: error })
                } else {

                  res.status('200').send({ message: 'updated' })
                }
              });
            }
          }
        })
      } else {
        result.save(function (error, user) {
          if (error) {
            res.status('500').send({ error: error })
          } else {

            res.status('200').send({ message: 'updated' })
          }
        });
      }
    }
  })
}



exports.getMobile = function (req, res) {
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Request : ", req.body);
  }
  User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.email }, { mobile: req.body.email }], isDeleted: false
  }).exec(function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      if (result) {
        res.status(200).send({ success: true, mobile: result.mobile });
      } else {
        res.status(403).send({ success: false, message: "invalid email" });
      }
    }
  })
}

exports.changePassword = function (req, res) {
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Request : ", req.body);
  }
  var params = req.body;
  if (params.password != null && params.password != undefined && params.password != '' && params.oldPassword != null && params.oldPassword != undefined && params.oldPassword != '') {
    User.findOne({
      _id: req.user._id
    }).select('+password').exec(function (error, result) {
      if (error) {
        res.status(500).send({ error: error });
      } else {
        if (result.comparePassword(req.body.oldPassword, function (err, isMatch) {
          if (isMatch && !err) {
            result.password = params.password
            result.save(function (error, done) {
              if (error) {
                res.status(500).send({ error: error });
              } else {
                res.status(200).send({ success: true, message: "password updated successfully" })
              }
            })
          } else {
            res.status(401).send({ success: false, message: 'password did not match with old password.' });
          }
        }));
      }
    })
  } else {
    res.status(403).send({ message: "passowrd required" })
  }
}

exports.updatePassword = function (req, res) {
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Request : ", req.body);
  }
  var params = req.body;
  if (params.password != null && params.password != undefined && params.password != '') {
    if (params.email != null && params.email != undefined && params.email != '') {
      User.findOne({
        email: req.body.email
      }).exec(function (error, result) {
        if (error) {
          res.status(500).send({ error: error });
        } else {
          result.password = params.password
          result.save(function (error, done) {
            if (error) {
              res.status(500).send({ error: error });
            } else {
              res.status(200).send({ success: true, message: "password updated successfully" })
            }
          })
        }
      })
    } else {
      res.status(403).send({ message: "email required" })
    }
  } else {
    res.status(403).send({ message: "passowrd required" })
  }
}
var upload = multer({ storage: storage }).single('userFile');
exports.uploadProfilePicture = function (req, res) {
  console.log("File : ", req.file);
  console.log("Files : ", req.files);
  if (req.file) {
    upload(req, res, function (err) {
      if (err) throw err;
      cloudinary.uploader.upload(req.file.path, function (cloudinarResult) {
        User.findOne({ _id: req.user._id }).exec(function (error, result) {
          if (error) {
            res.status(500).send({ error: error });
          } else {
            result.profilePicUrl = cloudinarResult.url;
            result.save(function (error, done) {
              if (error) {
                res.status(500).send({ error: error });
              } else {
                fs.unlink("./uploads/" + req.file.filename, (err) => {
                  if (err) {
                    console.log("failed to delete local image:" + err);
                    res.status(200).send({ success: true, message: "Profile picture updated successfully", user: done });
                  } else {
                    res.status(200).send({ success: true, message: "Profile picture updated successfully", user: done });
                  }
                });
              }
            })
          }
        })
      })
    })
  } else {
    res.status(403).send({ success: false, message: "file required" });
  }
}


/*
var urlRequest = { method: 'POST',
url: process.env.url+"/sendPushNotification/" + notify._id + "/" + message,
headers:
{ 'content-type': 'application/x-www-form-urlencoded',
'postman-token': 'f3b27335-41d1-8d80-df1b-668735631ebf',
'cache-control': 'no-cache' } }
request(urlRequest, function (error, response, body) {

});
*/


exports.getSingleUser = function (req, res) {
  if (req.body.user_id != null && req.body.user_id != undefined && req.body.user_id != '') {
    User.findOne({ _id: req.body.user_id}).exec(function (error, result) {
      if (error) {
        res.status(500).send({ success: false, error: error });
      } else {
        if (result) {
          res.status(200).send({ success: true, result: result });
        } else {
          res.status(403).send({ success: false, message: "User details not found." });
        }
      }
    })
  } else {
    res.status(403).send({ success: false, message: "user_id required" });
  }
}

exports.sendPushNotification = function (req, res) {
  if (process.env.DEBUG_LOGS == 'true' || process.env.DEBUG_LOGS == true) {
    console.log("*************Sending Push Notification**************");
    console.log("Log2", req.params.id);
  }
  notification.create({
    user_id: req.params.id,
    message: req.params.message,
    readStatus: false
  }).then(function (done) {
    var FCM = require('fcm-push');
    var serverKey = process.env.firebase; //put your server key here
    var fcm = new FCM(serverKey);
    User.findOne({ _id: req.params.id }).exec(function (error, result) {
      if (error) {
        res.status(500).send({ error: error });
      } else {
        if (result) {
          var message = {
            to: result.fcmToken, // required fill with device token or topics
            data: {
              "message": req.params.message,
              "ttl": 3600
            },
            notification: {
              title: 'Ajoor',
              body: req.params.message,
              sound: 'default'
            },
            ttl: 3600
          };
          //console.log("Message : ",message);
          fcm.send(message, function (err, response) {
            if (err) {
              console.log("Something has gone wrong in sending notification!");
              res.status(200).send({ success: false });
            } else {
              console.log("Successfully sent notification");
              res.status(200).send({ success: true });
              return true;
            }
          });
        }
      }
    })
  })
}

exports.getAllUsersAdmin = function (req, res) {
  var query = { isDeleted: false };
  console.log("Request : ", req.body);
  if (req.body.type != null && req.body.type != undefined && req.body.type != '') {
    if (Array.isArray(JSON.parse(req.body.type))) {
      if(req.body.isDeleted!=null && req.body.isDeleted!=undefined && req.body.isDeleted!=''){
        query = { type: { $in: JSON.parse(req.body.type) },isDeleted : req.body.isDeleted };
      }else{
        query = { type: { $in: JSON.parse(req.body.type) } };
      }
    } else {
      if(req.body.isDeleted!=null && req.body.isDeleted!=undefined && req.body.isDeleted!=''){
        query = { type: req.body.type,isDeleted : req.body.isDeleted};
      }else{
        query = { type: req.body.type};
      }
    }
  }
  User.find(query).exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: result });
    }
  })
}


exports.registerWithFacebook = function (req, res) {
  if (process.env.DEBUG_LOGS == true || process.env.DEBUG_LOGS == 'true') {
    console.log("Request : ", req.body);
  }
  if (req.body.email == null || req.body.password == null) {
    res.json({ success: false, message: 'Please enter email and password.' });
  } else {
    var email1 = req.body.email + "";
    for (var k = 0; k < 15; k++) {
      email1 = email1.replace(" ", "");
      if (k == 14) {
        req.body.email = email1;
        User.findOne({ email: req.body.email }).select({ connections: { $elemMatch: { id: req.body.id, email: req.body.email } } }).exec(function (error, result) {
          if (error) {
            res.send({ error: error });
          } else {
            if (!result) {
              var newUser = new User({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                connections: {
                  type: 'facebook',
                  id: req.body.id,
                  email: req.body.email,
                }
              });
              newUser.save((err, user) => {
                if (err) {
                  return res.json({ success: false, message: err });
                } else {
                  stripe.customers.create(
                    { email: req.body.email },
                    function (err, customer) {
                      User.findOne({ _id: user._id }).exec(function (error, compl) {
                        if (error) {
                          res.status(500).send({ error: error });
                        } else {
                          compl.stripeID = customer.id;
                          compl.save(function (error, fine) {
                            if (error) {
                              res.status(500).send({ error: error });
                            } else {
                              fine.password = undefined;
                              var token = jwt.sign({ user: compl }, process.env.jwtsecret, { expiresIn: 1000000 });
                              setTimeout(function () {
                                var token = jwt.sign(user, process.env.jwtsecret, { expiresIn: 1000000 });
                                var message = "Dear " + req.body.name + " thanks for joining ATMS."
                                //    var request = require("request");
                                var options = {
                                  method: 'GET',
                                  url: 'http://' + req.headers.host + '/sendEmail/' + req.body.email + '/' + process.env.SUBJECT_EMAIL + '/' + message,
                                  headers:
                                  {
                                    'cache-control': 'no-cache',
                                    'Content-Type': 'application/json'
                                  }
                                };
                                request(options, function (error, response, body) {
                                  if (error) throw new Error(error);
                                  console.log(body);
                                  res.status(202).send({ success: true, user: compl, token: 'JWT ' + token, message: 'new user registered successfully' });
                                })
                              }, 500);
                            }
                          })
                        }
                      })
                    }
                  );
                }
              });
            } else {
              result.password = undefined;
              var token = jwt.sign(result, process.env.jwtsecret, { expiresIn: 1000000 });
              User.findOne({ _id: result._id }).then(function (found) {
                res.status('200').send({ success: true, token: 'JWT ' + token, user: found, message: 'already a user' });
              })
            }
          }
        })
      }
    }
  }
}

exports.getUnread = function (req, res) {
  var skip = 0;
  if (req.body.skip != null && req.body.skip != undefined && req.body.skip != '') {
    skip = req.body.skip;
  }
  notification.find({ user_id: req.user._id }).sort({ createdAt: -1 }).skip(skip * 10).limit(10).exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      notification.find({ user_id: req.user._id, readStatus: false }).exec(function (error, notificationCount) {
        if (error) {
          res.status(500).send({ success: false, error: error });
        } else {
          res.status(200).send({ success: true, result: result, length: notificationCount.length });
        }
      })
    }
  })
}

exports.readNotifications = function (req, res) {
  var params = req.body;
  if (params.notification_id != null && params.notification_id != undefined && params.notification_id != '') {
    notification.update({ user_id: req.user._id, _id: params.notification_id }, { readStatus: true }).then(function (result) {
      if (process.env.DEBUG_LOGS == 'true') {
        console.log("updated : ", result);
      }
      res.status(200).send({ success: true, message: "updated" });
    })
  } else {
    res.status(403).send({ success: false, message: "notification_id required" });
  }

}

exports.registerWithGoogle = function (req, res) {
  if (process.env.DEBUG_LOGS == true || process.env.DEBUG_LOGS == 'true') {
    console.log("Request : ", req.body);
  }
  if (req.body.email == null || req.body.password == null) {
    res.json({ success: false, message: 'Please enter email and password.' });
  } else {
    var email1 = req.body.email + "";
    for (var k = 0; k < 15; k++) {
      email1 = email1.replace(" ", "");
      if (k == 14) {
        req.body.email = email1;
        User.findOne({ email: req.body.email }).select({ connections: { $elemMatch: { id: req.body.id, email: req.body.email } } }).exec(function (error, result) {
          if (error) {
            res.send({ error: error });
          } else {
            if (!result) {
              var newUser = new User({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                connections: {
                  type: 'google',
                  id: req.body.id,
                  email: req.body.email,
                }
              });
              newUser.save((err, user) => {
                if (err) {
                  return res.json({ success: false, message: err });
                } else {
                  stripe.customers.create(
                    { email: req.body.email },
                    function (err, customer) {
                      User.findOne({ _id: user._id }).exec(function (error, compl) {
                        if (error) {
                          res.status(500).send({ error: error });
                        } else {
                          compl.stripeID = customer.id;
                          compl.save(function (error, fine) {
                            if (error) {
                              res.status(500).send({ error: error });
                            } else {
                              fine.password = undefined;
                              var token = jwt.sign({ user: compl }, process.env.jwtsecret, { expiresIn: 1000000 });
                              setTimeout(function () {
                                var token = jwt.sign(user, process.env.jwtsecret, { expiresIn: 1000000 });
                                var message = "Dear " + req.body.name + " thanks for joining ajoor."
                                //    var request = require("request");
                                var options = {
                                  method: 'GET',
                                  url: 'http://' + req.headers.host + '/sendEmail/' + req.body.email + '/' + process.env.SUBJECT_EMAIL + '/' + message,
                                  headers:
                                  {
                                    'cache-control': 'no-cache',
                                    'Content-Type': 'application/json'
                                  }
                                };
                                request(options, function (error, response, body) {
                                  if (error) throw new Error(error);
                                  console.log(body);
                                  res.status(202).send({ success: true, user: compl, token: 'JWT ' + token, message: 'new user registered successfully' });
                                })
                              }, 500);
                            }
                          })
                        }
                      })
                    }
                  );
                }
              });
            } else {
              result.password = undefined;
              var token = jwt.sign(result, process.env.jwtsecret, { expiresIn: 1000000 });
              User.findOne({ _id: result._id }).then(function (found) {
                res.status('200').send({ success: true, token: 'JWT ' + token, user: found, message: 'already a user' });
              })
            }
          }
        })
      }
    }
  }
}

exports.getAllCustomers = function (req, res) {
  req.body.type = 'end user';
  console.log("Request ::",req.body);
  User.find(req.body).exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      if (result.length > 0) {
        order.aggregate([
          { $group: { _id: "$user_id", total: { $sum: "$totalAmount" } } }
        ]).exec(function (error, resultOrder) {
          if (error) {
            res.status(500).send({ success: false, error: error });
          } else {
            if (resultOrder.length > 0) {
              payment.aggregate([
                { $match: { status: 'success', isDeleted: false } },
                { $group: { _id: "$user_id", total: { $sum: "$amount" } } }
              ]).exec(function (error, resultPayment) {
                if (error) {
                  res.status(500).send({ success: false, error: error });
                } else {
                  if (resultPayment.length > 0) {
                    result.forEach(function (i, idx, x) {
                      var orderAmount = resultOrder.find(function (element) {
                        return element._id == i._id;
                      });
                      if (orderAmount == undefined) {
                        orderAmount = 0;
                      }
                      var paymentAmount = resultPayment.find(function (element) {
                        return element._id == i._id;
                      });
                      if (paymentAmount == undefined) {
                        paymentAmount = 0;
                      }
                      //  console.log("before ::::: ",result[idx]['credit'])
                      result[idx]['credit'] = parseInt(orderAmount.total) - parseInt(paymentAmount.total);
                      //  console.log("after ::::: ",result[idx]['credit'])
                      if (idx == x.length - 1) {
                        res.status(200).send({ success: true, result: result });
                      }
                    })
                  } else {
                    res.status(200).send({ success: true, result: result });
                  }
                }
              })
            } else {
              res.status(200).send({ success: true, result: result });
            }
          }
        })
      } else {
        res.status(403).send({ success: false, message: "Users not found." });
      }
    }
  })
}

exports.getCustomersCustomBalance = function (req, res) {
  console.log("Request ::::", req.body);

  var date = new Date(req.body.date)

  var matchQ = { "deliveryDate": { $lte: date }, "user_id": mongoose.Types.ObjectId(req.body.user_id) } //, "createdAt": { $lte: req.body.date} }
  console.log("MatchQ", matchQ);

  //var result = [req.user]

  var credit = 0
  var debit = 0
  order.aggregate([
    { $match: matchQ },
    { $group: { _id: "$user_id", total: { $sum: "$totalAmount" } } }
  ]).exec((error, resultOrder) => {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {

      console.log('Result Order', resultOrder);

      if (resultOrder.length > 0) {

        credit = resultOrder[0]["total"]

        payment.aggregate([
          { $match: { status: 'success', isDeleted: false, date: { $lte: date }, "user_id": mongoose.Types.ObjectId(req.body.user_id) } },
          { $group: { _id: "$user_id", total: { $sum: "$amount" } } }
        ]).exec((error, resultPayment) => {
          if (error) {
            res.status(500).send({ success: false, error: error });
          } else {

            console.log("Result payment", resultPayment);
            // console.log("Total: " = resultPayment);
            if (resultPayment.length > 0) {

              debit = resultPayment[0]["total"]

              res.status(200).send({ success: true, balance: -(credit - debit) });

            } else {
              res.status(200).send({ success: true, balance: -(credit - debit) });
            }
          }
        })
      } else {
        console.log("in else no orders found");
        res.status(200).send({ success: true, balance: -(credit - debit) });
      }
    }
  })

}

exports.getAllCustomersAndDealers = function (req, res) {
  console.log("Request ::::", req.body);
  var query = {};
  if(req.body.isDeleted!=null && req.body.isDeleted!=undefined && req.body.isDeleted!=''){
    query = { type: { $in: ['dealer', 'end user'] }, isDeleted: req.body.isDeleted };
  }else{
    query = { type: { $in: ['dealer', 'end user'] } }
  }
  User.find(query).exec(function (error, result) {
    if (error) {
      console.log("Error : ",error)
      res.status(500).send({ success: false, error: error });
    } else {
      if (result.length > 0) {

        order.aggregate([
          { $group: { _id: "$user_id", total: { $sum: "$totalAmount" } } }
        ]).exec(function (error, resultOrder) {
          if (error) {
            res.status(500).send({ success: false, error: error });
          } else {
            if (resultOrder.length > 0) {
              payment.aggregate([
                { $match: { status: 'success', isDeleted: false } },
                { $group: { _id: "$user_id", total: { $sum: "$amount" } } }
              ]).exec(function (error, resultPayment) {
                if (error) {
                  res.status(500).send({ success: false, error: error });
                } else {
                  if (resultPayment.length > 0) {
                    result.forEach(function (i, idx, x) {
                      var orderAmount = resultOrder.find(function (element) {
                        return element._id == i._id;
                      });
                      if (orderAmount == undefined) {
                        orderAmount = 0;
                      }
                      var paymentAmount = resultPayment.find(function (element) {
                        return element._id == i._id;
                      });
                      if (paymentAmount == undefined) {
                        paymentAmount = 0;
                      }
                      //  console.log("before ::::: ",result[idx]['credit'])
                      result[idx]['credit'] = parseInt(orderAmount.total) - parseInt(paymentAmount.total);
                      //  console.log("after ::::: ",result[idx]['credit'])
                      if (idx == x.length - 1) {
                        res.status(200).send({ success: true, result: result });
                      }
                    })
                  } else {
                    res.status(200).send({ success: true, result: result });
                  }
                }
              })
            } else {
              console.log("in else no orders found");
              res.status(200).send({ success: true, result: result });
            }
          }
        })
      } else {
        res.status(403).send({ success: false, message: "Users not found." });
      }
    }
  })
}

exports.getAllDealers = function (req, res) {
  var query = { type: 'dealer'};
  req.body.type = 'dealer';
  console.log("Request ::",req.body);
  User.find(req.body).exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: result });
    }
  })

}


function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.createUser = async function (req, res) {
  console.log("Request :::::", req.body);
  params = req.body;
  if (req.user.type == 'manager' || req.user.type == 'super' || req.user.type == 'admin') { //
    User.find({}).exec(function (error, resultUser) { //(
      //  console.log("1********************* :::::", resultUser);
      if (error) {
        console.log("Error", error);
        res.status(500).send({ success: false, error: error });
      } else {
        if (req.body.type == 'dealer') {
          if(req.body.nic!=null && req.body.nic!=undefined && req.body.nic!=''){
            params.nic = req.body.nic;
          }
          var r = req.body.code = 'ATMS-D-' + resultUser.length;
          console.log("Code :::::", r);
          req.body.code = 'ATMS-D-' + resultUser.length;
          req.body.email = "dealer-" + makeid(5) + "@atms.pk";
          req.body.username = req.body.email;
        } else if (req.body.type == 'endUser') {
          req.body.code = 'ATMS-E-' + resultUser.length;
          req.body.username = req.body.code + "@atms.pk";
        } else if (req.body.type == 'end user') {
          req.body.code = 'ATMS-E-' + resultUser.length;
          req.body.username = req.body.code + "@atms.pk";
        } else if (req.body.type == 'admin') {
          req.body.code = 'ATMS-A-' + resultUser.length;
          req.body.username = req.body.code + "@atms.pk";
        } else if (req.body.type == 'transport manager') {
          req.body.code = 'ATMS-T-' + resultUser.length;
          req.body.username = req.body.code + "@atms.pk";
        } else if (req.body.type == 'customer') {
          req.body.code = 'ATMS-C-' + resultUser.length;
          req.body.username = req.body.code + "@atms.pk";
        } else if (req.body.type == 'super') {
          req.body.nic = "1234567890"
          req.body.code = 'ATMS-S-' + resultUser.length;
          req.body.username = req.body.code + "@atms.pk";
        } else if (req.body.type == 'financeManager') {
          req.body.nic = "1234567890"
          req.body.code = 'ATMS-F-' + resultUser.length;
          req.body.username = req.body.code + "@atms.pk";
        } else if (req.body.type == 'deliveryManager') {
          req.body.nic = "1234567890"
          req.body.code = 'ATMS-DM-' + resultUser.length;
          req.body.username = req.body.code + "@atms.pk";
        } else if (req.body.type == 'collectionManager') {
          req.body.nic = "1234567890"
          req.body.code = 'ATMS-CM-' + resultUser.length;
          req.body.username = req.body.code + "@atms.pk";
        } else if (req.body.type == 'driver') {
          req.body.nic = "1234567890"
          req.body.code = 'ATMS-Driver-' + resultUser.length;
          req.body.username = req.body.code + "@atms.pk";
        }
        //    req.body.username = req.body.email;
        if (req.body.email != null && req.body.email != undefined && req.body.email != '') {
          // if (req.body.nic != null && req.body.nic != undefined && req.body.nic != '' && req.body.nic != "1234567890") {
          if (req.body.nic != "1234567890") {
            //  req.body.username = req.body.email;
            User.findOne({ nic: req.body.nic }).exec(function (error, result) {
              if (error) {
                res.status(400).send({ success: false, message: error });
              } else {
                // if (result) {
                //   console.log("found");
                //   res.status(403).send({ success: false, message: "N.I.C already registered" });
                // } else {
                  // email query
                  User.findOne({ email: req.body.email }).exec(function (error, resultUser) {
                    if (error) { //if error
                      res.status(500).send({ success: false, error: error });
                    } else { //else if result -- already taken
                      if (resultUser) {
                        res.status(403).send({ success: false, message: "Email already taken." });
                      } else { //else create user
                        User.create(req.body).then(function (result) {
                          if (req.body.credit != null && req.body.credit != undefined && req.body.credit != '') {

                          } else {
                            req.body.credit = 0;
                          }
                          console.log("1");
                          var isActiveFiler = false;
                          var isFiler = false;
                          if (result.ntn != "") {
                            isFiler = true;
                          }
                          if (result.ntnStatus == "active") {
                            isActiveFiler = true;
                          }


                          util.createOpeningOrder(req.user._id, result._id, req.body.credit, isFiler, isActiveFiler).then(function (orderCreated) {
                            console.log("Order created 23::::::", orderCreated)
                            res.status(200).send({ success: true, result: result, order: orderCreated });
                          }).catch(function (error) {
                            res.status(500).send({ success: false, error: error, message: "error in creating opening balance order." });
                          })
                        }).catch(function (e) { //*
                          console.log("Error in creating user : ", e)
                          if (e.code && e.code == 11000) {
                            if (e.errmsg.indexOf('$email_1') > -1) {
                              res.status(422).send({ message: "Email already exists" });
                            } else if (e.errmsg.indexOf('$mobile_1') > -1) {
                              res.status(422).send({ message: "mobile number already exists" });
                            } else if (e.errmsg.indexOf('$username_1') > -1) {
                              res.status(422).send({ message: "username already exists" });
                            } else if (e.errmsg.indexOf('$nic_1') > -1) {
                              res.status(422).send({ message: "N.I.C number already exists" }); //<----------git
                            } else {
                              res.status(500).send({ error: e });
                            }
                          }
                        }); //*
                      }
                    }
                  })
                // }
              }
            })
          } else {
            User.create(req.body).then(function (result) {
              if (req.body.credit != null && req.body.credit != undefined && req.body.credit != '') {

              } else {
                req.body.credit = 0;
              }
              console.log("2");
              util.createOpeningOrder(req.user._id, result._id, req.body.credit).then(function (orderCreated) {
                res.status(200).send({ success: true, result: result, order: orderCreated });
              }).catch(function (error) {
                res.status(500).send({ success: false, error: error, message: "error in creating opening balance order." });
              })
            }).catch(function (e) { //*
              console.log("Error in creating user : ", e)
              if (e.code && e.code == 11000) {
                if (e.errmsg.indexOf('$email_1') > -1) {
                  res.status(422).send({ message: "Email already exists" });
                } else if (e.errmsg.indexOf('$mobile_1') > -1) {
                  res.status(422).send({ message: "mobile number already exists" });
                } else if (e.errmsg.indexOf('$username_1') > -1) {
                  res.status(422).send({ message: "username already exists" });
                } else if (e.errmsg.indexOf('$nic_1') > -1) {
                  res.status(422).send({ message: "N.I.C number already exists" }); //<----------git
                } else {
                  res.status(500).send({ error: e });
                }
              }
            }); //*
          }
        }
        else if (req.body.type == 'endUser' || req.body.type == 'end user') {
          req.body.username = parseInt(new Date(Date.now()).getTime());
          // if (req.body.nic != null && req.body.nic != undefined && req.body.nic != '' && req.body.nic != "1234567890") {
          if (req.body.nic != "1234567890") {

            User.findOne({ nic: req.body.nic }).exec(function (error, result) {
              if (error) {
                res.status(400).send({ success: false, message: error });
              } else {
                // if (result) {
                //   console.log("found");
                //   res.status(403).send({ success: false, message: "N.I.C already registered" });
                // } else {
                  User.create(req.body).then(function (result) {
                    if (req.body.credit != null && req.body.credit != undefined && req.body.credit != '') {

                    } else {
                      req.body.credit = 0;
                    }
                    util.createOpeningOrder(req.user._id, result._id, req.body.credit).then(function (orderCreated) {
                      res.status(200).send({ success: true, result: result, order: orderCreated });
                    }).catch(function (error) {
                      res.status(500).send({ success: false, error: error, message: "error in creating opening balance order." });
                    })
                  }).catch(function (e) { //*
                    console.log("Error in creating user : ", e)
                    if (e.code && e.code == 11000) {
                      if (e.errmsg.indexOf('$email_1') > -1) {
                        res.status(422).send({ message: "Email already exists" });
                      } else if (e.errmsg.indexOf('$mobile_1') > -1) {
                        res.status(422).send({ message: "mobile number already exists" });
                      } else if (e.errmsg.indexOf('$username_1') > -1) {
                        res.status(422).send({ message: "username number already exists" });
                      } else if (e.errmsg.indexOf('$nic_1') > -1) {
                        res.status(422).send({ message: "N.I.C number already exists" }); //<----------git
                      } else {
                        res.status(500).send({ error: e });
                      }
                    }
                  }); //*
                // }
              }
            })
          } else {
            User.create(req.body).then(function (result) {
              if (req.body.credit != null && req.body.credit != undefined && req.body.credit != '') {

              } else {
                req.body.credit = 0;
              }
              console.log("3");
              util.createOpeningOrder(req.user._id, result._id, req.body.credit).then(function (orderCreated) {
                res.status(200).send({ success: true, result: result, order: orderCreated });
              }).catch(function (error) {
                res.status(500).send({ success: false, error: error, message: "error in creating opening balance order." });
              })
            }).catch(function (e) { //*
              console.log("Error in creating user : ", e)
              if (e.code && e.code == 11000) {
                if (e.errmsg.indexOf('$email_1') > -1) {
                  res.status(422).send({ message: "Email already exists" });
                } else if (e.errmsg.indexOf('$mobile_1') > -1) {
                  res.status(422).send({ message: "mobile number already exists" });
                } else if (e.errmsg.indexOf('$username_1') > -1) {
                  res.status(422).send({ message: "username number already exists" });
                } else if (e.errmsg.indexOf('$nic_1') > -1) {
                  res.status(422).send({ message: "N.I.C number already exists" }); //<----------git
                } else {
                  res.status(500).send({ error: e });
                }
              }
            }); //*
          }
        } else {
          res.status(500).send({ success: false, error: "No email" })
        }
      }
    })
  }
  else {
    console.log("User Type", req.user.type);
    res.status(401).send({ success: false, message: "You are not authorized to perform this action." });

  }
}
// } else {
//   console.log("User Type", req.user.type);
//   res.status(401).send({ success: false, message: "You are not authorized to perform this action." });
// }


exports.createBank = function (req, res) {
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Request :: ", req.body);
  }
  if (req.body.name != null && req.body.name != undefined && req.body.name != '') {
    bank.create(req.body).then((result) => {
      res.status(200).send({ success: true, result: result });
    }).catch((error) => {
      console.log(error)
      res.status(500).send({ success: false, error: error })
    })
  } else {
    res.status(403).send({ success: false, message: "name required" })
  }
}

exports.updateBank = function (req, res) {
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Request :: ", req.body);
  }
  if (req.body.bank_id != null && req.body.bank_id != undefined && req.body.bank_id != '') {
    bank.update({ _id: req.body.bank_id }, req.body, { multi: false }).then((result) => {
      res.stauts(200).send({ success: true, result: result });
    }).catch((error) => {
      res.status(500).send({ success: false, error: error })
    })
  } else {
    res.status(403).send({ success: false, message: "bank_id required" });
  }
}

exports.createBankAccount = function (req, res) {
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Request :: ", req.body);
  }
  if (req.body.accountTitle != null && req.body.accountTitle != undefined && req.body.accountTitle != '') {
    if (req.body.accountNumber != null && req.body.accountNumber != undefined && req.body.accountNumber != '') {
      if (req.body.bank != null && req.body.bank != undefined && req.body.bank != '') {
        bankaccount.create(req.body).then((result) => {
          res.status(200).send({ success: true, result: result });
        }).catch((error) => {
          console.log(error)
          res.status(500).send({ success: false, error: error })
        })
      } else {
        res.status(403).send({ success: false, message: "bank required" })
      }
    } else {
      res.status(403).send({ success: false, message: "accountNumber required" })
    }
  } else {
    res.status(403).send({ success: false, message: "accountTitle required" })
  }
}

exports.updateBankAccount = function (req, res) {
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Request :: ", req.body);
  }
  if (req.body.account_id != null && req.body.account_id != undefined && req.body.account_id != '') {
    bankaccount.findOne({ _id: req.body.account_id }).exec(function (error, result) {
      if (error) {
        res.status(500).send({ success: false, error: error });
      } else {
        if (result) {
          result.accountTitle = req.body.accountTitle
          ? req.body.accountTitle
          : result.accountTitle;
          result.bank = req.body.bank
          ? req.body.bank
          : result.bank;
          result.branchCode = req.body.branchCode
          ? req.body.branchCode
          : result.branchCode;
          result.address = req.body.address
          ? req.body.address
          : result.address;
          result.accountNumber = req.body.accountNumber
          ? req.body.accountNumber
          : result.accountNumber;
          result.isDeleted = req.body.isDeleted
          ? req.body.isDeleted
          : result.isDeleted;

          result.save(function (error, saved) {
            if (error) {
              res.status(500).send({ success: false, error: error });
            } else {
              res.status(200).send({ success: true, result: saved, message: "Bank account updated successfully." });
            }
          })
        } else {
          res.status(403).send({ success: false, message: "Account details not found" });
        }
      }
    })
  } else {
    res.status(403).send({ success: false, message: "account id required." });
  }
}

exports.getCashInHandManagementHistory = function (req, res) {
  payment.aggregate([
    { $match: { status: 'success', isDeleted: false } },
    { $group: { _id: "$user_id", totalPayable: { $sum: "$amount" } } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    }, {
      $addFields: {
        name: "$user.name",
        email: "$user.email",
        credit: "$totalPayable",
        code: "$user.code",
        type: "$user.type",
        mobile: "$user.mobile"
      }
    }
  ]).exec(function (error, resultPayment) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: resultPayment });
    }
  })

}

exports.getSingleAccountDetails = function (req, res) {
  console.log("Request : ", req.body);
  if (req.body.account_id != null && req.body.account_id != undefined && req.body.account_id != '') {
    bankaccount.findOne({ _id: req.body.account_id }).populate("bank").exec(function (error, result) {
      if (error) {
        res.status(500).send({ success: false, error: error });
      } else {
        if (result) {
          res.status(200).send({ success: true, result: result });
        } else {
          res.status(403).send({ success: false, message: "Account details not found." });
        }
      }
    })
  } else {
    res.status(403).send({ success: false, message: "account id required." });
  }
}


module.demoUrl = function(req, res){
  console.log('PARAMS', req.params);
  res.status(200).send({success: false, response: 'Some demo response'});
}
