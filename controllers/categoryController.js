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

exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category"});
};

exports.category_create_post = [
  body("name", "Category name required")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlpha()
    .withMessage("Categories cannot be in non-alpha characters."),
  (req, res, next) => {
    const errors = validationResult(req),
          category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      Category.findOne({ name: req.body.name })
        .exec((err, found_category) => {
          if (err) return next(err);
          if (found_category) {
            res.redirect(found_category.url);
          } else {
            category.save((err) => {
              if (err) return next(err);
              res.redirect(category.url);
            });
          }
        });
    };
  }
];

exports.category_delete_get = (req, res, next) => {
  Category.findById(req.params.id)
    .exec((err, category) => {
      if (err) return next(err);
      res.render("category_delete", {
        title: "Delete Category",
        category: category,
      });
    });
};

exports.category_delete_post = (req, res) => {
  body("categoryid", "oops")
    .escape(),

  Category.findByIdAndRemove(req.body.categoryid, (err) => {
    if (err) return next(err);
    res.redirect("/inventory/category/admin/options");
  });
};

exports.category_update_get = (req, res, next) => {
  Category.findById(req.params.id)
    .exec((err, category) => {
      if (err) return next(err);
      res.render("category_form", {
         title: "Update Category",
         category: category,
      });
    });
};

exports.category_update_post = [

  body("name", "Category name required")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlpha()
    .withMessage("Categories cannot be in non-alpha characters."),

  (req, res, next) => {
    const errors = validationResult(req),
          category = new Category({
            name: req.body.name,
            _id: req.params.id,
          });
    
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category: category,
      });
    } else {
      Category.findByIdAndUpdate(req.params.id, category, {}, (err, updatedCategory) => {
        if (err) return next(err);
        res.redirect(updatedCategory.url);
      });
    };
  }
]