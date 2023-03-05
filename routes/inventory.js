const express = require("express");
const router = express.Router();

const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");
const admin_controller = require('../controllers/adminController');

router.get('/', category_controller.index);

/// GET AND POST requests for item controller ///

router.get('/item/create', item_controller.item_create_get);
router.post('/item/create', item_controller.item_create_post);

router.get('/item/:id/delete', item_controller.item_delete_get);
router.post('/item/:id/delete', item_controller.item_delete_post);

router.get('/item/:id/update', item_controller.item_update_get);
router.post('/item/:id/update', item_controller.item_update_post);

router.get('/item/:id', item_controller.item_detail);

router.get('/items', item_controller.item_list);


/// GET AND POST requests for category controller ///

router.get('/category/create', category_controller.category_create_get);
router.post('/category/create', category_controller.category_create_post);

router.get('/category/:id/delete', category_controller.category_delete_get);
router.post('/category/:id/delete', category_controller.category_delete_post);

router.get('/category/:id/update', category_controller.category_update_get);
router.post('/category/:id/update', category_controller.category_update_post);

router.get('/category/:id', category_controller.category_detail);

/// ADMIN OPTIONS ///

router.get('/item/admin/options', item_controller.item_admin_options_list);
router.get('/category/admin/options', category_controller.category_admin_options_list);

router.get('/admin/access', admin_controller.isAdmin);
router.post('/admin/access', admin_controller.accessGranted);

router.get('/admin/access/granted', admin_controller.admin_options);

module.exports = router;