const object = require('./item');
const functions = require('../../../../common/functions');

const controller = {
  // Item Creation API
  createItem: async (req, res, next) => {
    try {
      const createItemDetails = await object
        .itemService()
        .createItem(res.locals.requestedData);
      res.send(
        functions.responseGenerator(
          createItemDetails.statusCode,
          createItemDetails.message,
          createItemDetails.data
        )
      );
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = controller;
