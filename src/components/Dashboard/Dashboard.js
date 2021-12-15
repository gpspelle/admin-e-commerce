import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../Product/Product";
import DeleteAlert from "../Alert/DeleteAlert";
import { API, PRODUCTS_ENDPOINT } from "../../constants/constants";

export default function Dashboard() {
  const [products, setProducts] = useState();
  const [deleteStatus, setDeleteStatus] = useState();
  const [deletedProductName, setDeletedProductName] = useState();
  const [fetchData, setFetchData] = useState(0);
  useEffect(() => {    
    async function getProductsFromDatabase() {
        const data = await fetch(`${API}/${PRODUCTS_ENDPOINT}`);
        const json = await data.json();
        json.sort((a, b) => (a.PRODUCT_NAME > b.PRODUCT_NAME ? 1 : -1));
        setProducts(json);
    }

    getProductsFromDatabase();
  }, [fetchData]);

  return (
    <Container>
        <DeleteAlert status={deleteStatus} deletedProductName={deletedProductName}/>
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
