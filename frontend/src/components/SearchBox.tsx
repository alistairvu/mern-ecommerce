import { useState } from "react"
import { Form, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"

export const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const history = useHistory()

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchTerm.trim()) {
      history.push(`/search/${searchTerm}`)
    } else {
      history.push("/")
    }
  }

  return (
    <div>
      <Form onSubmit={submitHandler} inline>
        <Form.Control
          type="text"
          name="q"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Products..."
          className="mr-sm-2 ml-sm-5"
        ></Form.Control>
        <Button type="submit" variant="outline-success" className="p-2">
          Search
        </Button>
      </Form>
    </div>
  )
}
