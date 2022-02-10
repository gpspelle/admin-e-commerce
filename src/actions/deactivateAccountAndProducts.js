import axios from "axios"

import {
  ACCESS_TOKEN_NAME,
  PRODUCTS_ENDPOINT,
  REST_API,
} from "../constants/constants"
import {
  batchDeleteProductsOnDatabase,
  patchAccountActivationStatusOnDatabase,
} from "./database"
import { putDumpProductsOnAdminS3Bucket } from "./s3"

export const deactivateAccountAndProducts = async ({
  token,
  setToken,
  setOperationStatus,
  setIsWaitingResponse,
  email,
  is_active,
}) => {
  if (token) {
    const body = {
      key: undefined,
    }

    const config = {
      params: {
        body,
      },
      headers: {
        "Content-Type": "application/json",
        [ACCESS_TOKEN_NAME]: token,
      },
    }

    var products
    try {
      const res = await axios.get(`${REST_API}/${PRODUCTS_ENDPOINT}`, config)
      const { data } = res.data

      data.sort((a, b) => (a.PRODUCT_NAME.S > b.PRODUCT_NAME.S ? 1 : -1))
      products = data
    } catch (error) {
      setOperationStatus({
        variant: "danger",
        message: error?.response?.data?.message,
        show: true,
      })
      setIsWaitingResponse(false)
      return
    }

    const dumpProducts = JSON.stringify(products)

    const resultDumpProducts = await putDumpProductsOnAdminS3Bucket({
      token,
      setOperationStatus,
      setIsWaitingResponse,
      dumpProducts,
    })

    if (!resultDumpProducts) {
      return
    }

    const productsIds = products.map((product) => {
      return product.id.S
    })

    const resultBatchDelete = await batchDeleteProductsOnDatabase({
      token,
      productsIds,
      setOperationStatus,
      setIsWaitingResponse,
    })

    if (!resultBatchDelete) {
      return
    }

    patchAccountActivationStatusOnDatabase({
      token,
      setToken,
      setOperationStatus,
      setIsWaitingResponse,
      email,
      is_active,
    })
  }
}
