const router = require('express').Router();
const api = require('./controller');
const auth = require('../../../../common/authentication');

// Middle layer for User API
router.post('/registration', auth.decryptRequest, api.registration);
router.post('/login', auth.decryptRequest, api.login);
router.delete('/deleteUser', auth.decryptRequest, api.deleteUser);
router.get('/profile', auth.validateToken, api.getProfile);
router.put(
  '/profile',
  auth.validateToken,
  auth.decryptRequest,
  api.updateProfile
);

module.exports = router;
