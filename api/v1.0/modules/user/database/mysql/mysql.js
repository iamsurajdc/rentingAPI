const con = require('../../../../../../common/database/mysql');
const util = require('util');
const query = util.promisify(con.query).bind(con);
const { databaseInitial } = require('../../../../../../config');
const { connection_failed } = require('../../../../../../common/statusCode');

class UserDatabase {
  /**
   * Database call to check if user exists
   * @param {*} req (email address & mobileNumber)
   * @param {*} res (json with success/failure)
   */
  async checkIfuserExists(info) {
    try {
      const sqlSelectQuery = `SELECT * FROM ${databaseInitial}user WHERE emailAddress = ? OR mobileNumber = ?`;
      const details = await query(sqlSelectQuery, [
        info.emailAddress,
        info.mobileNumber,
      ]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for inserting user information
   * @param {*} req (user details)
   * @param {*} res (json with success/failure)
   */
  async userRegistration(info) {
    try {
      const sqlInsertQuery = `INSERT INTO ${databaseInitial}user(fullName, emailAddress, userPassword, mobileNumber) VALUES (?, ?, ?, ?)`;
      const details = await query(sqlInsertQuery, [
        info.fullName,
        info.emailAddress,
        info.userPassword,
        info.mobileNumber,
      ]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for selecting user details for login
   * @param {*} req (emailAddress)
   * @param {*} res (json with success/failure)
   */
  async getUser(emailAddress) {
    try {
      const sqlSelectQuery = `
        SELECT id, fullName, emailAddress, userPassword, mobileNumber, isEmailVerified, isActive, isDeleted 
        FROM ${databaseInitial}user 
        WHERE emailAddress = ?`;
      const details = await query(sqlSelectQuery, [emailAddress]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }


  /**
   * Database call for updating userdetails
   * @param {*} req (emailAddress)
   * @param {*} res (json with success/failure)
   */
  async updateUser(emailAddress, info) {
    try {
      const sqlUpdateQuery = `UPDATE ${databaseInitial}user SET fullName = ? WHERE emailAddress = ?`;
      const details = await query(sqlUpdateQuery, [
        info.fullName,
        emailAddress,
      ]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }


  /**
   * Database call for deleteing user
   * @param {*} req (emailAddress)
   * @param {*} res (json with success/failure)
   */
  async deleteUser(emailAddress) {
    try {
      const sqlUpdateQuery = `UPDATE ${databaseInitial}user SET isDeleted = ? WHERE emailAddress = ?`;
      const details = await query(sqlUpdateQuery, [
        1,
        emailAddress,
      ]);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

}

module.exports = {
  userDatabase: function () {
    return new UserDatabase();
  },
};
