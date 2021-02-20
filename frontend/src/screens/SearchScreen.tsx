import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col } from "react-bootstrap"
import { Product, Loader, Message, Paginate, Meta } from "../components"
import { fetchResults } from "../redux/product/productSearchSlice"
import { useParams, Link } from "react-router-dom"
import { rootState } from "../redux"

export const SearchScreen = () => {
  const params = useParams<{ keyword: string; pageNumber: string }>()
  const dispatch = useDispatch()
  const productSearch = useSelector((state: rootState) => state.productSearch)
  const { loading, error, products, page, pages } = productSearch

  const keyword = params.keyword
  const pageNumber = params.pageNumber || "1"

  console.log({ keyword, page, pageNumber })

  useEffect(() => {
    dispatch(fetchResults({ keyword, pageNumber }))
  }, [dispatch, keyword, pageNumber])

  return (
    <div>
      <Meta title="ProShop | Search" />
      <h1>Results for "{keyword}"</h1>
      <Link to="/" className="btn btn-light">
        Go Back
      </Link>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {!loading && products.length === 0 && (
        <Message>No matching products found</Message>
      )}
      <Row>
        {typeof products === "object" &&
          products.map((product: ProductInterface) => (
            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
              <Product product={product} />
            </Col>
          ))}
      </Row>
      <Paginate page={page} pages={Number(pages)} keyword={keyword} />
    </div>
  )
}
