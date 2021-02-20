import { Helmet } from "react-helmet"

interface MetaProps {
  title?: string
  description?: string
  keywords?: string
}

export const Meta = ({
  title = "ProShop",
  description = "We sell the best electronics for cheap",
  keywords = "electronics, buy electronics, cheap electronics",
}: MetaProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  )
}
