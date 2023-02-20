const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemInstanceSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Sold Out", "Not in Stock", "No Longer Carried"],
    default: "Maintenance",
  },
});

ItemInstanceSchema.virtual("url").get(function () {
  return `/inventory/iteminstance/${this._id}`;
});

module.exports = mongoose.model("ItemInstance", ItemInstanceSchema);