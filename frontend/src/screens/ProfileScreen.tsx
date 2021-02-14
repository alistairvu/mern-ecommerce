import { useState, useEffect, FormEvent } from "react"
import { useHistory } from "react-router-dom"
import { Form, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Message, Loader } from "../components"
import { getUserDetails, updateUserDetails } from "../redux/userDetailsSlice"
import { rootState } from "../redux"

export const ProfileScreen = () => {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  const history = useHistory()

  const dispatch = useDispatch()
  const userDetails = useSelector((state: rootState) => state.userDetails)
  const { loading, error, user } = userDetails

  const { user: userInfo } = useSelector(
    (state: rootState) => state.currentUser
  )

  const { success } = useSelector((state: rootState) => state.userDetails)

  console.log(user)

  useEffect(() => {
    if (userInfo._id.length <= 0) {
      history.push("/login")
    } else {
      if (user._id.length <= 0) {
        dispatch(getUserDetails("profile"))
        console.log("FETCHING")
      } else {
        setName(user!.name)
        setEmail(user!.email)
      }
    }
  }, [userInfo, history, dispatch, user])

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!")
      return
    }

    dispatch(updateUserDetails({ id: user._id, name, email, password }))
  }

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">Data updated!</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
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
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
      </Col>
    </Row>
  )
}
