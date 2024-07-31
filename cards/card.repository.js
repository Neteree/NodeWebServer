const CardModel = require("../models/CardModel");

cardRepository = {
  readCards: async () => {
    try {
      const cards = await CardModel.find();
      return cards;
    } catch (error) {
      throw Error(error);
    }
  },
  filterCardsByContent: async (content, page, limit) => {
    try {
      const cards = await CardModel.find({
        content: { $regex: new RegExp(content, "i") },
      })
        .skip((page - 1) * limit)
        .limit(limit);

      return cards;
    } catch (error) {
      throw Error(error);
    }
  },
  createCard: async (content) => {
    try {
      const card = new CardModel({ content });
      await card.save();
      return card;
    } catch (error) {
      throw Error(error);
    }
  },
  updateCard: async (cardAfterUpdated) => {
    try {
      const card = await CardModel.findByIdAndUpdate(
        cardAfterUpdated._id,
        cardAfterUpdated
      );

      return { card, cardAfterUpdated };
    } catch (error) {
      throw Error(error);
    }
  },

  deleteCard: async (_id) => {
    try {
      const card = await CardModel.findByIdAndDelete(_id);
      return card;
    } catch (error) {
      throw Error(error);
    }
  },

  deleteFilteredCards: async (_ids) => {
    try {
      const cards = await CardModel.find({ _id: { $in: _ids } });
      await CardModel.deleteMany({ _id: { $in: _ids } });
      return cards;
    } catch (error) {
      throw Error(error);
    }
  },
};

module.exports = cardRepository;
