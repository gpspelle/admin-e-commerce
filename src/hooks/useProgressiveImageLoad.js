import { useState, useEffect } from "react"

const useProgressiveImageLoad = (lowQualitySrc, highQualitySrc) => {
  const [src, setSrc] = useState(lowQualitySrc)

  useEffect(() => {
    setSrc(lowQualitySrc)
    const img = new Image()
    img.src = highQualitySrc
    img.onload = () => {
      setSrc(highQualitySrc)
    }
  }, [lowQualitySrc, highQualitySrc])

  return [src, { blur: src === lowQualitySrc }]
}

export default useProgressiveImageLoad
