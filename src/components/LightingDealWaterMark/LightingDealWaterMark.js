import React from "react"
import { AiFillThunderbolt } from "react-icons/ai"

export default function LightingDealWaterMark() {
  return (
    <>
      <AiFillThunderbolt
        style={{
          position: "absolute",
          margin: "17px",
          fontSize: "24px",
          zIndex: "1",
        }}
      />
      <svg
        width="44"
        height="44"
        style={{ position: "absolute", margin: "6px", zIndex: "0" }}
      >
        <rect width="44" height="44" fill="white" rx="10" />
      </svg>
    </>
  )
}
