import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col } from "react-bootstrap"
import { Product, Loader, Message, Paginate, Meta } from "../components"
import { fetchProductList } from "../redux/product/productListSlice"
import { useParams } from "react-router-dom"
import { rootState } from "../redux"

export const HomeScreen = () => {
  const dispatch = useDispatch()
  const productList = useSelector((state: rootState) => state.productList)
  const { loading, error, products, page, pages } = productList

  const params = useParams<{ pageNumber?: string }>()
  const pageNumber = params.pageNumber || "1"

  useEffect(() => {
    dispatch(fetchProductList(pageNumber))
  }, [dispatch, pageNumber])

  return (
    <div>
      <Meta title="ProShop | Home" />
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
      <Paginate page={Number(page)} pages={Number(pages)} />
    </div>
  )
}
