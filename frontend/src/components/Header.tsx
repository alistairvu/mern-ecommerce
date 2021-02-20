import { useDispatch, useSelector } from "react-redux"
import { LinkContainer } from "react-router-bootstrap"
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap"
import { userLogout } from "../redux/user/userAuthSlice"
import { rootState } from "../redux"
import { resetUserDetails } from "../redux/user/userDetailsSlice"
import { resetOrderList } from "../redux/order/orderListSlice"
import { useHistory } from "react-router-dom"
import { resetUserList } from "../redux/user/userListSlice"
import { SearchBox } from "./SearchBox"

export const Header = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const currentUser = useSelector((state: rootState) => state.currentUser)
  const { userInfo } = currentUser

  const logoutHandler = () => {
    dispatch(userLogout())
    dispatch(resetUserDetails())
    dispatch(resetOrderList())
    dispatch(resetUserList())
    history.push("/")
  }

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>ProShop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ml-auto">
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="admin-menu">
                  <LinkContainer to="/admin/user-list">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/product-list">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/order-list">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </LinkContainer>
              {userInfo._id.length > 0 ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
