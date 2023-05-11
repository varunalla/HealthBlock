const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/keys', async (req, res) => {
  console.log("/keys api is called")
  try {
    const response = await axios.get('http://127.0.0.1:5001/keys', {
    headers: {
        'Content-Type': 'application/json'
      }
    });
    res.setHeader('Content-Type', 'application/json');
    const data = response.data;
    console.log("successfully got data")
    console.log(data)
    res.status(200).json(data);
  } catch (error) {
    console.log("Error from keys api to python")
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

router.post('/encrypt', async (req, res) => {
  const { aesKey, private_key, public_key, signing_key } = req.body;
  try {
    const response = await axios.post('http://127.0.0.1:5001/encrypt', {
      aesKey,
      private_key,
      public_key,
      signing_key
    });

    res.send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/reencrypt', async (req, res) => {
  const { capsule, private_key, public_key, signing_key } = req.body;
  try {
    console.log("public_key:",public_key)
    const response = await axios.post('http://127.0.0.1:5001/reencrypt', {
      capsule:capsule,
      private_key:private_key,
      public_key:public_key,
      signing_key:signing_key
    });

    res.send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/decryptReencrypt', async (req, res) => {
  const { private_key, public_key, capsule, ciphertext, cfrags } = req.body;

  try {
    // const cfrags_verified = cfrags.map(cfrag => VerifiedCapsuleFrag.fromVerifiedBytes(Buffer.from(cfrag, 'base64')));
    const response = await axios.post('http://127.0.0.1:5001/decryptReencrypt', {
      private_key: private_key,
      public_key: public_key,
      capsule: capsule,
      ciphertext:ciphertext,
      cfrags:cfrags
    });
    console.log(response.data)
    res.send(response.data);
  } catch (err) {
    res.status(500).send(err);
  }
});




module.exports = router;
