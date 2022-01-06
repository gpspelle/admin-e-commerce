import React from "react"
import { Route, Switch } from "react-router-dom"
import AccountForm from "./components/AccountForm/AccountForm"
import Dashboard from "./components/Dashboard/Dashboard"
import Profile from "./components/Profile/Profile"
import Login from "./components/Login/Login"
import ProductForm from "./components/ProductForm/ProductForm"
import useToken from "./hooks/useToken"
import jwt from "jwt-decode"
import NavigationBar from "./components/NavigationBar/NavigationBar"
import Home from "./components/Home/Home"
import {
  ADD_PRODUCT,
  CREATE_ACCOUNT,
  MANAGE_PRODUCTS,
  MY_ACCOUNT,
} from "./constants/constants"

function App() {
  const { token, setToken } = useToken()

  if (!token) {
    return (
      <Switch>
        <Route path={`/${CREATE_ACCOUNT}`}>
          <AccountForm />
        </Route>
        <Login setToken={setToken} />
      </Switch>
    )
  }

  const { exp } = jwt(token)
  const now = new Date().getTime()

  if (exp >= now) {
    setToken()
  }

  return (
    <div style={{ paddingTop: "30px" }}>
      <NavigationBar />
      <Switch>
        <Route path={`/${ADD_PRODUCT}`}>
          <ProductForm />
        </Route>
        <Route path={`/${MANAGE_PRODUCTS}`}>
          <Dashboard />
        </Route>
        <Route path={`/${MY_ACCOUNT}`}>
          <Profile />
        </Route>
        <Route path="/:id/edit">
          <ProductForm />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  )
}

export default App
