import React, { useState, useEffect, memo } from "react"
import axios from "axios"
import { Container, Row, Col } from "react-bootstrap"
import {
  ACCESS_TOKEN_NAME,
  REST_API,
  PRODUCTS_ENDPOINT,
} from "../../constants/constants"
import DeleteAlert from "../Alert/DeleteAlert"
import Product from "../Product/Product"
import useWindowDimensions from "../../hooks/useWindowDimensions"
import NoProductFoundMessage from "../NoProductFoundMessage/NoProductFoundMessage"
import MemoizedProductPagination from "../ProductPagination/ProductPagination"
import useToken from "../../hooks/useToken"

const ProductContainer = () => {
  const [productData, setProductData] = useState({
    products: [],
    pagination: { key: undefined, fetch: true },
  })
  const [deleteStatus, setDeleteStatus] = useState()
  const [deletedProductName, setDeletedProductName] = useState()
  const [fetchData, setFetchData] = useState(0)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const { token } = useToken()
  const { width } = useWindowDimensions()

  const { products, pagination } = productData

  useEffect(() => {
    if (fetchData > 0 && !pagination.fetch) {
      setProductData({ products: [], pagination: { key: undefined, fetch: true } })
    }
  }, [fetchData])

  useEffect(() => {
    async function getProductsFromDatabase() {
      const body = {
        key: pagination.key,
      }

      const config = {
        params: {
          body,
        },
        headers: {
          "Content-Type": "application/json",
          [ACCESS_TOKEN_NAME]: token,
        },
      }

      const res = await axios.get(`${REST_API}/${PRODUCTS_ENDPOINT}`, config)
      const { data, key } = res.data
      const concatProducts = products.length > 0 ? products.concat(data) : data

      concatProducts.sort((a, b) => (a.PRODUCT_NAME.S > b.PRODUCT_NAME.S ? 1 : -1))

      setProductData({
        products: concatProducts,
        pagination: { key, fetch: key ? true : false },
      })
    }

    if (pagination.fetch) {
      getProductsFromDatabase()
    }
  }, [pagination])

  const displayProducts = products

  const items = displayProducts.map((item) => {
    if (item.PRODUCT_TAGS) {
      var index = item.PRODUCT_TAGS.SS.indexOf("!@#$no-tag%^&*")
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
          setShowDeleteAlert={setShowDeleteAlert}
          fetchData={fetchData}
          setFetchData={setFetchData}
          setDeleteStatus={setDeleteStatus}
          setDeletedProductName={setDeletedProductName}
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
          lightingDealDuration={item.LIGHTING_DEAL_DURATION?.S}
          lightingDealStartTime={item.LIGHTING_DEAL_START_TIME?.S}
          hasMoreDataToFetch={pagination.fetch}
        />
      </Col>
    )
  })

  return (
    <div>
      <Container>
        <Row style={{ paddingTop: "42px" }}>
          <DeleteAlert
            show={showDeleteAlert}
            setShow={setShowDeleteAlert}
            status={deleteStatus}
            deletedProductName={deletedProductName}
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
