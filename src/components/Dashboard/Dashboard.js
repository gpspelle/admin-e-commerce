import React, { useState, useEffect } from "react";
import axios from "axios"
import { Container, Row, Col } from "react-bootstrap";
import Product from "../Product/Product";
import DeleteAlert from "../Alert/DeleteAlert";
import { ACCESS_TOKEN_NAME, API, PRODUCTS_ENDPOINT } from "../../constants/constants";
import useToken from "../../hooks/useToken";

export default function Dashboard() {
  const { token } = useToken();
  const [paginationKey, setPaginationKey] = useState(undefined);
  const [hasMoreDataToFetch, setHasMoreDataToFetch] = useState(true);
  const [products, setProducts] = useState();
  const [deleteStatus, setDeleteStatus] = useState();
  const [deletedProductName, setDeletedProductName] = useState();
  const [fetchData, setFetchData] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {  
    async function getProductsFromDatabase() {
        if (token && hasMoreDataToFetch) {
          try {
            const body = {
              key: paginationKey
            }

            const config = {
              params: {
                body
              },
              headers: {
                "Content-Type": "application/json",
                [ACCESS_TOKEN_NAME]: token,
              }
            } 
      
            const res = await axios.get(`${API}/${PRODUCTS_ENDPOINT}`, config);
            const { data, key } = res.data;
            data.sort((a, b) => (a.PRODUCT_NAME > b.PRODUCT_NAME ? 1 : -1));
            setProducts(data);
            setPaginationKey(key);
            setHasMoreDataToFetch(key ? true : false)
          } catch (error) {
            console.error(error);
          }
        }
    }

    getProductsFromDatabase();
  }, [fetchData, token, paginationKey, hasMoreDataToFetch]);

  return (
    <Container>
        <DeleteAlert show={showDeleteAlert} setShow={setShowDeleteAlert} status={deleteStatus} deletedProductName={deletedProductName}/>
        <Row>
            {products?.map((item, i) => {
              if (item.PRODUCT_TAGS) {
                var index = item.PRODUCT_TAGS.indexOf("!@#$no-tag%^&*");
                if (index !== -1) {
                  item.PRODUCT_TAGS.splice(index, 1);
                }
              }

              return (
                  <Col
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "30px",
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
                    productType={item.PRODUCT_TYPE}
                    lightingDealDateISOString={item.LIGHTING_DEAL_START_TIME}
                    lightingDealPrice={item.LIGHTING_DEAL_PRICE}
                    lightingDealDuration={item.LIGHTING_DEAL_DURATION}
                  />
                  </Col>
              )
            })}
        </Row>
    </Container>
  )
}
