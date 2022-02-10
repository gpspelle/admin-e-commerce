import axios from "axios"

import {
  ACCESS_TOKEN_NAME,
  DUMP_PRODUCTS_ENDPOINT,
  REST_API,
} from "../constants/constants"

export const putDumpProductsOnAdminS3Bucket = async ({
  token,
  setOperationStatus,
  setIsWaitingResponse,
  dumpProducts,
}) => {
  const body = JSON.stringify({
    dumpProducts,
  })

  const config = {
    headers: {
      "Content-Type": "application/json",
      [ACCESS_TOKEN_NAME]: token,
    },
  }

  try {
    await axios.put(`${REST_API}/${DUMP_PRODUCTS_ENDPOINT}`, body, config)
    return true
  } catch (error) {
    setOperationStatus({
      variant: "danger",
      message: error?.response?.data?.message,
      show: true,
    })
    setIsWaitingResponse(false)
    return false
  }
}
