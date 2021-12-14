import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import ProductForm from './components/ProductForm/ProductForm';
import useToken from './hooks/useToken';

function App() {
  const { token, setToken } = useToken();
    
  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="/home">Administração E-commerce</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/adicionar-produto">Adicionar Produto</Nav.Link>
          <Nav.Link href="/gerenciar-produtos">Gerenciar Produtos</Nav.Link>
        </Nav>
        </Container>
      </Navbar>
      <BrowserRouter>
        <Switch>
          <Route path="/adicionar-produto">
            <ProductForm />
          </Route>
          <Route path="/gerenciar-produtos">
            <Dashboard />
          </Route>
          <Route path="/:id/edit">
            <ProductForm />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;