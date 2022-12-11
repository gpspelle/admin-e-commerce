import React from "react"
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap"

import {
  ACTIVATION_STATUS,
  AMAZON_PAY,
  ADD_PRODUCT,
  MANAGE_PRODUCTS,
  MY_ACCOUNT,
} from "../../constants/constants"
import "./NavigationBar.css"

export default function NavigationBar() {
  return (
    <Navbar expand={false} collapseOnSelect fixed="top" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav>
              <Nav.Link className="navigation-link" href={`/${ADD_PRODUCT}`}>
                &nbsp;Adicionar produto
              </Nav.Link>
              <Nav.Link className="navigation-link" href={`/${MANAGE_PRODUCTS}`}>
                &nbsp;Gerenciar produtos
              </Nav.Link>
              <Nav.Link className="navigation-link" href={`/${MY_ACCOUNT}`}>
                &nbsp;Minha conta
              </Nav.Link>
              <Nav.Link className="navigation-link" href={`/${AMAZON_PAY}`}>
                &nbsp;Amazon Pay
              </Nav.Link>
              <Nav.Link className="navigation-link" href={`/${ACTIVATION_STATUS}`}>
                &nbsp;Ativar/Desativar conta
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
        <Navbar.Brand href="/">Administração</Navbar.Brand>
      </Container>
    </Navbar>
  )
}
