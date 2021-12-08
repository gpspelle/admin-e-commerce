import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../Product/Product";
import DeleteAlert from "../Alert/DeleteAlert";

const api = "https://qbhf2c9996.execute-api.us-east-1.amazonaws.com/dev";
const endpoint = "products";

export default function Dashboard() {
  const [products, setProducts] = useState();
  const [deleteStatus, setDeleteStatus] = useState();
  const [deletedProductName, setDeletedProductName] = useState();
  const [fetchData, setFetchData] = useState(0);
  useEffect(() => {    
    async function getProductsFromDatabase() {
        const data = await fetch(`${api}/${endpoint}`);
        const json = await data.json();
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
                <Col key={i}>
                <Product
                  fetchData={fetchData}
                  setFetchData={setFetchData}
                  setDeleteStatus={setDeleteStatus}
                  setDeletedProductName={setDeletedProductName}
                  id={item.id}
                  name={item.PRODUCT_NAME}
                  description={item.PRODUCT_DESCRIPTION}
                  price={item.PRODUCT_PRICE}
                  images={item.PRODUCT_IMAGES}
                />
                </Col>
            )
            })}
        </Row>
    </Container>
  )
}
