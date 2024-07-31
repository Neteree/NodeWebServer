const mongoose = require("mongoose");
const cards = require("./data/cards.json");
const CardModel = require("./models/CardModel");

const { MongoMemoryServer } = require("mongodb-memory-server");

let instance;

beforeAll(async () => {
  instance = await MongoMemoryServer.create();
  await mongoose.connect(instance.getUri());
  // mongoose does not support the "$oid" syntax in the JSON
  // so replace it with a mongoose ObjectId
  const cardsWithObjectId = cards.map((card) => {
    return {
      ...card,
      _id: new mongoose.Types.ObjectId(card._id.$oid),
    };
  });

  await CardModel.collection.insertMany(cardsWithObjectId);
});

afterAll(async () => {
  await mongoose.disconnect();
  await instance.stop();
});
