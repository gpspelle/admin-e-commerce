import React, { useState, useEffect } from "react"
import {
  ACCESS_TOKEN_NAME,
  ACCOUNT_ENDPOINT,
  REST_API,
} from "../../constants/constants"
import useToken from "../../hooks/useToken"
import axios from "axios"
import AccountForm from "../AccountForm/AccountForm"
import { Col, Spinner } from "react-bootstrap"

export default function Profile() {
  const { token } = useToken()
  const [userData, setUserData] = useState({})

  useEffect(() => {
    async function getAccountFromDatabase() {
      if (token) {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              [ACCESS_TOKEN_NAME]: token,
            },
          }

          const res = await axios.get(`${REST_API}/${ACCOUNT_ENDPOINT}`, config)
          const { data } = res
          const { email, name, commercial_name, phone_number, is_email_verified } =
            data[0]
          setUserData({
            email,
            name,
            commercialName: commercial_name,
            phoneNumber: phone_number,
            isEmailVerified: is_email_verified,
          })
        } catch (error) {
          console.error(error)
        }
      }
    }

    getAccountFromDatabase()
  }, [token])

  if (Object.keys(userData).length > 0) {
    return <AccountForm {...userData} />
  }

  return (
    <Col
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{ position: "absolute", top: "50%" }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Col>
  )
}
