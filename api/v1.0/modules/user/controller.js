const object = require('./user');
const functions = require('../../../../common/functions');

const controller = {
  //User Registration API
  registration: async (req, res, next) => {
    try {
      const registrationDetails = await object
        .userService()
        .registration(res.locals.requestedData);
      res.send(
        functions.responseGenerator(
          registrationDetails.statusCode,
          registrationDetails.message,
          registrationDetails.data
        )
      );
    } catch (error) {
      return next(error);
    }
  },

  //Login API
  login: async (req, res, next) => {
    try {
      const loginDetails = await object
        .userService()
        .login(res.locals.requestedData);
      res.send(
        functions.responseGenerator(
          loginDetails.statusCode,
          loginDetails.message,
          loginDetails.data
        )
      );
    } catch (error) {
      return next(error);
    }
  },

  
  //Delete user API
  deleteUser: async (req, res, next) => {
    try {
      const deleteUserDetails = await object
        .userService()
        .deleteUser(res.locals.requestedData);
      res.send(
        functions.responseGenerator(
          deleteUserDetails.statusCode,
          deleteUserDetails.message,
          deleteUserDetails.data
        )
      );
    } catch (error) {
      return next(error);
    }
  },

  // Get Profile API
  getProfile: async (req, res, next) => {
    try {
      const userInformationDetails = await object
        .userService()
        .getProfile(res.locals.tokenInfo.emailAddress);
      res.send(
        functions.responseGenerator(
          userInformationDetails.statusCode,
          userInformationDetails.message,
          userInformationDetails.data
        )
      );
    } catch (error) {
      return next(error);
    }
  },

  // Update Profile API
  updateProfile: async (req, res, next) => {
    try {
      const updateProfileDetails = await object
        .userService()
        .updateProfile(
          res.locals.tokenInfo.emailAddress,
          res.locals.requestedData
        );
      res.send(
        functions.responseGenerator(
          updateProfileDetails.statusCode,
          updateProfileDetails.message,
          updateProfileDetails.data
        )
      );
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = controller;
