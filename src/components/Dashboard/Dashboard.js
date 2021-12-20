import React, { useState, useEffect } from "react";
import axios from "axios"
import { Container, Row, Col } from "react-bootstrap";
import Product from "../Product/Product";
import DeleteAlert from "../Alert/DeleteAlert";
import { API, PRODUCTS_ENDPOINT } from "../../constants/constants";
import useToken from "../../hooks/useToken";

export default function Dashboard() {
  const { token } = useToken();
  const [products, setProducts] = useState();
  const [deleteStatus, setDeleteStatus] = useState();
  const [deletedProductName, setDeletedProductName] = useState();
  const [fetchData, setFetchData] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {  
    async function getProductsFromDatabase() {
        if (token) {
          try {
            const config = {
              headers: {
                "Content-Type": "application/json",
                "x-access-token": token,
              }
            } 
      
            const res = await axios.get(`${API}/${PRODUCTS_ENDPOINT}`, config);
            const { data } = res;
            data.sort((a, b) => (a.PRODUCT_NAME > b.PRODUCT_NAME ? 1 : -1));
            setProducts(data);
          } catch (error) {
            console.error(error);
          }
        }
    }

    getProductsFromDatabase();
  }, [fetchData, token]);

  return (
    <Container>
        <DeleteAlert show={showDeleteAlert} setShow={setShowDeleteAlert} status={deleteStatus} deletedProductName={deletedProductName}/>
        <Row>
            {products?.map((item, i) => {
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
                />
                </Col>
            )
            })}
        </Row>
    </Container>
  )
}
