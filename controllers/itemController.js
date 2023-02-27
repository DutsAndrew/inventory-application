const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require('express-validator');

exports.item_list = (req, res, next) => {
  Item.find()
    .sort({ name: 1 })
    .exec(function (err, item_list) {
      if (err) return next(err);
      res.render("all_items", {
        title: "All Items in Inventory",
        items: item_list,
      });
    });
};

exports.item_detail = (req, res, next) => {
  async.waterfall([
    // Fetch the item by ID and populate its fields
    (callback) => {
      Item.findById(req.params.id)
        .populate("name")
        .populate("description")
        .populate("cost")
        .populate("amount")
        .exec((err, item) => {
          if (err) return callback(err);
          callback(null, item);
        });
    },
    // Fetch the category by ID and return the item and category objects
    (item, callback) => {
      Category.findById(item.category)
        .exec((err, category) => {
          if (err) return callback(err);
          callback(null, item, category);
        });
    },
  ], (err, item, category) => {
    if (err) return next(err);
    res.render("item_detail", {
      title: "Item View",
      item: item,
      category: category,
    });
  });
};

exports.item_create_get = (req, res) => {
  res.send('Not Implemented');
};

exports.item_create_post = (req, res) => {
  res.send('Not Implemented');
};

exports.item_delete_get = (req, res) => {
  res.send('Not Implemented');
};

exports.item_delete_post = (req, res) => {
  res.send('Not Implemented');
};

exports.item_update_get = (req, res) => {
  res.send('Not Implemented');
};

exports.item_update_post = (req, res) => {
  res.send('Not Implemented');
};