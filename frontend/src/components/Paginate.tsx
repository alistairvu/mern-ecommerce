import { Pagination } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"

interface PaginateProps {
  pages: number
  page: number
  isAdmin?: boolean
  keyword?: string
}

export const Paginate = ({
  pages,
  page,
  isAdmin = false,
  keyword = "",
}: PaginateProps) => {
  if (pages === 1) {
    return null
  }

  console.log([...Array(pages).keys()])

  const generateLink = (x: number) => {
    if (isAdmin) {
      return `/admin/product-list/page/${x + 1}`
    }
    if (keyword) {
      return `/search/${keyword}/page/${x + 1}`
    }
    return `/page/${x + 1}`
  }

  return (
    <Pagination>
      {[...Array(pages).keys()].map((x) => (
        <LinkContainer key={x + 1} to={generateLink(x)}>
          <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
        </LinkContainer>
      ))}
    </Pagination>
  )
}
