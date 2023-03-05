const Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads/' });

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
        .populate("category")
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

exports.item_admin_options_list = (req, res, next) => {
  Item.find()
    .sort({ name: 1 })
    .exec(function (err, item_list) {
      if (err) return next(err);
      res.render("admin_item_options", {
        title: "All Items in Inventory",
        items: item_list,
      });
    });
};

exports.item_create_get = (req, res) => {
  Category.find()
    .sort({ name: 1 })
    .exec((err, categories) => {
      if (err) return next(err);

      res.render("item_form", {
        title: "Create Item",
        categories: categories,
      });
    });
};

exports.item_create_post = [

  upload.single('item_image'),

  // Convert the category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category = typeof req.body.category === 'undefined' ? [] : [req.body.category];
    };
    next();
  },

  body("name", "Item name required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Item description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("quantity", "Quantity is required")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .withMessage("Quantity cannot be in non-numeric characters.")
    .escape(),
  body("cost", "Cost is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*")
    .escape(),
  body("item_image")
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req),
          item = new Item({ 
            name: req.body.name,
            description: req.body.description,
            quantity: req.body.quantity,
            cost: req.body.cost,
            category: req.body.category,
            image: req.file.filename,
          });
    
    if (!errors.isEmpty()) {
      Category.find()
        .sort({ name: 1 })
        .exec((err, categories) => {
          if (err) return next(err);

          // mark our selected categories as checked
          for (const category of categories) {
            if (item.category.includes(category._id)) {
              category.checked = 'true';
            };
          };

          res.render("item_create", {
            title: "Create Item",
            item,
            categories: categories,
            errors: errors.array(),
          });
        });
      
    } else {
      item.save((err) => {
        if (err) return next(err);
        res.redirect(item.url);
      });
    }
  }
];

exports.item_delete_get = (req, res, next) => {
  Item.findById(req.params.id)
    .exec((err, item) =>{
      if (err) return next(err);
      res.render("item_delete", {
        title: "Delete Item",
        item: item,
      });
    });
};

exports.item_delete_post = (req, res) => {
  body("itemid", "oops")
    .escape(),

  Item.findByIdAndRemove(req.body.itemid, (err) => {
    if (err) return next(err);
    res.redirect("/inventory/item/admin/options");
  });
};

exports.item_update_get = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id)
          .exec(callback);
      },
      categories(callback) {
        Category.find()
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.item == null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      };

      // mark selected categories as checked
      for (const category of results.categories) {
        for (const itemCategory of results.item.category) {
          if (category._id.toString() === itemCategory._id.toString()) {
            category.checked = 'true';
          };
        };
      };

      res.render("item_form", {
        title: "Update Item",
        item: results.item,
        categories: results.categories,
      });
    }
  );
};

exports.item_update_post = [

  upload.single('item_image'),

  // convert categories to an array
  (req, rex, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category = typeof req.body.category === 'undefined' ? [] : [req.body.category];
    };
    next();
  },

  body("name", "Name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("quantity", "Name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .withMessage("Quantity must be in numeric format")
    .escape(),
  body("cost", "Name cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .withMessage("Cost must be in numeric format")
    .escape(),
  body("category.*", "You must pick a category, if the option you want is not present, you will need to create the necessary category first")
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req),
          item = new Item({
            name: req.body.name,
            description: req.body.description,
            quantity: req.body.quantity,
            cost: req.body.cost,
            category: typeof req.body.category === 'undefined' ? [] : req.body.category,
            image: req.file.filename,
            _id: req.params.id,
          });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories(callback) {
            Category.find(callback)
          },
        },
        (err, results) => {
          if (err) return next(err);

          for (const category of results.categories) {
            if (item.category.includes(category._id)) {
              category.checked = 'true';
            }
          }
          res.render("item_form", {
            title: "Update Item",
            item: item,
            categories: results.categories,
          });
        }
      );
      return;
    };

    Item.findByIdAndUpdate(req.params.id, item, {}, (err, updatedItem) => {
      if (err) return next(err);
      res.redirect(updatedItem.url);
    });
  },
];