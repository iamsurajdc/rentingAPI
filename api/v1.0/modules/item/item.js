const functions = require('../../../../common/functions');
const config = require('../../../../config');
const validator = require('validator');
const statusCode = require('../../../../common/statusCode');
const message = require('../../../../common/message');
const fs = require('fs');
const db = require(`./database/${config.database}/${config.database}`);

class ItemService {
  /**
   * API for user Item Creation
   * @param {*} req (user detials)
   * @param {*} res (json with success/failure)
   */
  async createItem(info) {
    try {
      if (
        (!info.itemId) ||
        validator.isEmpty(info.itemName) ||
        validator.isEmpty(info.rentPrice) ||
        validator.isEmpty(info.manufactureDate)
      ) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: null,
        };
      }

      const checkIfItemExists = await db.itemDatabase().checkIfItemExists(info);

      if (checkIfItemExists.length > 0) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.itemExists,
          data: null,
        };
      }

      const createItem = await db.itemDatabase().createItem(info);

      return {
        statusCode: statusCode.success,
        message: message.itemAdded,
        data: createItem,
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
  itemService: function () {
    return new ItemService();
  },
};
