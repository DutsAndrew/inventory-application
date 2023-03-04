#! /usr/bin/env node
console.log('This script populates some test items, itemInstances, and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async')
const Item = require('./models/item');
const Category = require('./models/category');
const ItemInstance = require('./models/itemInstance');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const items = []
const categories = []
const itemInstances = []

function categoryCreate(name, cb) {
  const category = new Category({ name: name });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function itemCreate(name, description, cost, quantity, reviews, category, cb) {
  itemDetail = { 
    name: name,
    description: description,
    cost: cost,
    quantity: quantity,
    reviews: reviews,
    category: category,
  }

  if (category != false) itemDetail.category = category
    
  const item = new Item(itemDetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

function createCategories(cb) {
  async.series([
      function(callback) {
        categoryCreate('Beans', callback);
      },
      function(callback) {
        categoryCreate('Roasts', callback);
      },
      function(callback) {
        categoryCreate('Espresso', callback);
      },
      function(callback) {
        categoryCreate('Pour Over', callback);
      },
      ],
      // optional callback
      cb);
}

function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('the Bambino®', 'The faster way to professional results at home. Like professional machines, the Bambino can deliver third wave specialty coffee. This is made possible by the 4 keys formula. Delivering barista quality performance using a 54mm portafilter with 18 grams of coffee for full flavor and a powerful steam wand to create microfoam required for latte art. With a proprietary ThermoJet heating system the machine is ready to start in 3 seconds. Additionally, see the Bambino® Plus if you prefer the features of the Bambino but would like the inclusion of an automatic steam wand.', 349.95, 30, 4.1, categories[2], callback);
        },
        function(callback) {
          itemCreate('the Barista Express®', 'Create third wave specialty coffee at home from bean to espresso in less than a minute. The Barista Express allows you to grind the beans right before extraction for rich full flavor and precise temperature control ensures optimal espresso extraction. Be hands on like a barista with manual microfoam milk texturing to deliver authentic results in no time at all.', 599.96, 84, 4.5, categories[2], callback);
        },
        function(callback) {
          itemCreate('Diletta Bello Espresso Machine', 'Delight your senses with the Diletta Bello Espresso Machine. A refined take on a classic design; the Bello offers best-in-class components in an affordable package. Espresso is managed with an industry-famous E61 group mated to a 1.8-liter stainless steel HX boiler that allows for simultaneous brewing and steaming. Deliberately manual controls puts shot and steam quality in your hands, providing a barista-like experience in your own home. Outside, the case comes in polished stainless or minimalist black and white powdercoat. Make coffee you love with the Diletta Bello Espresso Machine.', 1699, 21, 5, categories[2], callback);
        },
        function(callback) {
          itemCreate('Guatemala Xinabajul El Paraiso', 'A sweet undercurrent lays the groundwork for a balanced daily drinking coffee, with crisp acidity in light roasts that structures cup flavors. Notes of light brown sugar, caramel, dried apple, semi-sweet chocolate. City to Full City+. Good for espresso.', 7.75, 54, 4.7, categories[0], callback);
        },
        function(callback) {
          itemCreate('JAVA ORGANIC', 'JAVA Organic Estate Jampit – From the Indonesian island of the same name, these crops were planted by the Dutch 300 years ago, in the 17th century.  This coffee has a smooth, medium full–bodied, thick flavor. This Java is sourced from the Jampit Estate located on the island of Java, Indonesia. In the 17th Century Java coffee was first cultivated in low lying areas, but by the 19th Century coffee leaf rust had destroyed production, forcing new coffee cultivation into the highlands where high altitudes and volcanic soil provide perfect growing conditions.', 15.50, 28, 4.2, categories[1], callback);
        },
        function(callback) {
          itemCreate('Bodum 8 Cup / 34oz Pour Over Coffee Maker', 'Permanent stainless steel filter so that there\'s no need to buy paper filters again. The carafe is made of tasteless borosilicate glass. Removable cuff protects hands from hot glass.', 19.79, 70, 4.3, categories[3], callback);
        },
        function(callback) {
          itemCreate('ETHIOPIA NATURAL ORGANIC', 'ETHIOPIA Natural Organic Guji Uraga  – This coffee is sourced from 600 family-owned farms organized around Feku Jiberil, at his coffee washing station located in the town of Tomme within the Guji Zone of the Oromia Region, Ethiopia. Coffee producers deliver their ripe cherries to the Feku’ s washing station where the cherries are sorted an immediately placed on raised beds and dried over a period of 18 to 21 days. The raised drying beds are carefully constructed to ensure proper air circulation and temperature control for an optimal drying process. Cherries are also turned regularly on the beds to prevent damage during the drying process.', 17.95, 84, 3.4, categories[1], callback)
        }
        ],
        // optional callback
        cb);
}



async.series([
    createCategories,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ItemInstances: '+itemInstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});