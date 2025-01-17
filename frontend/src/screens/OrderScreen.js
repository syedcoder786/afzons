import React, { useState, useEffect } from 'react'
import axios from 'axios'
// import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

import logo from "../logo.svg";

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id

  const [sdkReady, setSdkReady] = useState(true)

  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay, error: errorPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  // useEffect(() => {
  //   if (!userInfo) {
  //     history.push('/login')
  //   }
  // },[])


  const loadScript = async (src) => {

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
          // setSdkReady(true)
          resolve(true);
      };
      script.onerror = () => {
          resolve(false);
      };
      document.body.appendChild(script);
  });
  }

  // const __DEV__ = document.domain = "localhost"

    const displayRazorpay = async () => {
      setSdkReady(false)
      const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
          alert("Razorpay SDK failed to load. Are you online?");
          return;
      }

      // creating a new order
      const result = await axios.post("/api/orders/createOrder",{price:order.totalPrice});

      // console.log(result)

      setSdkReady(true)

      if (!result) {
          alert("Server error. Are you online?");
          return;
      }

      // Getting the order details back
      const { amount, id: order_id, currency } = result.data;

      const options = {
          key: "rzp_test_O0kB4AvhcsAAYn", // this is test key
          amount: amount.toString(),
          currency: currency,
          name: "AFZONE",
          description: "Test Transaction",
          image: { logo },
          order_id: order_id,
          handler: async function (response) {
              const data = {
                  orderCreationId: order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
              };

              console.log(data)
              // const result = await axios.post("http://localhost:5000/payment/success", data);
              dispatch(payOrder({...data, orderId, email:order.user.email}))
              // console.log("sended request")

              // alert(result.data.msg);
          },
          prefill: {
              // name: "Soumya Dey",
              // email: "SoumyaDey@example.com",
              // contact: "9999999999",
          },
          notes: {
              // address: "Soumya Dey Corporate Office",
          },
          theme: {
              color: "#61dafb",
          },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    }


    useEffect(() => {
      if (!userInfo) {
        history.push('/login')
      }
      if (!order || successPay || successDeliver || order._id !== orderId) {
        dispatch({ type: ORDER_PAY_RESET })
        dispatch({ type: ORDER_DELIVER_RESET })
        dispatch(getOrderDetails(orderId))
        // window.location.reload()
      } else if (!order.isPaid) {
        // if (!window.paypal) {
        //   addPayPalScript()
        // } else {
          // setSdkReady(false)
          // const res = await loadScript(
          //   "https://checkout.razorpay.com/v1/checkout.js"
          // );
          // setSdkReady(true)
        // }
      }
      if(successPay){
        window.location.reload()
      }
    }, [dispatch, orderId, successPay, successDeliver, order])

  // const successPaymentHandler = (paymentResult) => {
  //   console.log(paymentResult)
  //   dispatch(payOrder(orderId, paymentResult))
  // }

  // const makePayment = (token) => {
  //     const body = {
  //       token,
  //       order
  //     }

  //     dispatch(payOrder(orderId, body))
  // }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
                {errorPay && <Message variant='danger'>{errorPay}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {/* {loadingPay && <Loader />} */}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <Button onClick={displayRazorpay}>
                      Pay ₹{order.totalPrice}
                    </Button>
                    // <button>Pay</button>
                    // <PayPalButton
                    //   amount={order.totalPrice}
                    //   onSuccess={successPaymentHandler}
                    // />
                    // <StripeCheckout
                    //   stripeKey='pk_test_51K9OorSHWdNs9aoMm08bVrEX3CUzGFEsm9a81NvrUaQbmVJQquusNRxTChBPb9a4VRrFBy0pOFm2b5oic9m3W7lz00GBQPnjc1'
                    //   token={makePayment}
                    //   name='BUY REACT'
                    //   amount={order.totalPrice * 100}
                    //   currency="INR"
                    // />
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
