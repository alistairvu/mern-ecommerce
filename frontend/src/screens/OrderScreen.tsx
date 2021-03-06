import { useState, useEffect } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Message, Loader } from "../components"
import { rootState } from "../redux"
import { fetchOrderDetails } from "../redux/order/orderDetailsSlice"
import axios from "axios"
import { PayPalButton } from "react-paypal-button-v2"
import { payOrder, payOrderReset } from "../redux/order/orderPaySlice"
import { resetOrder } from "../redux/order/orderCreateSlice"
import {
  deliverOrder,
  deliverOrderReset,
} from "../redux/order/orderDeliveredSlice"

declare global {
  interface Window {
    paypal: any
  }
}

export const OrderScreen = () => {
  const [sdkReady, setSdkReady] = useState<boolean>(false)
  const history = useHistory()

  const { id } = useParams<{ id: string }>()

  const dispatch = useDispatch()
  const orderDetails = useSelector((state: rootState) => state.orderDetails)
  const { loading, error, order } = orderDetails
  const { paymentMethod, shippingAddress, orderItems } = order

  const orderPay = useSelector((state: rootState) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDelivered = useSelector((state: rootState) => state.orderDelivered)
  const {
    loading: loadingDelivered,
    success: successDelivered,
  } = orderDelivered

  const { userInfo } = useSelector((state: rootState) => state.currentUser)

  const successPaymentHandler = (paymentResult: any) => {
    console.log(paymentResult)
    dispatch(payOrder({ orderId: id, paymentResult }))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(id))
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login")
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal")
      console.log(clientId)
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order._id || successPay || successDelivered || order._id !== id) {
      dispatch(resetOrder())
      dispatch(payOrderReset())
      dispatch(deliverOrderReset())
      dispatch(fetchOrderDetails(id))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        console.log("Loading script")
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [
    id,
    dispatch,
    order._id,
    order.isPaid,
    successPay,
    successDelivered,
    userInfo,
    history,
  ])

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <Message variant="danger">{error}</Message>
  }

  return (
    <div>
      <h1> Order {id} </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
                <br />
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on{" "}
                  {order.deliveredAt &&
                    new Date(order.deliveredAt!.toString())?.toLocaleString(
                      "en-AU"
                    )}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on{" "}
                  {order.paidAt &&
                    new Date(order.paidAt!.toString())?.toLocaleString("en-AU")}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              <ListGroup variant="flush">
                {orderItems.map((item: any, index: number) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>

                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>

                      <Col md={4}>
                        ${item.price} x {item.quantity} = $
                        {item.price * item.quantity}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>

            {!order.isPaid && (
              <ListGroup.Item>
                {loadingPay && <Loader />}
                {!sdkReady ? (
                  <Loader />
                ) : (
                  <PayPalButton
                    amount={order.totalPrice}
                    onSuccess={successPaymentHandler}
                  />
                )}
              </ListGroup.Item>
            )}
            {loadingDelivered && <Loader />}
            {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn btn-block"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </Button>
              </ListGroup.Item>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
