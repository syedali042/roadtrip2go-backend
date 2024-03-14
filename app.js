require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {bookingTunnel} = require('./booking');
const app = express();

app.use(cors({origin: true, credentials: true}));
app.use(express.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));

app.post('/hotels', async (req, res) => {
  try {
    const data = req.body.data;
    const {response, error} = await bookingTunnel({data});
    if (error)
      res.send({status: 400, message: error || 'Something went wrong'});
    res.send({status: 200, response});
  } catch (error) {
    console.log(error);
    res.send({status: 400, message: 'Internal Server Error'});
  }
});

app.listen(5500, () => {
  console.log(`Server is listening on port ${5500}`);
});
