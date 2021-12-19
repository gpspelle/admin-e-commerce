import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Card, Modal } from "react-bootstrap"
import axios from "axios"
import { API, PRODUCT_ENDPOINT } from "../../constants/constants"
import useToken from "../../hooks/useToken"

export default function Product({ fetchData, setFetchData, setDeleteStatus, setDeletedProductName, id, name, description, price, tags, images }) {
  const { token } = useToken()
  const history = useHistory()
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const deleteProduct = async () => {
    handleCloseModal()
    const body = {
      id,
    };
  
    const headers = { 
      "Content-Type": "text/plain",
      "x-access-token": token
    };

    try {
      setDeletedProductName(name);
      const res = await axios.delete(`${API}/${PRODUCT_ENDPOINT}`, { data: body, headers });
      setDeleteStatus(res.status);
      setFetchData(fetchData + 1);
    } catch (error) {
      console.error(error);
      setDeleteStatus('500');
    }
  }

  const editProduct = async (e) => {
    history.push({pathname: `/${id}/edit`, state: { id, name, description, price, tags, images }})
  }

  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Deletar produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`Deseja mesmo deletar o produto ${name}?`}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Não
          </Button>
          <Button variant="primary" onClick={() => deleteProduct()}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
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
        <Button variant="danger" style={{ width: "100%", marginBottom: "8%" }} onClick={handleShowModal}>
          Deletar
        </Button>
        <Card.Text className="notranslate" style={{ textAlign: "center" }}>
          R$ {price}
        </Card.Text>
      </Card.Body>
    </Card>
    </div>
    
  )
}
