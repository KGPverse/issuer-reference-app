const express = require('express');
const router = express.Router();
const { CredentialsServiceClient, Credentials } = require("@trinsic/service-clients");
const Student = require('../models/student');
const cache = require('../model');
const mapper = require('../models/mapper');
const axios = require('axios');

require('dotenv').config();

const client = new CredentialsServiceClient(
  new Credentials(process.env.ACCESSTOK),
  { noRetryPolicy: true });

/* GET home page */
router.get('/', function (req, res, next) {
  res.render('index');
});

/* Webhook endpoint */
router.post('/webhook', async function (req, res) {
  try {
    console.log("got webhook");
    console.log(req.body);
    if (req.body.message_type === 'new_inbox_message') {
      console.log("new connection notification");
      console.log(req.body.data.ConnectionId);
      let msg = await client.getMessage(req.body.object_id);
      console.log(msg);
      let arr = msg.text.split(" ");
      if (!(arr.length == 4 && arr[0] == "GEN")){
        return;
      }
      let rollno = arr[1];
      let college = arr[2];
      let otp = arr[3];

      let students = await Student.find({
        rollno: rollno,
        college: college
      });

      if (students.length != 1){
        return;
      }

      let stu = students[0];

      if (stu.otp != otp){
        return;
      }

      let params = {
        definitionId: process.env.CRED_DEF_ID,
        connectionId: req.body.data.ConnectionId,
        automaticIssuance: true,
        credentialValues: {
          "Full Name": stu.name,
          "Roll Number": stu.rollno,
          "College": stu.college,
          "Aadhar": stu.aadhar,
          "Phone": stu.phone,
          "Email": stu.email,
          "Account ID": `${stu.rollno}-${stu.college}-${stu.aadhar}`
        }
      }

      console.log(params);
      await client.createCredential(params);
    }else if (req.body.message_type === 'verification') {
      let verification = await client.getVerification(req.body.object_id);
      console.log(verification);

      let vUrl = verification.verificationRequestUrl;
      let status = verification.state;

      if (status !== "Accepted"){
        console.log("Defeat", status);
        return;
      }

      let callback = mapper.mapData[vUrl];
      let resp = await axios.post(callback, {
        status: "Accepted",
        attributes: verification.proof
      });
      console.log(resp.data);
      
    }
  }
  catch (e) {
    console.log(e.message || e.toString());
  }
});

module.exports = router;
