import { useEffect } from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Table, Button, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Message, Loader } from "../../components"
import { fetchProductList } from "../../redux/product/productListSlice"
import { rootState } from "../../redux"
import { useHistory } from "react-router-dom"
import {
  deleteProduct,
  productDeleteReset,
} from "../../redux/product/productDeleteSlice"
import {
  createProduct,
  productCreateReset,
} from "../../redux/product/productCreateSlice"

export const ProductListScreen = () => {
  const history = useHistory()

  const dispatch = useDispatch()
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: rootState) => state.productList)
  const { userInfo } = useSelector((state: rootState) => state.currentUser)
  const { success: deleteSuccess } = useSelector(
    (state: rootState) => state.productDelete
  )
  const {
    success: createSuccess,
    product: createdProduct,
    loading: createLoading,
    error: createError,
  } = useSelector((state: rootState) => state.productCreate)

  const deleteHandler = (id: string) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  useEffect(() => {
    return () => {
      dispatch(productDeleteReset())
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(productCreateReset())
    if (!userInfo.isAdmin) {
      history.push("/login")
    }

    if (createSuccess && createdProduct._id) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(fetchProductList())
    }
  }, [
    history,
    userInfo,
    dispatch,
    deleteSuccess,
    createSuccess,
    createdProduct,
  ])

  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus" /> Create Product
          </Button>
        </Col>
      </Row>
      {productsLoading && <Loader />}
      {productsError && <Message variant="danger">{productsError}</Message>}
      {createLoading && <Loader />}
      {createError && <Message variant="danger">{createError}</Message>}
      {deleteSuccess && <Message variant="success">Product deleted!</Message>}
      {!productsLoading && !productsError && !createLoading && (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit" />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id!)}
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
