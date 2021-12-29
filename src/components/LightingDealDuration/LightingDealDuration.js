import React, { useState, useEffect } from "react"
import { ProgressBar } from "react-bootstrap"
import {
  msToTime,
  processLightingDealInformation,
} from "../../utils/LightingDealUtils"

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
  
  const { miliseconds, hoursDuration } = processLightingDealInformation({
    now,
    lightingDealDuration,
    lightingDealStartTime,
  })
  const totalDuration = hoursDuration * 3600000
  const displayLeftDuration = msToTime(miliseconds)

  const percentageLeft = miliseconds / totalDuration
  return (
    <div style={{ textAlign: "left", fontSize: "14px", color: "gray" }}>
      {displayLeftDuration}
      <ProgressBar
        variant={getProgressBarVariant(percentageLeft)}
        now={percentageLeft * 100}
      ></ProgressBar>
    </div>
  )
}
