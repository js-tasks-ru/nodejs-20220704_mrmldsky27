const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

const mapOrderConfirmation = require('../mappers/orderConfirmation');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;
  const {user} = ctx;

  const order = await Order.create({product, phone, address, user});
  await order.save();

  await sendMail({
    to: order.user.email,
    subject: 'Подтвердите заказ',
    locals: mapOrderConfirmation(order, order.product),
    template: 'order-confirmation',
  });

  ctx.body = {status: 'ok', order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user}).populate('product');

  ctx.body = {status: 'ok', orders: orders.map((order) => mapOrder(order))};
};
