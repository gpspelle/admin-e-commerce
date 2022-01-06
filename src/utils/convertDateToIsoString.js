export const convertDateAndTimeToIsoString = (date, time) => {
  const [hours, minutes] = time.split(":")
  date.setHours(hours)
  date.setMinutes(minutes)
  return date.toISOString()
}
