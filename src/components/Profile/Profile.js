import React, { useState, useEffect } from "react"
import useToken from "../../hooks/useToken"
import AccountForm from "../AccountForm/AccountForm"
import { Col, Spinner } from "react-bootstrap"
import { defaultPosition } from "../ProfilePhoto/ProfilePhoto"
import { getAccountFromDatabase } from "../../actions/database"

export default function Profile() {
  const { token } = useToken()
  const [userData, setUserData] = useState({})

  useEffect(() => {
    getAccountFromDatabase({
      token,
      setUserData,
      attributesFromAccount: [
        "email",
        "name",
        "commercial_name",
        "phone_number",
        "is_email_verified",
        "original_profile_photo",
        "image_position",
        "image_zoom",
        "image_rotate",
        "about_me",
        "about_products",
      ],
    })
  }, [token])

  if (Object.keys(userData).length > 0) {
    return (
      <AccountForm
        email={userData.email}
        name={userData.name}
        commercial_name={userData.commercial_name}
        phone_number={userData.phone_number}
        about_me={userData.about_me}
        about_products={userData.about_products}
        is_email_verified={userData.is_email_verified}
        original_profile_photo={userData.original_profile_photo}
        image_position={
          userData.image_position !== undefined
            ? JSON.parse(userData.image_position)
            : defaultPosition
        }
        image_zoom={userData.image_zoom}
        image_rotate={userData.image_rotate}
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
