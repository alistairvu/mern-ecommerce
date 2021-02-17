import { useState, useEffect, FormEvent } from "react"
import { Link, useLocation, useHistory, useParams } from "react-router-dom"
import { Form, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Message, Loader, FormContainer } from "../components"
import { rootState } from "../redux"
import { fetchUserDetails } from "../redux/userDetailsSlice"
import { updateUser, resetUserUpdate } from "../redux/userUpdateSlice"

export const UserEditScreen = () => {
  const params = useParams<{ id: string }>()
  const userId = params.id

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  const location = useLocation()

  const dispatch = useDispatch()
  const userDetails = useSelector((state: rootState) => state.userDetails)
  const { loading, error, user } = userDetails

  const { success } = useSelector((state: rootState) => state.userUpdate)

  useEffect(() => {
    dispatch(resetUserUpdate())
  }, [dispatch])

  useEffect(() => {
    if (!user || user._id !== userId) {
      dispatch(fetchUserDetails(userId))
    } else {
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
    }
  }, [userId, dispatch, user])

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const updatedDetails = {
      _id: userId,
      name: name,
      email: email,
      isAdmin: isAdmin,
    }
    dispatch(updateUser(updatedDetails))
  }

  return (
    <>
      <Link to="/admin/user-list" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">User updated!</Message>}
        {!loading && !error && (
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

            <Form.Group controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}
