import { useState, useEffect, FormEvent } from "react"
import { Link, useLocation, useHistory } from "react-router-dom"
import { Form, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Message, Loader, FormContainer, CheckoutSteps } from "../components"
import { userLogin } from "../redux/userAuthSlice"
import { rootState } from "../redux"

export const LoginScreen = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const location = useLocation()
  const history = useHistory()
  const redirect = location.search ? location.search.split("=")[1] : ""

  const dispatch = useDispatch()
  const currentUser = useSelector((state: rootState) => state.currentUser)
  const { loading, error, userInfo } = currentUser

  useEffect(() => {
    if (userInfo._id.length > 0) {
      history.push(redirect)
    }
  }, [userInfo, history, redirect])

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(userLogin({ email, password }))
  }

  return (
    <FormContainer>
      {redirect === "shipping" && <CheckoutSteps step1 />}
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Sign In
        </Button>

        <Row className="py-3">
          <Col>
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Click here
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}
