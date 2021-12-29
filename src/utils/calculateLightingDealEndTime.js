export const calculateLightingDealEndTime = (lightingDealDuration, lightingDealStartTime) => {
    const hoursDuration = lightingDealDuration.substring(0, 2)
    var endLightingDealTime = new Date(lightingDealStartTime)
    endLightingDealTime.setHours(
      endLightingDealTime.getHours() + parseInt(hoursDuration)
    )
  
    return endLightingDealTime.toISOString()
}