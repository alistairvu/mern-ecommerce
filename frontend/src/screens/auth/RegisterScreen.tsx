import { useState, useEffect, FormEvent } from "react"
import { Link, useLocation, useHistory } from "react-router-dom"
import { Form, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Message, Loader, FormContainer } from "../../components"
import { registerUser } from "../../redux/user/userAuthSlice"
import { rootState } from "../../redux"

export const RegisterScreen = () => {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [message, setMessage] = useState<string>("")

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

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!")
      return
    }

    dispatch(registerUser({ name, email, password }))
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Sign Up
        </Button>

        <Row className="py-3">
          <Col>
            Returning Customer?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Click here
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}
