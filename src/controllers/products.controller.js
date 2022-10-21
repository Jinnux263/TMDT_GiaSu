const Products = require('../models/products.model');
const utils = require('../utils.js')
 
 
 
 
async function sortBoardGame(product,sort) {
   switch (sort) {
       case '-createdAt':
           return product.sort((a, b) => (a.created_at > b.created_at) ? -1: 1)
           break;
       case 'price':
           return product.sort((a, b) => (a.price > b.price) ? 1: -1)
           break;
       case '-price':
           return product.sort((a, b) => (a. price > b.price) ? -1: 1)
           break;
       default:
           return product
           break;
   }
   // return {
   //     '-createdAt': product.sort((a, b) => (a.created_at > b.created_at) ? 1: -1),
   //     'price': product.sort((a, b) => (a.price > b.price) ? 1: -1),
   //     '-price': product.sort((a, b) => (a. price > b.price) ? -1: 1),
   //     'default': product
   // }
}
class Apifeatures {
 constructor(query, queryString) {
     this.query = query;
     this.queryString = queryString;
 }
 filtering() {
     // Để filter thì cần phải loại trừ, chuyển req.query thành chuổi để thêm dấu $ rồi chuyển thành object ngược lại
     const queryObj = { ...this.queryString };
     const excludedFields = ['page', 'sort', 'limit'];
     excludedFields.forEach((el) => delete queryObj[el]);
     console.log("=======queryStr==", queryStr)
     let queryStr = JSON.stringify(queryObj);
     // { "gt": "123" } --> {"$gt":"123"}
     // theo chuan mongoose
     // {"category":"BoardGameCategoryId1","name":{"regex":"mèo nổ"}}
   //   await utils.filterByField('/BoardGames', queryStr)
     queryStr = queryStr.replace(
         /\b(gt|gte|lt|lte|qe|regex)\b/g,
         (match) => '$' + match,
     );
     this.query.find(JSON.parse(queryStr));
     return this;
 }
 sorting() {
     // Using query builder
     if (this.queryString.sort) {
         const sortStr = this.queryString.sort.split(',').join(' ');
         this.query.sort(sortStr);
     } else {
         this.query.sort('-createdAt');
     }
     return this;
 }
 paginating() {
     const page = this.queryString.page * 1 || 1;
     const limit = this.queryString.limit * 1 || 9;
     const skip = (page - 1) * limit;
     this.query = this.query.skip(skip).limit(limit);
     return this;
 }
}
class ProductsController {
 async getProducts(req, res, next) {
     try {
       //  {
       //     limit: '27',
       //     sort: '-createdAt',
       //     category: 'BoardGameCategoryId1',
       //     name: { regex: '123' }
       //   }
       //   const features = new Apifeatures(Products.find({}), req.query)
       //       .filtering()
       //       .sorting()
       //       .paginating();
       //   const products = await features.query;
         const category = req.query?.category
         const limit = Number(req.query?.limit)
         const regex = req.query.name.regex
         const sort = req.query?.sort
         let products = Object.values(await utils.getAll("/BoardGames"))
         if (category) {
           products = products.filter(item => item.category.toLowerCase() === category.toLowerCase())
         }
         if (limit) {
             products = products.slice(0, limit)
 
         }
         if (sort) {
           products = await sortBoardGame(products, sort)
         }
         if (regex) {
             products = products.filter(item => item.name.toLowerCase().includes(regex.toLowerCase()))
         }
         return res.json({
             messages: 'Success',
             results: products.length,
             products,
         });
     } catch (err) {
         return res
             .status(500)
             .json({ err: err.messages, error: 'error At getProducts' });
     }
 }
 async createProduct(req, res, next) {
     try {
       
         console.log(req.body);
      //    const product = await Products.findOne({ product_id });
      //    if (product) {
      //        return res.status(400).json({ msg: 'Product is exist' });
      //    }
      //    if (!images)
      //        return res.status(400).json({ msg: 'Image not found' });
      //    const newProduct = new Products({
      //        product_id,
      //        name,
      //        japanName,
      //        bust,
      //        waist,
      //        hip,
      //        height,
      //        birthday,
      //        blood_type,
      //        hobby,
      //        category,
      //        price,
      //        images,
      //    });
      //    newProduct.save();
      req.body.id = `${Math.floor(Math.random() * 100000)}`
      req.body.created_at = `${new Date()}`
      await utils.add('/BoardGames', req.body)
         return res.json({ msg: 'Add product successfully.' });
     } catch (err) {
         return res.status(500).json({ msg: 'error At createProduct' });
     }
 }
 async deleteProduct(req, res, next) {
     try {
         const { id } = req.params;
      //    await Products.findByIdAndDelete(id);
      console.log("========id", id)
      await utils.deleteById('/BoardGames', id)
         return res.json({ msg: 'Delete product successfully' });
     } catch (err) {
         return res.status(500).json({ msg: 'Delete product fail' });
     }
 }
 async updateProduct(req, res, next) {
     try {
      //    const {
      //        product_id,
      //        name,
      //        japanName,
      //        bust,
      //        waist,
      //        hip,
      //        height,
      //        birthday,
      //        blodd_type,
      //        hobby,
      //        category,
      //        price,
      //        images,
      //    } = req.body;
      //    await Products.findByIdAndUpdate(
      //        { _id: req.params.id },
      //        {
      //            product_id,
      //            name,
      //            japanName,
      //            bust,
      //            waist,
      //            hip,
      //            height,
      //            birthday,
      //            blodd_type,
      //            hobby,
      //            category,
      //            price,
      //            images,
      //        },
      //    );
      await utils.updateById('/BoardGames', req.params.id, req.body)
      return res.json({ msg: 'Update sản phẩn thành công' });
     } catch (err) {
         console.log('=======errr===', err)
         return res
             .status(500)
             .json({ err: err.messages, error: 'error At updateProduct' });
     }
 }
}
module.exports = new ProductsController();