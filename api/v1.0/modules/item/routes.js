const router = require('express').Router();
const api = require('./controller');
const auth = require('../../../../common/authentication');

// Middle layer for Item API
router.post('/createItem', auth.decryptRequest, api.createItem);

module.exports = router;
