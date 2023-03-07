const { body } = require('express-validator');

exports.isAdmin = (req, res, next) => {
  res.render("admin_form", {
    title: "Admin Access Form"
  });
};

exports.accessGranted = [
  body("password", "You must attempt a password")
    .trim()
    .isLength({ min: 1 })
    .isAlpha()
    .escape(),
  
    (req, res, next) => {
      if (req.body.password === 'admin') {
        res.redirect('/inventory/admin/access/granted');
      } else {
        const err = new Error("That was not the password");
        err.status = 400;
        res.render("admin_form", {
          title: "Admin Access Form",
          error: err,
        });
      }
    }
  ];

exports.admin_options = (req, res, next) => {
  res.render("admin_options", {
    title: "Access Granted",
    welcomeMessage: "Welcome Admin",
  });
};