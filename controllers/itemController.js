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

exports.item_detail = (req, res) => {
  res.send('Not Implemented');
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