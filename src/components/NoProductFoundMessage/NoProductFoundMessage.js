import React from "react"
import { Card, Button, Col, Spinner } from "react-bootstrap"
import { useHistory } from "react-router"
import { ADD_PRODUCT } from "../../constants/constants"

export default function NoProductFoundMessage({
  screenWidth,
  hasMoreDataToFetch,
}) {
  const history = useHistory()

  const handleClick = (e) => {
    e.preventDefault()
    history.push({
      pathname: `/${ADD_PRODUCT}`,
    })
  }

  return (
    <Col
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {hasMoreDataToFetch ? (
        <Spinner
          animation="border"
          role="status"
          style={{ position: "absolute", top: "50%" }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Card
          style={{ width: screenWidth < 1024 ? "100%" : "24rem", border: "none" }}
        >
          <Card.Img
            variant="top"
            src="not-found-dog.png"
            style={{ height: "35vh" }}
          />
          <Card.Body>
            <Card.Text style={{ textAlign: "center" }}>
              Você ainda não tem nenhum produto cadastrado na sua loja. Clique aqui para criar o seu primeiro produto
            </Card.Text>
            <Button
              onClick={handleClick}
              style={{ width: "100%" }}
              variant="primary"
            >
              Criar produto
            </Button>
          </Card.Body>
        </Card>
      )}
    </Col>
  )
}
