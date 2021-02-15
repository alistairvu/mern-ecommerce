import { useState, FormEvent } from "react"
import { useHistory } from "react-router-dom"
import { Form, Button, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { CheckoutSteps, FormContainer } from "../components"
import { rootState } from "../redux"
import { savePaymentMethod } from "../redux/cartSlice"

export const PaymentScreen = () => {
  const history = useHistory()

  const dispatch = useDispatch()
  const { shippingAddress } = useSelector((state: rootState) => state.cart)

  if (!shippingAddress) {
    history.push("/shipping")
  }

  const [paymentMethod, setPaymentMethod] = useState<string>("PayPal")

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push("/place-order")
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <h1>Payment Method</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group className="py-3">
            <Form.Label as="legend">Select Method</Form.Label>

            <Col>
              <Form.Check
                type="radio"
                label="PayPal or Credit Card"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>

          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </div>
  )
}
