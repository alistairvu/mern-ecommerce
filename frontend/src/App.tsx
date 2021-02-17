import { BrowserRouter as Router, Route } from "react-router-dom"
import { Container } from "react-bootstrap"
import { Footer, Header } from "./components"
import {
  HomeScreen,
  ProductScreen,
  CartScreen,
  LoginScreen,
  RegisterScreen,
  ProfileScreen,
  ShippingScreen,
  PaymentScreen,
  PlaceOrderScreen,
  OrderScreen,
  UserListScreen,
  UserEditScreen,
  ProductListScreen,
} from "./screens"

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route exact path="/" component={HomeScreen} />
          <Route path="/product/:id" component={ProductScreen} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/shipping" component={ShippingScreen} />
          <Route path="/payment" component={PaymentScreen} />
          <Route path="/profile" component={ProfileScreen} />
          <Route path="/cart/:id?" component={CartScreen} />
          <Route path="/place-order" component={PlaceOrderScreen} />
          <Route path="/order/:id" component={OrderScreen} />
          <Route path="/admin/user-list" component={UserListScreen} />
          <Route path="/admin/product-list" component={ProductListScreen} />
          <Route path="/admin/user/:id/edit" component={UserEditScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
