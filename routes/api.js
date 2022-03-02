const express = require('express');
const router = express.Router();
const cors = require('cors');
const { CredentialsServiceClient, Credentials } = require("@trinsic/service-clients");
const cache = require('../model');
const Student = require('../models/student');

require('dotenv').config();

const client = new CredentialsServiceClient(
    new Credentials(process.env.ACCESSTOK),
    { noRetryPolicy: true });

const getInvite = async () => {
  try {
    return await client.createConnection({});
  } catch (e) {
    console.log(e.message || e.toString());
  }
}

router.post('/store', cors(), async function (req, res) {
  const student = new Student({
    name: req.body.name,
    rollno: req.body.rollno,
    college: req.body.college,
    aadhar: req.body.aadhar,
    phone: req.body.phone,
    email: req.body.email,
    otp: req.body.otp
  });

  await student.save();
  
  const invite = await getInvite();
  res.status(200).send({ invitation: invite.invitationUrl });
});

module.exports = router;