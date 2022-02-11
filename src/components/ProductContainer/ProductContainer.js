import React, { useState, useEffect, memo } from "react"
import { Container, Row, Col } from "react-bootstrap"

import useToken from "../../hooks/useToken"
import useWindowDimensions from "../../hooks/useWindowDimensions"
import { NO_TAGS_STRING, PRODUCT_STOCK_SELL_TYPE } from "../../constants/constants"
import Product from "../Product/Product"
import NoProductFoundMessage from "../NoProductFoundMessage/NoProductFoundMessage"
import MemoizedProductPagination from "../ProductPagination/ProductPagination"
import AlertWithMessage from "../Alert/AlertWithMessage"
import { getProductsFromDatabase } from "../../actions/database"

const ProductContainer = () => {
  const [productData, setProductData] = useState({
    products: [],
    pagination: { key: undefined, fetch: true },
  })
  const [operationStatus, setOperationStatus] = useState({
    variant: undefined,
    message: undefined,
    show: undefined,
  })
  const { token } = useToken()
  const { width } = useWindowDimensions()

  const { products, pagination } = productData

  useEffect(() => {
    if (!pagination.fetch) {
      setProductData({ products: [], pagination: { key: undefined, fetch: true } })
    }
  }, [operationStatus])

  useEffect(() => {
    if (pagination.fetch) {
      getProductsFromDatabase({ token, pagination, setProductData, products })
    }
  }, [pagination])

  const displayProducts = products

  const items = displayProducts.map((item) => {
    if (item.PRODUCT_TAGS) {
      var index = item.PRODUCT_TAGS.SS.indexOf(NO_TAGS_STRING)
      if (index !== -1) {
        item.PRODUCT_TAGS.SS.splice(index, 1)
      }
    }

    return (
      <Col
        key={item.id.S}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "20px",
        }}
      >
        <Product
          setOperationStatus={setOperationStatus}
          id={item.id.S}
          name={item.PRODUCT_NAME.S}
          description={item.PRODUCT_DESCRIPTION.S}
          price={item.PRODUCT_PRICE.N}
          images={item.PRODUCT_IMAGES.L.map((image) => image.S)}
          coverImage={item.PRODUCT_COVER_IMAGE?.S}
          productOwnerId={item.PRODUCT_OWNER_ID.S}
          tags={item.PRODUCT_TAGS?.SS}
          productType={item.PRODUCT_TYPE?.S}
          dealPrice={item.DEAL_PRICE?.N}
          lightningDealDuration={item.LIGHTNING_DEAL_DURATION?.S}
          lightningDealStartTime={item.LIGHTNING_DEAL_START_TIME?.S}
          hasMoreDataToFetch={pagination.fetch}
          productStock={item.PRODUCT_STOCK?.N || 1}
          productSellTypes={item.PRODUCT_SELL_TYPES?.L || [PRODUCT_STOCK_SELL_TYPE]}
        />
      </Col>
    )
  })

  return (
    <div>
      <Container>
        <Row style={{ paddingTop: "42px" }}>
          <AlertWithMessage
            {...operationStatus}
            setShow={(value) =>
              setOperationStatus({ ...operationStatus, show: value })
            }
          />
          {items && items.length > 0 ? (
            <MemoizedProductPagination products={items} screenWidth={width} />
          ) : (
            <NoProductFoundMessage
              screenWidth={width}
              hasMoreDataToFetch={pagination.fetch}
            />
          )}
        </Row>
      </Container>
    </div>
  )
}

const MemoizedProductContainer = memo(ProductContainer)
export default MemoizedProductContainer
