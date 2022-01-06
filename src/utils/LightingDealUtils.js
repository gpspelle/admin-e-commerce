import { productTypes } from "../components/ProductType/ProductType"

export const getIsLightingDeal = (productType) =>
  productType === productTypes.LIGHTING_DEAL.name

export const calculateLightingDealEndTime = (
  lightingDealDuration,
  lightingDealStartTime
) => {
  const hoursDuration = lightingDealDuration.substring(0, 2)
  var endLightingDealTime = new Date(lightingDealStartTime)
  endLightingDealTime.setHours(
    endLightingDealTime.getHours() + parseInt(hoursDuration)
  )

  return endLightingDealTime.toISOString()
}

export const processLightingDealInformation = ({
  now,
  lightingDealDuration,
  lightingDealStartTime,
}) => {
  const hoursDuration = lightingDealDuration.substring(0, 2)
  var endLightingDealTime = new Date(lightingDealStartTime)
  endLightingDealTime.setHours(
    endLightingDealTime.getHours() + parseInt(hoursDuration)
  )

  return {
    miliseconds: endLightingDealTime.getTime() - now.getTime(),
    hoursDuration,
  }
}

export const isLightingDealValid = (miliseconds) => miliseconds > 0

export const msToTime = (ms) => {
  var seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60),
    hours = Math.floor(ms / (1000 * 60 * 60))

  hours = hours < 10 ? "0" + hours : hours
  minutes = minutes < 10 ? "0" + minutes : minutes
  seconds = seconds < 10 ? "0" + seconds : seconds

  return hours + ":" + minutes + ":" + seconds
}
