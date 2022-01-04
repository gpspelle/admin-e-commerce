import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AccountForm from './components/AccountForm/AccountForm';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import ProductForm from './components/ProductForm/ProductForm';
import useToken from './hooks/useToken';
import jwt from 'jwt-decode';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Home from './components/Home/Home';

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
    <div style={{ paddingTop: "30px" }}>
      <BrowserRouter>
        <NavigationBar />
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
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;