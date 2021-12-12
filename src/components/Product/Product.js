import React from "react"
import { useHistory } from "react-router-dom"
import { Button, Card } from "react-bootstrap"
import axios from "axios"

const api = 'https://qbhf2c9996.execute-api.us-east-1.amazonaws.com/dev';

export default function Product({ fetchData, setFetchData, setDeleteStatus, setDeletedProductName, id, name, description, price, images }) {
  const history = useHistory()

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

  const editProduct = async (e) => {
    history.push({pathname: `/${id}/edit`, state: { id, name, description, price, images }})
  }

  return (
    <Card style={{ width: "18rem" }}>
      <img
        className="d-block w-100"
        width="256px"
        height="256px"
        src={images[0]}
        alt={`256x256`}
      />
      <Card.Body>
        <Card.Title className="notranslate">{name}</Card.Title>
        <Card.Text className="notranslate">{description}</Card.Text>
        <Button variant="outline-secondary" style={{ width: "100%", marginBottom: "8%" }} onClick={(e) => editProduct(e)}>
          Editar
        </Button>
        <Button variant="danger" style={{ width: "100%", marginBottom: "8%" }} onClick={(e) => deleteProduct(e)}>
          Deletar
        </Button>
        <Card.Text className="notranslate" style={{ textAlign: "center" }}>
          R$ {price}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}
