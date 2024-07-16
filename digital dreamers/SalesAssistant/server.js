const express = require('express');
const app = express();

const nodemailer = require('nodemailer')

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static('public'));
app.use(express.json())

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/public/ATM.html')
})

app.post('/', (req, res)=>{
    console.log(req.body);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'salesassisttinkerhack@gmail.com',
            pass: 'Password@234'
        }
    })

    const mailOptions = {
        from: req.body.email,
        to: req.body.email,
        subject: 'Meeting alert',
        text: `Meeting on ${req.body.meetingDate}, ${req.body.remainder} minutes remaining!`
    }

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error);
            res.send('error');
        }else{
            console.log('Email send: ' + info.response);
            res.send('success')
        }
    })
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})