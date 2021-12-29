import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import AccountForm from './components/AccountForm/AccountForm';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import ProductForm from './components/ProductForm/ProductForm';
import useToken from './hooks/useToken';
import jwt from 'jwt-decode' // import dependency

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/create-account">
            <AccountForm />
          </Route>
          <Login setToken={setToken} />
        </Switch>
      </BrowserRouter>
    )
  }

  const { exp } = jwt(token);
  const now = new Date().getTime()

  if (exp >= now) {
    setToken()
  }

  return (
    <div className="wrapper">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Página Principal</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/adicionar-produto">Adicionar Produto</Nav.Link>
            <Nav.Link href="/gerenciar-produtos">Gerenciar Produtos</Nav.Link>
            <Nav.Link href="/minha-conta">Minha Conta</Nav.Link>
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
          <Route path="/minha-conta">
            <Profile />
          </Route>
          <Route path="/:id/edit">
            <ProductForm />
          </Route>
          <Route path="/">
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;