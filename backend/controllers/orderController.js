import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'

import Razorpay from "razorpay";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import config from 'config';

import  fast2sms from 'fast-two-sms';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const neworder = await Order.findById(req.params.id)

  // const  { token, order } = req.body;
  // const idempotencyKey = uuidv4();

  // console.log("Token ",token)
  // console.log("Order ",order)

  if (neworder) {

    try {
      // getting the details back from our font-end
      const {
          orderCreationId,
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
          email,
      } = req.body;


      // Creating our own digest
      // The format should be like this:
      // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
      const shasum = crypto.createHmac("sha256", config.get("RAZORPAY_SECRET"));

      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

      const digest = shasum.digest("hex");


      // comaparing our digest with the actual signature
      if (digest !== razorpaySignature){
        res.status(404)
        throw new Error('Transaction not legit!')
        // return res.status(400).json({ msg: "Transaction not legit!" });
      }

      // THE PAYMENT IS LEGIT & VERIFIED
      // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

      const date = new Date();
      let time = date.getTime();

      neworder.isPaid = true
      neworder.paidAt = Date.now()
      neworder.orderItems.map(async (item) => {
        const product = await Product.findById(item.product)
        product.countInStock -= item.qty;
        await product.save()
      })
      neworder.paymentResult = {
        id: razorpayPaymentId,
        status: 200,
        update_time: time,
        email_address: email,
      }

      const updatedOrder = await neworder.save()

      res.json(updatedOrder);

      var options = {
          authorization : "FXSYMgKuC4bpoIZBDA2tzdsjE80NwUTnPc6G7eHQR9ymVJiLar5lNaAxive73V6zWX2dLIwYrMkO1PDS",
          message : updatedOrder ,  
          numbers : ['8006508832']
      } 
      fast2sms.sendMessage(options).then(res => {
        // console.log("res")
        // console.log(res)
      }).catch(err => {
        // console.log("err")
        console.log(err)
      }) //Asynchronous Function.
      

      } catch (error) {
        res.status(404)
        console.log(error)
        throw new Error(error)
          // res.status(500).send(error);
      }

  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})


const createOrder = asyncHandler(async (req,res) => {
  const { price } = req.body
  
    try {
      const instance = new Razorpay({
          key_id: config.get("RAZORPAY_KEY_ID"),
          key_secret: config.get("RAZORPAY_SECRET"),
      });

      const options = {
          amount: price*100, // amount in smallest currency unit
          currency: "INR",
          receipt: uuidv4(),
      };

      const order = await instance.orders.create(options);

      if (!order) return res.status(500).json("Some error occured");

      res.json(order);
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

export {
  addOrderItems,
  getOrderById,
  createOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}
