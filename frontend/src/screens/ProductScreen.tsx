import { Link, useHistory, useParams } from "react-router-dom"
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap"
import { Loader, Message, Rating } from "../components"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductDetail } from "../redux/productDetailSlice"

export const ProductScreen = () => {
  const [quantity, setQuantity] = useState<number>(1)
  const { id } = useParams<{ id: string }>()
  const history = useHistory()

  const dispatch = useDispatch()
  const productDetail = useSelector(
    (state: { productDetail: any }) => state.productDetail
  )
  const { loading, error, product } = productDetail

  useEffect(() => {
    dispatch(fetchProductDetail(id))
  }, [dispatch, id])

  const addToCardHandler = () => {
    history.push(`/cart/${id}?qty=${quantity}`)
  }

  if (loading) {
    return (
      <div>
        <Link to="/" className="btn btn-light my-3">
          Go Back
        </Link>
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Link to="/" className="btn btn-light my-3">
          Go Back
        </Link>
        <Message variant="danger">No matching products.</Message>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>

      <Row>
        <Col md={6}>
          <Image src={product!.image} alt={product!.name} fluid />
        </Col>

        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product!.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product!.rating}
                text={`${product!.numReviews} ${
                  product!.numReviews === 1 ? "review" : "reviews"
                }`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product!.price}</ListGroup.Item>
            <ListGroup.Item>Description: {product!.description}</ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product!.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product!.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col md={4}>Qty:</Col>
                    <Col md={8}>
                      <Form.Control
                        as="select"
                        value={`${quantity}`}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  onClick={addToCardHandler}
                  className="btn-block"
                  disabled={product!.countInStock <= 0}
                >
                  Add to cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
