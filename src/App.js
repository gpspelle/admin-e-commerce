import React from "react"
import { Route, Switch } from "react-router-dom"
import AccountForm from "./components/AccountForm/AccountForm"
import MemoizedProductContainer from "./components/ProductContainer/ProductContainer"
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
  FORGOT_PASSWORD,
  MANAGE_PRODUCTS,
  MY_ACCOUNT,
  CHANGE_FORGOT_PASSWORD,
} from "./constants/constants"
import ForgotPassword from "./components/ForgotPassword/ForgotPassword"
import ChangeForgotPassword from "./components/ChangeForgotPassword/ChangeForgotPassword"

function App() {
  const { token, setToken } = useToken()

  if (!token) {
    return (
      <Switch>
        <Route path={`/${CREATE_ACCOUNT}`}>
          <AccountForm />
        </Route>
        <Route path={`/${FORGOT_PASSWORD}`}>
          <ForgotPassword />
        </Route>
        <Route path={`/${CHANGE_FORGOT_PASSWORD}`}>
          <ChangeForgotPassword />
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
          <MemoizedProductContainer />
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
