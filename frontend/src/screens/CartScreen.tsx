import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Message } from "../components"
import { Link } from "react-router-dom"
import { Row, Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap"
import { addItemToCart, removeItemFromCart } from "../redux/cartSlice"
import { useParams, useHistory, useLocation } from "react-router-dom"
import { Loader } from "../components"

export const CartScreen = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const location = useLocation()
  const quantity: number = Number(location.search?.split("=")[1]) || 1

  const dispatch = useDispatch()
  const { cartItems, loading } = useSelector(
    (state: { cart: any }) => state.cart
  )

  useEffect(() => {
    if (id) {
      dispatch(addItemToCart({ id, quantity }))
    }
  }, [dispatch, id, quantity])

  if (loading) {
    return (
      <div>
        <h1>Shopping Cart</h1>
        <Loader />
      </div>
    )
  }

  const removeFromCartHandler = (id: string) => {
    dispatch(removeItemFromCart(id))
  }

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping")
  }

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty. <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item: any) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={3}>
                    <Form.Control
                      as="select"
                      value={`${item.quantity}`}
                      onChange={(e) =>
                        dispatch(
                          addItemToCart({
                            id: item.product,
                            quantity: Number(e.target.value),
                          })
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={1}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash" />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal:{" "}
                {cartItems.reduce(
                  (acc: number, curr: { quantity: number }) =>
                    acc + curr.quantity,
                  0
                )}{" "}
                items
              </h2>
              $
              {cartItems
                .reduce(
                  (acc: number, item: { quantity: number; price: number }) =>
                    acc + item.quantity * item.price,
                  0
                )
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}
