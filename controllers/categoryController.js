const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require('express-validator');

exports.index = (req, res, next) => {
  async.parallel(
    {
      category_count(callback) {
        Category.countDocuments({}, callback);
        // empty object is passed to match condition to find all documents of this collection
      },
      item_count(callback) {
        Item.countDocuments({}, callback);
      },
      category_list(callback) {
        Category.find({})
          .sort({ name: 1 })
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results === null) {
        const err = new Error("Inventory counts could not be found");
        err.status = 404;
        return next(err);
      };
      res.render("index", {
        title: "Virg's Coffee",
        data: results,
        categories: results.category_list,
      });
    }
  );
};

exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      items(callback) {
        Item.find({ category: req.params.id})
          .sort({ name: 1 })
          .exec(callback);
      },
      category(callback) {
        Category.findById(req.params.id)
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      res.render("item_list", {
        title: results.category.name,
        items: results.items,
      });
    }
  );
};

exports.category_admin_options_list = (req, res, next) => {
  Category.find()
    .sort({ name: 1 })
    .exec((err, results) => {
      if (err) return next(err);
      res.render("admin_category_options", {
        title: "Categories Admin Access",
        categories: results,
      });
    });
};

exports.category_create_get = (req, res) => {
  res.send('Not Implemented');
};

exports.category_create_post = (req, res) => {
  res.send('Not Implemented');
};

exports.category_delete_get = (req, res) => {
  res.send('Not Implemented');
};

exports.category_delete_post = (req, res) => {
  res.send('Not Implemented');
};

exports.category_update_get = (req, res) => {
  res.send('Not Implemented');
};

exports.category_update_post = (req, res) => {
  res.send('Not Implemented');
};