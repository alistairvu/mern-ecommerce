import { Link, useHistory, useParams } from "react-router-dom"
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap"
import { Loader, Message, Rating, Meta } from "../components"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductDetails } from "../redux/product/productDetailsSlice"
import {
  createReview,
  reviewCreateReset,
} from "../redux/review/reviewCreateSlice"
import { rootState } from "../redux"

export const ProductScreen = () => {
  const [quantity, setQuantity] = useState<number>(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const { id } = useParams<{ id: string }>()
  const history = useHistory()

  const dispatch = useDispatch()
  const productDetail = useSelector(
    (state: { productDetail: any }) => state.productDetail
  )
  const { loading, error, product } = productDetail
  const reviewCreate = useSelector((state: rootState) => state.reviewCreate)
  const { success: reviewSuccess, error: reviewError } = reviewCreate
  const currentUser = useSelector((state: rootState) => state.currentUser)
  const { userInfo } = currentUser

  useEffect(() => {
    if (reviewSuccess) {
      alert("Review Submitted")
      setRating(0)
      setComment("")
      dispatch(reviewCreateReset())
    }
    dispatch(fetchProductDetails(id))
  }, [dispatch, id, reviewSuccess])

  useEffect(() => {
    dispatch(reviewCreateReset())
  }, [dispatch])

  const addToCardHandler = () => {
    history.push(`/cart/${id}?qty=${quantity}`)
  }

  const reviewSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(
      createReview({ id: id, review: { rating: rating, comment: comment } })
    )
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
      <Meta title={`ProShop | ${product!.name}`} />
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
      <Row>
        <Col md={6}>
          <h2>Reviews</h2>
          {product.reviews.length === 0 && <Message>No Reviews</Message>}
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Write a Customer Review</h2>
              {reviewError && <Message variant="danger">{reviewError}</Message>}
              {userInfo._id ? (
                <Form onSubmit={reviewSubmitHandler}>
                  <Form.Group controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary">
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message>
                  Please <Link to="/login">sign in</Link> to write a review.
                </Message>
              )}
            </ListGroup.Item>
            {product.reviews.map((review: any) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating value={review.rating} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </div>
  )
}
