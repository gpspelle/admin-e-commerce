import React, { useState, useEffect } from "react"
import { Col, Spinner } from "react-bootstrap"

import useToken from "../../hooks/useToken"
import { getAccountFromDatabase } from "../../actions/database"
import AmazonPayForm from "./AmazonPayForm"

export default function AmazonPay() {
  const { token } = useToken()
  const [userData, setUserData] = useState({})

  useEffect(() => {
    getAccountFromDatabase({
      token,
      setUserData,
      attributesFromAccount: [
        "email",
        "name",
        "amazon_pay_private_key",
        "amazon_pay_public_key",
        "amazon_pay_store_id",
      ],
    })
  }, [token])

  if (Object.keys(userData).length > 0) {
    return (
      <AmazonPayForm
        email={userData.email}
        name={userData.name}
        amazon_pay_private_key={userData.amazon_pay_private_key}
        amazon_pay_public_key={userData.amazon_pay_public_key}
        amazon_pay_store_id={userData.amazon_pay_store_id}
      />
    )
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
