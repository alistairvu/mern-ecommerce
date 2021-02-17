import { useEffect } from "react"
import { useHistory, Link } from "react-router-dom"
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { CheckoutSteps, Loader, Message } from "../components"
import { rootState } from "../redux"
import { createOrder, OrderInterface } from "../redux/order/orderCreateSlice"
import { resetCart } from "../redux/cartSlice"

export const PlaceOrderScreen = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const cart = useSelector((store: rootState) => store.cart)
  const { cartItems, shippingAddress, paymentMethod } = cart

  const itemsPrice = cartItems.reduce(
    (acc, item) => (acc += item.price * item.quantity),
    0
  )
  const shippingPrice = itemsPrice > 100 ? 0 : 100
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2))
  const totalPrice: number = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

  const orderCreate = useSelector((state: rootState) => state.orderCreate)
  const { order, success, error, loading } = orderCreate

  useEffect(() => {
    if (success) {
      dispatch(resetCart())
      history.push(`/order/${order._id}`)
    }
  }, [history, success, order, dispatch])

  const placeOrderHandler = (e: any) => {
    e.preventDefault()
    const order: OrderInterface = {
      orderItems: cartItems,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      itemsPrice: itemsPrice,
      shippingPrice: shippingPrice,
      taxPrice: taxPrice,
      totalPrice: totalPrice,
    }
    console.log(order)
    dispatch(createOrder(order))
    // if (success) {
    //   history.push(`/order/${order._id}`)
    // }
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
                <br />
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
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
                          ${item.price} x {item.quantity} = $
                          {item.price * item.quantity}
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
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                {loading ? (
                  <Loader />
                ) : (
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cartItems.length === 0}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
