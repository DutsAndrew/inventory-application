const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  description: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 1000,
  },
  cost: {
    type: Number,
    required: true,
    minLength: 1,
    maxLength: 10000,
  },
  amount: {
    type: Number,
    required: true,
    minLength: 0,
    maxLength: 10000,
  },
  reviews: {
    type: Number,
    required: false,
    minLength: 0,
    maxLength: 1,
  },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    }
  ],
});

ItemSchema.virtual("url").get(function () {
  return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema)