import { BrowserRouter as Router, Route } from "react-router-dom"
import { Container } from "react-bootstrap"
import { Footer, Header } from "./components"
import { HomeScreen, ProductScreen, CartScreen } from "./screens"

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Route exact path="/" component={HomeScreen} />
          <Route path="/product/:id" component={ProductScreen} />
          <Route path="/cart/:id?" component={CartScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App