const { Types, isValidObjectId } = require('mongoose');

const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({
    // eslint-disable-next-line new-cap
    subcategory: Types.ObjectId(subcategory),
  });

  ctx.body = { products: products.map((p) => mapProduct(p)) };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});

  ctx.body = { products: products.map((p) => mapProduct(p)) };
};

module.exports.productById = async function productById(ctx, next) {
  if (!isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid id: ' + ctx.params.id);
  }
  const product = await Product.findById(ctx.params.id);

  if (!product) {
    ctx.throw(404, 'product not found');
  }

  ctx.body = { product: mapProduct(product) };
};
