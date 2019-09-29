
const mailgun = require("mailgun-js");

const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});


module.exports = function(agenda) {
    agenda.define('email task', function(job, done) {

    	console.log("in task"); 
        var data = job.attrs.data; 

        mg.messages().send(data, function (error, body) {
            console.log(body); 
        });

    });
};