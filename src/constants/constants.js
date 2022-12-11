export const REST_API =
  process.env.REACT_APP_REST_API ||
  "https://nlv53clpuf.execute-api.us-east-1.amazonaws.com/dev"
export const HTTP_API =
  process.env.REACT_APP_HTTP_API ||
  "https://oftg6ghwa0.execute-api.us-east-1.amazonaws.com"
export const ACCESS_TOKEN_NAME =
  process.env.REACT_APP_ACCESS_TOKEN_NAME || "x-access-token"
export const NO_TAGS_STRING =
  process.env.REACT_APP_NO_TAGS_STRING || "!@#$no-tag%^&*"
export const SAME_ORIGINAL_PROFILE_PHOTO_STRING =
  process.env.REACT_APP_SAME_ORIGINAL_PROFILE_PHOTO_STRING || "SAME"
export const PRODUCTS_DUMP_FILE_NAME =
  process.env.REACT_APP_PRODUCTS_DUMP_FILE_NAME || "products-dump"
export const ADMINS_BUCKET =
  process.env.REACT_APP_ADMINS_BUCKET || "us-east-1-beta-e-commerce-admins-bucket"
export const PRODUCT_STOCK_SELL_TYPE =
  process.env.REACT_APP_PRODUCT_STOCK || "PRODUCT_STOCK"
export const PRODUCT_ORDER_SELL_TYPE =
  process.env.REACT_APP_PRODUCT_ORDER || "PRODUCT_ORDER"
export const PRODUCT_ENDPOINT = "product"
export const PRODUCTS_ENDPOINT = "products"
export const TAGS_ENDPOINT = "tags"
export const LOGIN_ENDPOINT = "login"
export const ACCOUNT_ENDPOINT = "account"
export const AMAZON_PAY_ENDPOINT = "amazon-pay"
export const DUMP_PRODUCTS_ENDPOINT = "dump-products"
export const BATCH_PRODUCTS_ENDPOINT = "batch-products"

export const SEND_VERIFY_EMAIL_ENDPOINT = "send-verify-email"
export const SEND_FORGOT_PASSWORD_EMAIL_ENDPOINT = "send-forgot-password-email"
export const CHANGE_FORGOT_PASSWORD_ENDPOINT = "forgot-password"

export const AMAZON_PAY = "amazon-pay"
export const ADD_PRODUCT = "adicionar-produto"
export const MANAGE_PRODUCTS = "gerenciar-produtos"
export const MY_ACCOUNT = "minha-conta"
export const CREATE_ACCOUNT = "criar-conta"
export const FORGOT_PASSWORD = "esqueci-a-senha"
export const CHANGE_FORGOT_PASSWORD = "alterar-senha"
export const ACTIVATION_STATUS = "status-da-conta"
export const EDIT_PRODUCT = "editar"
