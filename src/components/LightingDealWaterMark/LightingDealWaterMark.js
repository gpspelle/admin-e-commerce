import React from "react"
import { AiFillThunderbolt } from "react-icons/ai"

export default function LightingDealWaterMark() {
  return (
    <>
      <AiFillThunderbolt
        style={{
          position: "absolute",
          margin: "19px",
          fontSize: "24px",
          zIndex: "1",
          color: "green",
          top,
        }}
      />
      <svg
        width="44"
        height="44"
        style={{
          position: "absolute",
          margin: "8px",
          zIndex: "0",
          top,
          border: "1.25px solid green",
          borderRadius: "10px",
        }}
      >
        <rect width="44" height="44" fill="white" rx="10" />
      </svg>
    </>
  )
}
