import React from "react"
import "./NavigationBar.css"
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap"

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
              <Nav.Link className="navigation-link" href="/adicionar-produto">
                &nbsp;Adicionar Produto
              </Nav.Link>
              <Nav.Link className="navigation-link" href="/gerenciar-produtos">
                &nbsp;Gerenciar Produtos
              </Nav.Link>
              <Nav.Link className="navigation-link" href="/minha-conta">
                &nbsp;Minha Conta
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
        <Navbar.Brand href="/">Administração</Navbar.Brand>
      </Container>
    </Navbar>
  )
}
