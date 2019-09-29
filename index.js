// FileName: index.js

require('dotenv').config()

// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
// Initialise the app
let app = express();

// Import routes
let apiRoutes = require("./api/routes");
const usersRoute = require("./auth/userRoutes");

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Connect to Mongoose and set connection variable
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8080;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept, X-CSRFToken, x-access-token");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST");
    next();
});

// Send message for default URL
app.get('/', (req, res) => res.send('SRLUI Hello World'));

// Set api routes
app.use('/api', apiRoutes);
app.use("/api/users", usersRoute);

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});