import { render } from "react-dom"
import App from "./App"
import "./bootstrap.min.css"
import { store, persistor } from "./redux"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import "./styles.css"

const rootElement = document.getElementById("root")
render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  rootElement
)
