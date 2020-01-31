// // import external moduels
// ==========================================================================
require('dotenv').config();
var app = require('express')();
var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var user = require('./models/user.js');
const passport = require('passport');
var multer = require('multer');
var fs = require('fs');
var ejs = require('ejs');
var path = require('path'); // node path module
var port = process.env.PORT || 1339;
var cookieParser = require('cookie-parser')
var cors = require('cors');
app.use(cors());
var cron = require('node-cron');
var tax = require('./api/tax.js');
var json2xls = require('json2xls');
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));
// initialize variables
// ==============================================================================
app.set('view engine', 'ejs');
mongoose.Promise = global.Promise; // fix for "DeprecationWarning: Mongoose: mpromise replacement"
// set envrioment variables if production is false
if (process.env.NODE_ENV !== 'production') {
  process.env.url = 'http://localhost:3000/'; //  Development
  process.env.jwtsecret = process.env.jwtsecret1;
}
  app.use(json2xls.middleware);
// database connection
// =============================================================================
// = ==========


mongoose.connect(process.env.MONGODB_URI,
  {
    useMongoClient: true ,
    poolSize: 200,
    keepAlive: 300000,
  }); // database conneciton to azure pro database
  mongoose
  .connection
  .once('connected', () => console.log('Connected to database'));
  app.get('/getRes',function(req,res){
    var request = require("request");

    var options = { method: 'POST',
      url: 'http://atms-dev.herokuapp.com/collectionReport',
      headers:
       { 'cache-control': 'no-cache',
         'content-type': 'application/json' },
      body:
       { to: '2019-09-27T07:23:24.105Z',
         from: '2018-12-31T14:00:00.000Z',
         user_id: '' },
      json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      res.send(body)
    });
  })

  // configure middlewear
  // =============================================================================
  // = logger
  app.use(morgan('dev'));
  // json manipulation on server side
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  // passport initializtion routes
  // =============================================================================
  // = ==
  var cloudinary=require('cloudinary');
  var multer=require('multer');
  cloudinary.config(process.env.CLOUDINARY_URL);

app.get('/demoUrl',function(req, res){
    console.log('PARAMS', req.params);
    console.log('_______________________________________');
    console.log('BODY', req.body);

    res.status(200).send({
        params: req.params,
        body: req.body
    })
});

app.post('/demoUrl',function(req, res){
    console.log('PARAMS', req.params);
    console.log('_______________________________________');
    console.log('BODY', req.body);

    res.status(200).send({
        params: req.params,
        body: req.body
    })
});

app.get('/exportLedgerFile',tax.exportLedgerFile);
  var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads')
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + file.originalname)
    }
  })


  var upload = multer({ storage: storage }).single('userFile');
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.use('/uploadNICScan/:id',function(req,res){
    if(process.env.DEBUG_LOGS == true || process.env.DEBUG_LOGS == 'true'){
      console.log("Request : ",req.file);
    }

    if(req.params.id!=null && req.params.id!=undefined && req.params.id!=''){
      upload(req,res, function(error){
        if (!req.file) {
          res.status(403).send({message : 'Please upload a image file'});
        }else{
          cloudinary.uploader.upload(req.file.path, function(cloudinaryResult){
            // result.img=cloudinaryResult.url;
            // result.save(function(error,done){
            //   if(error){
            //     res.status(500).send({error: error});
            //   }else {
            user.findOne({_id:req.params.id}).exec(function(error,answer){
              if(error){
                res.status(500).send({error: error});
              }else {
                if(answer){
                  answer.nicScan=cloudinaryResult.url;
                  answer.save(function(error,done){
                    if(error){
                      res.status(500).send({error: error});
                    }else{
                      res.status(200).send({message: "NIC Picture Uploaded successfully", promo:answer });
                    }

                  })
                }else{
                  res.status(403).send({success:false,message : "User not found"});
                }
              }
            })
            // }
            // })
          });
        }  })
      }else{
        res.status(403).send({success:false , message : "User id required."})
      }
    })

    cron.schedule('0 0 1 * * *',function(){
      console.log("******************************************************************");
      console.log("****************           CRON JOB STARTED        ***************");
      console.log("***************           Tax creation Job        ***************");
      console.log("*****************************************************************");
      var tax = require('./models/tax.js');
      tax.findOne({}).sort({date:-1}).exec(function(error,result){
        if(error){
          console.log(error);
        }else{
          console.log(new Date().getTime(),new Date(result.date).getTime());
          if(new Date().getTime() - new Date(result.date).getTime()>0){
            console.log("Cron Yes");
            var day = (new Date().getTime() - new Date(result.date).getTime())/86400000;
            day = parseInt(day);
            for(var i = 0; i<day ; i++){
              console.log("Loop Started ::::",i);
              tax.insertMany([{
                "description" : "Genral sails tax",
                "date" : new Date(new Date(new Date(result.date).getTime()+(i*86400000)+86400000).toISOString().split("T")[0]+"T01:00:00.000Z"),
                "rate" : 17,
                "type" : "gst"
              },{
                "description" : "Withholding tax",
                "date" : new Date(new Date(new Date(result.date).getTime()+(i*86400000)+86400000).toISOString().split("T")[0]+"T01:00:00.000Z"),
                "rate" : 0.17,
                "type" : "wht"
              },{
                "description" : "Filler With advance tax",
                "date" : new Date(new Date(new Date(result.date).getTime()+(i*86400000)+86400000).toISOString().split("T")[0]+"T01:00:00.000Z"),
                "rate" : 0.5,
                "type" : "fat"
              },{
                "description" : "Non Filler advance tax",
                "date" : new Date(new Date(new Date(result.date).getTime()+(i*86400000)+86400000).toISOString().split("T")[0]+"T01:00:00.000Z"),
                "rate" : 1.0,
                "type" : "nfat"
              },{
                "description" : "MRP",
                "date" : new Date(new Date(new Date(result.date).getTime()+(i*86400000)+86400000).toISOString().split("T")[0]+"T01:00:00.000Z"),
                "rate" : 600,
                "type" : "mrp"
              }]).then(function(result){
                console.log(result)
              });

            }
          }
        }
      })
    })

// console.log("My Current Date ::::",new Date());

    app.use('/', require('./routes/unauthenticated.js')); //routes which does't require token authentication
    require('./config/passport')(passport);
    app.use('/api', passport.authenticate('jwt', { session: false }), require('./routes/authenticated.js'));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });

    app.get('*', (req, res) => res.status(404).send({ error: 'page not found' }));
    app.listen(port, function () {
      console.log('listening on *:', port);
    });
