const express = require("express");
const router = express.Router();

const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

router.get('/', category_controller.index);

/// GET AND POST requests for item controller ///

router.get('/item/create', item_controller.item_create_get);
router.post('/item/create', item_controller.item_create_post);

router.get('/item/:id/delete', item_controller.item_delete_get);
router.post('/item/:id/delete', item_controller.item_delete_post);

router.get('/book/:id/update', item_controller.item_update_get);
router.post('/book/:id/update', item_controller.item_update_post);

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

module.exports = router;