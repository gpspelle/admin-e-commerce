import React, { useState, useEffect } from "react"
import axios from "axios"
import { Container, Row, Col } from "react-bootstrap"
import Product from "../Product/Product"
import DeleteAlert from "../Alert/DeleteAlert"
import {
  ACCESS_TOKEN_NAME,
  REST_API,
  PRODUCTS_ENDPOINT,
} from "../../constants/constants"
import useToken from "../../hooks/useToken"
import NoProductFoundMessage from "../NoProductFoundMessage/NoProductFoundMessage"
import useWindowDimensions from "../../hooks/useWindowDimensions"

export default function Dashboard() {
  const { token } = useToken()
  const [pagination, setPagination] = useState({ key: undefined, fetch: true })
  const [products, setProducts] = useState()
  const [deleteStatus, setDeleteStatus] = useState()
  const [deletedProductName, setDeletedProductName] = useState()
  const [fetchData, setFetchData] = useState(0)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const { width } = useWindowDimensions()

  useEffect(() => {
    async function getProductsFromDatabase() {
      if (token && pagination.fetch) {
        try {
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
          data.sort((a, b) => (a.PRODUCT_NAME > b.PRODUCT_NAME ? 1 : -1))
          setProducts(data)
          setPagination({ key, fetch: key ? true : false })
        } catch (error) {
          console.error(error)
        }
      }
    }

    if (pagination.fetch) {
      getProductsFromDatabase()
    }
  }, [token, pagination])

  useEffect(() => {
    setPagination({ key: undefined, fetch: true })
  }, [fetchData])

  return (
    <Container>
      <Row style={{ paddingTop: "42px" }}>
        <DeleteAlert
          show={showDeleteAlert}
          setShow={setShowDeleteAlert}
          status={deleteStatus}
          deletedProductName={deletedProductName}
        />
        {!pagination.fetch && products && products.length > 0 ? (
          products.map((item, i) => {
            if (item.PRODUCT_TAGS) {
              var index = item.PRODUCT_TAGS.indexOf("!@#$no-tag%^&*")
              if (index !== -1) {
                item.PRODUCT_TAGS.splice(index, 1)
              }
            }

            return (
              <Col
                key={i}
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
                  id={item.id}
                  name={item.PRODUCT_NAME}
                  description={item.PRODUCT_DESCRIPTION}
                  price={item.PRODUCT_PRICE}
                  tags={item.PRODUCT_TAGS ? item.PRODUCT_TAGS : []}
                  images={item.PRODUCT_IMAGES}
                  coverImage={item.PRODUCT_COVER_IMAGE}
                  productType={item.PRODUCT_TYPE}
                  lightingDealStartTime={item.LIGHTING_DEAL_START_TIME}
                  dealPrice={item.DEAL_PRICE}
                  lightingDealDuration={item.LIGHTING_DEAL_DURATION}
                />
              </Col>
            )
          })
        ) : (
          <NoProductFoundMessage
            screenWidth={width}
            hasMoreDataToFetch={pagination.fetch}
          />
        )}
      </Row>
    </Container>
  )
}
