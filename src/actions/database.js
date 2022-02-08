import axios from "axios"
import jwt from "jwt-decode"
import {
  ACCESS_TOKEN_NAME,
  ACCOUNT_ENDPOINT,
  BATCH_PRODUCTS_ENDPOINT,
  HTTP_API,
  LOGIN_ENDPOINT,
  PRODUCTS_ENDPOINT,
  PRODUCT_ENDPOINT,
  REST_API,
  SEND_FORGOT_PASSWORD_EMAIL_ENDPOINT,
  SEND_VERIFY_EMAIL_ENDPOINT,
} from "../constants/constants"

export const getAccountFromDatabase = async ({
  token,
  setUserData,
  attributesFromAccount,
}) => {
  if (token) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        [ACCESS_TOKEN_NAME]: token,
      },
    }

    try {
      const res = await axios.get(`${REST_API}/${ACCOUNT_ENDPOINT}`, config)
      const { data } = res

      const userData = {}

      attributesFromAccount.forEach((attribute) => {
        userData[attribute] = data[0][attribute]
      })

      setUserData(userData)
    } catch (error) {
      console.error(error)
    }
  }
}

export const putAccountOnDatabase = async ({
  email,
  name,
  commercial_name,
  phone_number,
  password,
  setIsWaitingResponse,
  setOperationStatus,
  history,
}) => {
  const body = JSON.stringify({
    email,
    name,
    commercial_name,
    phone_number,
    password,
  })

  console.log(body)
  var config = {
    headers: { "Content-Type": "application/json" },
  }

  try {
    setIsWaitingResponse(true)
    await axios.put(`${REST_API}/${ACCOUNT_ENDPOINT}`, body, config)
    history.push({ pathname: "/", state: { email: email } })
  } catch (error) {
    setOperationStatus({
      variant: "danger",
      message: error?.response?.data?.message,
      show: true,
    })
  } finally {
    setIsWaitingResponse(false)
  }
}

export const patchAccountActivationStatusOnDatabase = async ({
  token,
  setToken,
  setOperationStatus,
  setIsWaitingResponse,
  email,
  is_active,
}) => {
  const body = JSON.stringify({
    email: email,
    is_active: !is_active,
  })

  const config = {
    headers: {
      "Content-Type": "application/json",
      [ACCESS_TOKEN_NAME]: token,
    },
  }

  try {
    const response = await axios.patch(
      `${REST_API}/${ACCOUNT_ENDPOINT}`,
      body,
      config
    )

    setToken(response?.data)
    setOperationStatus({
      variant: "success",
      message: response?.data?.token && "Conta modificada com sucesso",
      show: true,
    })
    return true
  } catch (error) {
    setOperationStatus({
      variant: "danger",
      message: error?.response?.data?.message,
      show: true,
    })
    return false
  } finally {
    setIsWaitingResponse(false)
  }
}

export const patchAccountOnDatabase = async ({
  token,
  setIsWaitingResponse,
  setOperationStatus,
  bodyAttributes,
  successMessage,
}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      [ACCESS_TOKEN_NAME]: token,
    },
  }

  const body = JSON.stringify(bodyAttributes)

  try {
    setIsWaitingResponse(true)
    await axios.patch(`${REST_API}/${ACCOUNT_ENDPOINT}`, body, config)

    setOperationStatus({
      variant: "success",
      show: true,
      message: successMessage || "Alteração realizada com sucesso",
    })
  } catch (error) {
    setOperationStatus({
      variant: "danger",
      show: true,
      message: error?.response?.data?.message,
    })
  } finally {
    setIsWaitingResponse(false)
  }
}

export const postForgotPasswordEmail = async ({
  setIsWaitingResponse,
  setOperationStatus,
  email,
}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const body = JSON.stringify({
    email,
  })

  try {
    setIsWaitingResponse(true)
    await axios.post(
      `${HTTP_API}/${SEND_FORGOT_PASSWORD_EMAIL_ENDPOINT}`,
      body,
      config
    )

    setOperationStatus({
      variant: "success",
      show: true,
      message: "Email de recuperação de senha enviado, verifique a caixa de spam.",
    })
  } catch (error) {
    setOperationStatus({
      variant: "danger",
      show: true,
      message: error?.response?.data?.message,
    })
  } finally {
    setIsWaitingResponse(false)
  }
}

