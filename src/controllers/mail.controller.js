const nodemailer = require('nodemailer');
const SendMailGiaSu = async (recipent, content, subject) => {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: 'vucong2018@gmail.com', // generated ethereal user
                pass: 'vkjomqjfrqwnenen'  // generated ethereal password},
            },
            debug: true
        });

        const mailOptions = {
            from: '', // Google turned off feature
            cc: '',
            to: recipent,
            subject: subject,
            text: content, // Content Text
            html: null, // Content  HTML
            attachments: null // Attachments File
        };
        transporter.sendMail(mailOptions, error => {
            if (error) {
                console.error(error);
                if (errorCallback) errorCallback(error);
                reject(error);
            } else {
                console.log('Send mail to ' + 'cong.vupt1812@hcmut.edu.vn' + ' successful.');
                if (successCallback) successCallback();
                resolve();
            }
        });
        return {};
    }
    catch (error) {
        return error;
    }
}

module.exports = SendMailGiaSu