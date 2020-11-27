var express = require('express');
var router = express.Router();

const userRouter = require('./modules/user/routes');
const itemRouter = require('./modules/item/routes');

router.get('/', function (req, res, next) {
  res.send('Hello v1.0 GET API from RentingAPI');
});

router.post('/', function (req, res, next) {
  res.send('Hello v1.0 POST API from RentingAPI');
});

router.use('/user', userRouter);
router.use('/item', itemRouter)

module.exports = router;
