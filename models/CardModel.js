const mongoose = require("mongoose");
const { Schema } = mongoose;

const CardSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const CardModel = mongoose.model("Cards", CardSchema);
module.exports = CardModel;
