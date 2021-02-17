import { useState, useEffect, FormEvent } from "react"
import { Link, useParams } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Message, Loader, FormContainer } from "../../components"
import { rootState } from "../../redux"
import {
  fetchProductDetails,
  resetProductDetails,
} from "../../redux/product/productDetailsSlice"
import {
  productUpdateReset,
  updateProduct,
} from "../../redux/product/productUpdateSlice"
import axios from "axios"

export const ProductEditScreen = () => {
  const params = useParams<{ id: string }>()
  const productId = params.id

  const [name, setName] = useState<string>("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector((state: rootState) => state.productDetail)
  const { loading, error, product } = productDetails

  const { success } = useSelector((state: rootState) => state.productUpdate)

  useEffect(() => {
    dispatch(productUpdateReset())
    dispatch(resetProductDetails())
  }, [dispatch])

  useEffect(() => {
    if (!product || product._id !== productId) {
      dispatch(fetchProductDetails(productId))
    } else {
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setBrand(product.brand)
      setCategory(product.category)
      setCountInStock(product.countInStock)
      setDescription(product.description)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, dispatch, loading])

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const updatedDetails = {
      id: productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    }
    dispatch(updateProduct(updatedDetails))
  }

  const uploadFileHandler = async (e: any) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("image", file)
    setUploading(true)

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }

      const { data } = await axios.post("/api/upload", formData, config)

      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  return (
    <>
      <Link to="/admin/product-list" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">Product updated!</Message>}
        {!loading && !error && name !== undefined && (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
              <Form.File
                id="image-file"
                label="Choose file"
                custom
                onChange={uploadFileHandler}
              />
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count in Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
                required
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}
