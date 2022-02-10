import React, { useState, useEffect } from "react"
import { AiOutlineClockCircle } from "react-icons/ai"

import {
  msToTime,
  processLightingDealInformation,
} from "../../utils/lightingDealUtils"

export default function LightingDealDuration({
  lightingDealDuration,
  lightingDealStartTime,
}) {
  const [now, setNow] = useState(new Date())

  const getProgressBarVariant = (val) => {
    if (val > 0.4) {
      return "success"
    } else if (val > 0.2) {
      return "warning"
    }

    return "danger"
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!lightingDealDuration || !lightingDealStartTime) {
    return <></>
  }

  const { miliseconds } = processLightingDealInformation({
    now,
    lightingDealDuration,
    lightingDealStartTime,
  })
  const displayLeftDuration = msToTime(miliseconds)

  return (
    <div style={{ textAlign: "left", fontSize: "12px", color: "green" }}>
      <AiOutlineClockCircle />
      &nbsp;Oferta acaba em&nbsp;
      {displayLeftDuration}
    </div>
  )
}
