import { useEffect } from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Table, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Message, Loader } from "../components"
import { fetchUserList } from "../redux/userListSlice"
import { rootState } from "../redux"
import { useHistory } from "react-router-dom"
import { deleteUser } from "../redux/userDeleteSlice"

export const UserListScreen = () => {
  const history = useHistory()

  const dispatch = useDispatch()
  const { users, loading, error } = useSelector(
    (state: rootState) => state.userList
  )
  const { userInfo } = useSelector((state: rootState) => state.currentUser)
  const { success: deleteSuccess, loading: deleteLoading } = useSelector(
    (state: rootState) => state.userDelete
  )

  const deleteHandler = (id: string) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteUser(id))
    }
  }

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(fetchUserList())
    } else {
      history.push("/login")
    }
  }, [history, userInfo, dispatch, deleteSuccess])

  return (
    <div>
      <h1>Users</h1>
      {(loading || deleteLoading) && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {!loading && !error && !deleteLoading && (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }} />
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit" />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className="fas fa-trash" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
