import React, { useState, useEffect } from "react"
import { AiOutlineClockCircle } from "react-icons/ai"

import {
  msToTime,
  processLightningDealInformation,
} from "../../utils/lightningDealUtils"

export default function LightningDealDuration({
  lightningDealDuration,
  lightningDealStartTime,
}) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!lightningDealDuration || !lightningDealStartTime) {
    return <></>
  }

  const { miliseconds } = processLightningDealInformation({
    now,
    lightningDealDuration,
    lightningDealStartTime,
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
