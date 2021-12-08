import React from "react"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import Badge from "react-bootstrap/Badge"
import { Carousel } from "react-bootstrap"
import axios from "axios"

const api = 'https://qbhf2c9996.execute-api.us-east-1.amazonaws.com/dev';

export default function Product({ fetchData, setFetchData, setDeleteStatus, setDeletedProductName, id, name, description, price, images }) {
  const deleteProduct = async (e) => {
    const body = {
      id,
    };

    var config = {
      headers: { 'Content-Type': 'text/plain' },
    };

    try {
      setDeletedProductName(name);
      const res = await axios.delete(`${api}/product`, {data: body}, config);
      setDeleteStatus(res.status);
      setFetchData(fetchData + 1);
    } catch (error) {
      console.error(error);
      setDeleteStatus('500');
    }
  }

  return (
    <Card style={{ width: "18rem" }}>
      <Carousel interval={null}>
        {images?.map((item, i) => {
          return (
            <Carousel.Item key={i}>
              <img className="d-block w-100" src={item} alt={`${i}`} />
            </Carousel.Item>
          )
        })}
      </Carousel>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="danger" onClick={(e) => deleteProduct(e)}>
          Deletar
        </Button>
        <Badge pill bg="success">
          {price} R$
        </Badge>
      </Card.Body>
    </Card>
  )
}
