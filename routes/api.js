const express = require('express');
const router = express.Router();
const cors = require('cors');
const { CredentialsServiceClient, Credentials } = require("@trinsic/service-clients");
const cache = require('../model');
const Student = require('../models/student');
const mapper = require('../models/mapper');

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


router.post('/loginreq', cors(), async (req, res) => {
  let callback = req.body.callback;
  let verification = await client.createVerificationFromPolicy(process.env.POLICY_ID);

  console.log(verification);

  mapper.mapData[verification.verificationRequestUrl] = callback;

  res.status(200).send({
    verificationRequestData: verification.verificationRequestData,
    verificationRequestUrl: verification.verificationRequestUrl,
    verificationId: verification.verificationId
  });
});

module.exports = router;