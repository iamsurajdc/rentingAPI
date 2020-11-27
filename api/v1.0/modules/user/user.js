const functions = require('../../../../common/functions');
const config = require('../../../../config');
const validator = require('validator');
const statusCode = require('../../../../common/statusCode');
const message = require('../../../../common/message');
const fs = require('fs');
const db = require(`./database/${config.database}/${config.database}`);

class UserService {
  /**
   * API for user registration
   * @param {*} req (user detials)
   * @param {*} res (json with success/failure)
   */
  async registration(info) {
    try {
      if (
        !validator.isEmail(info.emailAddress) ||
        validator.isEmpty(info.userPassword) ||
        validator.isEmpty(info.fullName) ||
        validator.isEmpty(info.mobileNumber)
      ) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: null,
        };
      }

      const checkIfuserExists = await db.userDatabase().checkIfuserExists(info);

      if (checkIfuserExists.length > 0) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.duplicateDetails,
          data: null,
        };
      }

      info.userPassword = functions.encryptPassword(info.userPassword);

      const userRegistration = await db.userDatabase().userRegistration(info);

      let token = await functions.tokenEncrypt(info.emailAddress);
      token = Buffer.from(token, 'ascii').toString('hex');
      let emailMessage = fs
        .readFileSync('./common/emailtemplate/welcome.html', 'utf8')
        .toString();
      emailMessage = emailMessage
        .replace('$fullname', info.fullName)
        .replace('$link', config.emailVerificationLink + token);

      functions.sendEmail(
        info.emailAddress,
        message.registrationEmailSubject,
        emailMessage
      );
      return {
        statusCode: statusCode.success,
        message: message.registration,
        data: userRegistration,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * API for user login
   * @param {*} req (email address & password)
   * @param {*} res (json with success/failure)
   */
  async login(info) {
    try {
      if (!validator.isEmail(info.emailAddress)) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.invalidLoginDetails,
          data: null,
        };
      }

      const loginDetails = await db.userDatabase().getUser(info.emailAddress);

      if (loginDetails.length <= 0) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.invalidLoginDetails,
          data: null,
        };
      }
      const password = functions.decryptPassword(loginDetails[0].userPassword);
      if (password !== info.userPassword) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.invalidLoginDetails,
          data: null,
        };
      }

      if (loginDetails[0].isActive !== 1 || loginDetails[0].isDeleted !== 0) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.accountDisable,
          data: null,
        };
      }

      if (loginDetails[0].isEmailVerified === 0) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.emailVerify,
          data: null,
        };
      }

      const userDetails = {
        fullName: loginDetails[0].fullName,
        emailAddress: loginDetails[0].emailAddress,
        mobileNumber: loginDetails[0].mobileNumber,
      };

      const token = await functions.tokenEncrypt(userDetails);

      userDetails.token = token;

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: userDetails,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

    /**
   * API for deleting user
   * @param {*} req (email address & password)
   * @param {*} res (json with success/failure)
   */
  async deleteUser(info) {
    try {
      if (!validator.isEmail(info.emailAddress)) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.invalidLoginDetails,
          data: null,
        };
      }

      const deleteUserDetails = await db.userDatabase().deleteUser(info.emailAddress);

      if (deleteUserDetails.length <= 0) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.invaliddeleteUserDetails,
          data: null,
        };
      }

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: null,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * API for user history
   * @param {*} req (userId)
   * @param {*} res (json with success/failure)
   */
  async getProfile(emailAdress) {
    try {
      const getProfileDetails = await db.userDatabase().getUser(emailAdress);
      if (getProfileDetails.length > 0) {
        const userDetails = {
          fullName: getProfileDetails[0].fullName,
          emailAddress: getProfileDetails[0].emailAddress,
          mobileNumber: getProfileDetails[0].mobileNumber,
        };
        return {
          statusCode: statusCode.success,
          message: message.success,
          data: userDetails,
        };
      } else {
        return {
          statusCode: statusCode.bad_request,
          message: message.noData,
          data: null,
        };
      }
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * API to update profile
   * @param {*} req (token, user information )
   * @param {*} res (json with success/failure)
   */
  async updateProfile(userId, info) {
    try {
      if (validator.isEmpty(info.fullName)) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.allFieldReq,
          data: null,
        };
      }

      const userDetail = await db.userDatabase().updateUser(userId, info);

      return {
        statusCode: statusCode.success,
        message: message.profileUpdate,
        data: userDetail,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

}

module.exports = {
  userService: function () {
    return new UserService();
  },
};
