import React from "react"
import useProgressiveImageLoad from "../../hooks/useProgressiveImageLoad"

export default function ProgressiveBlurryImageLoad({ small, large, height, width }) {
  const [src, { blur }] = useProgressiveImageLoad(small, large)

  return (
    <img
      src={src}
      style={{
        height,
        width,
        filter: blur ? "blur(5px)" : "none",
        transition: blur ? "none" : "filter 0.3s ease-out",
      }}
      alt={`286x256`}
    />
  )
}
