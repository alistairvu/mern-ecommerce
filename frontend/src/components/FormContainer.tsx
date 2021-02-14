import { PropsWithChildren } from "react"
import { Container, Row, Col } from "react-bootstrap"

interface FormContainerProps {}

export const FormContainer = ({
  children,
}: PropsWithChildren<FormContainerProps>) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  )
}
