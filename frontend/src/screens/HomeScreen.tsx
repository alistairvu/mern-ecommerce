import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col } from "react-bootstrap"
import { Product, Loader, Message } from "../components"
import { fetchProductList } from "../redux/productListSlice"

interface ProductListInterface {
  loading: boolean
  error: string
  products: ProductInterface[]
}

export const HomeScreen = () => {
  const dispatch = useDispatch()
  const productList = useSelector(
    (state: { productList: any }) => state.productList
  )
  const { loading, error, products }: ProductListInterface = productList

  console.log(productList)

  useEffect(() => {
    dispatch(fetchProductList())
  }, [dispatch])

  return (
    <div>
      <h1>Latest Products</h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <Row>
        {typeof products === "object" &&
          products.map((product: ProductInterface) => (
            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
              <Product product={product} />
            </Col>
          ))}
      </Row>
    </div>
  )
}
