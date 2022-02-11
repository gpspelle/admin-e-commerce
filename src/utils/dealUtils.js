import { productTypes } from "../components/ProductType/ProductType"

export const getIsDeal = (productType) =>
  productType === productTypes.DEAL.name ||
  productType === productTypes.LIGHTNING_DEAL.name