export const postVerificationEmail = async ({
  token,
  setIsWaitingResponse,
  setOperationStatus,
  email,
  name,
}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const body = JSON.stringify({
    email,
    name,
  })

  try {
    setIsWaitingResponse(true)
    const response = await axios.post(
      `${HTTP_API}/${SEND_VERIFY_EMAIL_ENDPOINT}?${ACCESS_TOKEN_NAME}=${token}`,
      body,
      config
    )

    if (response.status <= 300 && response.status >= 200) {
      setOperationStatus({
        variant: "success",
        message: response?.data?.body?.message,
        show: true,
      })
    } else {
      setOperationStatus({
        variant: "danger",
        message: response?.data?.body?.message,
        show: true,
      })
    }
  } catch (error) {
    setOperationStatus({
      variant: "danger",
      message: error?.response?.data?.body?.message,
      show: true,
    })
  } finally {
    setIsWaitingResponse(false)
  }
}

export const getProductsFromDatabase = async ({
  token,
  pagination,
  setProductData,
  products,
}) => {
  const body = {
    key: pagination.key,
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

  try {
    const res = await axios.get(`${REST_API}/${PRODUCTS_ENDPOINT}`, config)
    const { data, key } = res.data
    const concatProducts = products.length > 0 ? products.concat(data) : data

    concatProducts.sort((a, b) => (a.PRODUCT_NAME.S > b.PRODUCT_NAME.S ? 1 : -1))

    setProductData({
      products: concatProducts,
      pagination: { key, fetch: key ? true : false },
    })
  } catch (error) {
    console.error(error)
  }
}

export const deleteProductOnDatabase = async ({
  token,
  setIsWaitingResponse,
  setOperationStatus,
  handleCloseModal,
  id,
  name,
}) => {
  const body = {
    id,
  }

  const headers = {
    "Content-Type": "text/plain",
    [ACCESS_TOKEN_NAME]: token,
  }

  try {
    handleCloseModal()
    setIsWaitingResponse(true)
    const res = await axios.delete(`${REST_API}/${PRODUCT_ENDPOINT}`, {
      data: body,
      headers,
    })

    setOperationStatus({
      status: res.status,
      show: true,
      message: `O produto ${name} foi deletado com sucesso.`,
      variant: "success",
    })
  } catch (error) {
    setOperationStatus({
      message:
        error?.response?.data?.message ||
        `O produto ${name} não foi deletado corretamente, tente novamente.`,
      status: error.statusCode,
      show: true,
      variant: "danger",
    })
  } finally {
    setIsWaitingResponse(false)
  }
}

export const postLogin = async ({
  email,
  password,
  setToken,
  setLoginStatusMessage,
  setShow,
}) => {
  setShow(false)

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  const body = JSON.stringify({
    email,
    password,
  })

  try {
    const res = await axios.post(`${REST_API}/${LOGIN_ENDPOINT}`, body, config)
    setToken(res.data)
  } catch (error) {
    setLoginStatusMessage(error.response.data)
    setShow(true)
  }
}

export const batchDeleteProductsOnDatabase = async ({
  token,
  productsIds,
  setOperationStatus,
  setIsWaitingResponse,
}) => {
  const body = JSON.stringify({
    productsIds,
  })

  const headers = {
    "Content-Type": "application/json",
    [ACCESS_TOKEN_NAME]: token,
  }

  try {
    await axios.delete(`${REST_API}/${BATCH_PRODUCTS_ENDPOINT}`, {
      data: body,
      headers,
    })

    return true
  } catch (error) {
    setOperationStatus({
      message:
        error?.response?.data?.message ||
        "Houve um erro ao remover os produtos, tente novamente",
      status: error.statusCode,
      show: true,
      variant: "danger",
    })
    setIsWaitingResponse(false)
    return false
  }
}

export const batchAddProductsOnDatabase = async ({
  token,
  products,
  setOperationStatus,
  setIsWaitingResponse,
}) => {
  const body = JSON.stringify({
    products,
  })

  const config = {
    headers: {
      "Content-Type": "application/json",
      [ACCESS_TOKEN_NAME]: token,
    },
  }

  try {
    await axios.put(`${REST_API}/${BATCH_PRODUCTS_ENDPOINT}`, body, config)
    return true
  } catch (error) {
    setOperationStatus({
      message:
        error?.response?.data?.message ||
        "Houve um erro ao adicionar os produtos, tente novamente",
      status: error.statusCode,
      show: true,
      variant: "danger",
    })
    setIsWaitingResponse(false)
    return false
  }
}
