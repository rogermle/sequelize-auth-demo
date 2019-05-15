const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const env = require('dotenv').config();

const passport   = require('passport');
const session    = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars')
const flash = require('connect-flash');

//Models
const db = require("./models");

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(flash());

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
 
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized: true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//Sync Database
db.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});

const authRoute = require('./routes/auth.js')(app, passport);

//load passport strategies
require('./config/passport/passport.js')(passport);

app.get('/', function(req, res) {
    console.log(req.user);
    res.render('home');
});
 
app.listen(PORT, function(err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
});