"strict mode";

var request = require('request');
var moment = require('moment');
var nodemailer = require('nodemailer');
var config = require('./config');
var secure = require('./secure');

var kkm_check_url = config.url.replace('CARD', config.cityCardNumber).replace('IDENTITY', config.identityNumber);

request.get(kkm_check_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

        var position = body.indexOf(config.endDateRowBeginning);
        var found = body.slice(position, position + 50).match(config.dateRegexp);

        var now = moment();
        var endDate = moment(found[0]);
        var howManyDaysLeft = endDate.diff(now, 'days');

        if (howManyDaysLeft < config.alarmPeriod) {
            console.log('Days left for the current ticket: ', howManyDaysLeft);

            var transportUrl = 'smtps://' + secure.user + ':' + secure.pass + '@' + secure.domain;
            var transporter = nodemailer.createTransport(transportUrl);

            var mailOptions = {
                from: secure.mail.from,
                to: secure.mail.to,
                subject: 'Your KKM is about to expire (' + howManyDaysLeft + ' days)',
                text: 'Hi!\nYour KKM will expire in ' + howManyDaysLeft + ' days (' + endDate.format('D.MM.YYYY') + ').'
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });
        }
    }
});
