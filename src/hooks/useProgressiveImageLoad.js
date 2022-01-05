import { useState, useEffect } from "react"
import useIsMounted from "./useIsMounted"

const useProgressiveImageLoad = (lowQualitySrc, highQualitySrc) => {
  const [src, setSrc] = useState(lowQualitySrc)
  const isMounted = useIsMounted()

  useEffect(() => {
    setSrc(lowQualitySrc)
    const img = new Image()
    img.src = highQualitySrc
    img.onload = () => {
      if (isMounted.current) {
        setSrc(highQualitySrc)
      }
    }
  }, [lowQualitySrc, highQualitySrc, isMounted])

  return [src, { blur: src === lowQualitySrc }]
}

export default useProgressiveImageLoad
