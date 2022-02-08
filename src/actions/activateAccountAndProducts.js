import axios from "axios"
import {
  ADMINS_BUCKET,
  MANAGE_PRODUCTS,
  PRODUCTS_DUMP_FILE_NAME,
} from "../constants/constants"
import {
  batchAddProductsOnDatabase,
  patchAccountActivationStatusOnDatabase,
} from "./database"

export const activateAccountAndProducts = async ({
  token,
  setToken,
  setOperationStatus,
  setIsWaitingResponse,
  email,
  is_active,
  id,
  history,
}) => {
  var data
  try {
    const response = await axios.get(
      `https://${ADMINS_BUCKET}.s3.amazonaws.com/${id}/${PRODUCTS_DUMP_FILE_NAME}`
    )
    data = response.data
  } catch (error) {
    setOperationStatus({
      variant: "danger",
      message: error?.response?.data?.message,
      show: true,
    })
    setIsWaitingResponse(false)
    return
  }

  const resultBatchAdd = await batchAddProductsOnDatabase({
    token,
    products: data,
    setOperationStatus,
    setIsWaitingResponse,
  })

  if (!resultBatchAdd) {
    return
  }

  const resultPatchAccount = await patchAccountActivationStatusOnDatabase({
    token,
    setToken,
    setOperationStatus,
    setIsWaitingResponse,
    email,
    is_active,
  })

  if (resultPatchAccount) {
    history.push(`/${MANAGE_PRODUCTS}`)
  }
}
