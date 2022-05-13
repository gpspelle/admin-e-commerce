import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useHistory, useLocation } from "react-router-dom"
import { Form, Container, Button, Spinner } from "react-bootstrap"
import CurrencyInput from "react-currency-input-field"

import useToken from "../../hooks/useToken"
import ImageUploadPreview from "../ImageUploadPreview/ImageUploadPreview"
import {
  ACCESS_TOKEN_NAME,
  REST_API,
  MANAGE_PRODUCTS,
  PRODUCT_ENDPOINT,
  PRODUCT_STOCK_SELL_TYPE,
  PRODUCT_ORDER_SELL_TYPE,
} from "../../constants/constants"
import TagSelector from "../TagSelector/TagSelector"
import { areArraysEqual } from "../../utils/compareTwoArrays"
import MissingFieldsAlert from "../Alert/MissingFieldsAlert"
import ProductType, { productTypes } from "../ProductType/ProductType"
import { isArraySorted } from "../../utils/isArraySorted"
import { convertDateAndTimeToIsoString } from "../../utils/convertDateToIsoString"
import { lightningDealDurations } from "../LightningDeal/LightningDealProduct"
import { calculateLightningDealEndTime } from "../../utils/lightningDealUtils"
import scrollToTop from "../../utils/scrollToTop"
import AlertWithMessage from "../Alert/AlertWithMessage"
import ProductSellTypes, {
  setSellTypeStatesUsingSellTypesArray,
} from "../ProductSellTypes/ProductSellTypes"
import { getTagsFromDatabase } from "../../actions/database"

export default function ProductForm() {
  const { token } = useToken()
  const history = useHistory()
  const location = useLocation()
  const imageInput = useRef()
  const [createdTags, setCreatedTags] = useState([])
  const [edit, setEdit] = useState()
  const [id, setId] = useState()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [tags, setTags] = useState(new Set([]))
  const [imageData, setImageData] = useState({
    images: [],
    imageNames: [],
    imagePreview: [],
    imagesResized: [],
  })
  const [operationStatus, setOperationStatus] = useState({
    status: undefined,
    show: false,
    message: undefined,
    variant: undefined,
  })
  const [showMissingFieldsAlert, setShowMissingFieldsAlert] = useState(false)
  const [isWaitingResponse, setIsWaitingResponse] = useState(false)
  const [productType, setProductType] = useState(productTypes.NORMAL.name)
  const [lightningDealTime, setLightningDealTime] = useState("10:00")
  const [lightningDealDate, setLightningDealDate] = useState(new Date())
  const [lightningDealDuration, setLightningDealDuration] = useState(
    lightningDealDurations["12h"].name
  )
  const [dealPrice, setDealPrice] = useState("")
  const [lightningDealStartTime, setLightningDealStartTime] = useState()
  const [orderIndex, setOrderIndex] = useState([])

  const [isProductStock, setIsProductStock] = useState(false)
  const [isProductOrder, setIsProductOrder] = useState(false)
  const [productStock, setProductStock] = useState("1")
  const { images, imageNames, imagesResized } = imageData

  useEffect(() => {
    if (lightningDealTime && lightningDealDate) {
      setLightningDealStartTime(
        convertDateAndTimeToIsoString(lightningDealDate, lightningDealTime)
      )
    }
  }, [lightningDealDate, lightningDealTime])

  useEffect(() => {
    getTagsFromDatabase({ setCreatedTags })
  }, [operationStatus.status])

  useEffect(() => {
    if (location.state) {
      setEdit(true)
      setId(location.state.id)
      setName(location.state.name)
      setDescription(location.state.description)
      setPrice(location.state.price)
      setTags(new Set(location.state.tags))
      setImageData({ ...imageData, imagePreview: location.state.images })
      setProductType(location.state.productType)
      setProductStock(location.state.productStock)

      setSellTypeStatesUsingSellTypesArray({
        sellTypes: location.state.productSellTypes,
        setIsProductOrder,
        setIsProductStock,
      })

      if (location.state.productType === productTypes.DEAL.name) {
        setDealPrice(location.state.dealPrice)
      } else if (location.state.productType === productTypes.LIGHTNING_DEAL.name) {
        setDealPrice(location.state.dealPrice)
        setLightningDealDate(location.state.lightningDealDate)
        setLightningDealTime(location.state.lightningDealTime)
        setLightningDealDuration(location.state.lightningDealDuration)
      }
    }
  }, [location])

  const isCreateInputValid = () => {
    const isNormalCreateInput =
      name !== "" && description !== "" && price !== "" && images.length > 0

    if (productType === productTypes.DEAL.name) {
      return isNormalCreateInput && dealPrice !== ""
    } else if (productType === productTypes.LIGHTNING_DEAL.name) {
      return (
        isNormalCreateInput && lightningDealTime.length === 5 && dealPrice !== ""
      )
    }

    return isNormalCreateInput
  }

  async function handleCreateSubmit(event) {
    event.preventDefault()
    setShowMissingFieldsAlert(false)
    setOperationStatus({ ...operationStatus, show: false })

    if (!isCreateInputValid()) {
      setShowMissingFieldsAlert(true)
      scrollToTop()
      return
    }

    const transformedImages = []

    for (let i = 0; i < images.length; i += 1) {
      transformedImages.push({
        name: imageNames[i],
        content: images[i],
        contentResized: imagesResized[i],
      })
    }

    const productSellTypes = []

    var actualProductStock = productStock
    if (isProductOrder) productSellTypes.push(PRODUCT_ORDER_SELL_TYPE)
    if (isProductStock) {
      productSellTypes.push(PRODUCT_STOCK_SELL_TYPE)
    } else {
      actualProductStock = "1"
    }

    const body = {
      name,
      description,
      price,
      tags: [...tags],
      images: transformedImages,
      productType: productType,
      coverImage: imagesResized[0],
      productStock: actualProductStock, // productStock is 1 if isProductStock is false
      productSellTypes,
    }

    if (productType === productTypes.DEAL.name) {
      body.dealPrice = dealPrice
    } else if (productType === productTypes.LIGHTNING_DEAL.name) {
      body.lightningDealStartTime = lightningDealStartTime
      body.lightningDealDuration = lightningDealDuration
      body.lightningDealEndTime = calculateLightningDealEndTime(
        lightningDealDuration,
        lightningDealStartTime
      )
      body.dealPrice = dealPrice
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        [ACCESS_TOKEN_NAME]: token,
      },
    }

    try {
      setIsWaitingResponse(true)
      const res = await axios.put(
        `${REST_API}/${PRODUCT_ENDPOINT}`,
        JSON.stringify(body),
        config
      )

      if (res.status === 200) {
        imageInput.current.value = null
        setName("")
        setDescription("")
        setPrice("")
        setTags(new Set([]))
        setProductStock("1")
        setIsProductOrder(false)
        setIsProductStock(false)
        setImageData({
          images: [],
          imagesResized: [],
          imageNames: [],
          imagePreview: [],
        })

        if (
          productType === productTypes.DEAL.name ||
          productType === productTypes.LIGHTNING_DEAL.name
        ) {
          setDealPrice("")
        }
      }

      setOperationStatus({
        status: res.status,
        show: true,
        message: `O produto ${name} foi criado com sucesso.`,
        variant: "success",
      })
    } catch (error) {
      setOperationStatus({
        message:
          error?.response?.data?.message ||
          `O produto ${name} não foi criado corretamente, tente novamente.`,
        status: error.statusCode,
        show: true,
        variant: "danger",
      })
    } finally {
      setIsWaitingResponse(false)
      scrollToTop()
    }
  }

  async function handleEditSubmit(event) {
    event.preventDefault()
    setShowMissingFieldsAlert(false)
    setOperationStatus({ ...operationStatus, show: false })

    const body = {
      id,
    }

    if (location.state.name !== name) body.PRODUCT_NAME = name
    if (location.state.description !== description)
      body.PRODUCT_DESCRIPTION = description
    if (location.state.price !== price) body.PRODUCT_PRICE = parseInt(price, 10)
    if (!areArraysEqual(location.state.tags, [...tags]))
      body.PRODUCT_TAGS = [...tags]
    if (location.state.productType !== productType) body.PRODUCT_TYPE = productType

    const productSellTypes = []

    if (isProductOrder) productSellTypes.push(PRODUCT_ORDER_SELL_TYPE)
    if (isProductStock) productSellTypes.push(PRODUCT_STOCK_SELL_TYPE)
    if (!areArraysEqual(location.state.productSellTypes, productSellTypes)) {
      body.PRODUCT_SELL_TYPES = productSellTypes
    }

    if (!isProductStock) {
      body.PRODUCT_STOCK = "1"
    } else if (location.state.productStock !== productStock)
      body.PRODUCT_STOCK = productStock

    if (productType === productTypes.DEAL.name) {
      if (location.state.dealPrice !== dealPrice) {
        body.DEAL_PRICE = parseInt(dealPrice, 10)
      }

      body.removeAttributes = [
        "LIGHTNING_DEAL_DURATION",
        "LIGHTNING_DEAL_START_TIME",
        "LIGHTNING_DEAL_END_TIME",
      ]
    } else if (productType === productTypes.LIGHTNING_DEAL.name) {
      if (location.state.lightningDealDuration !== lightningDealDuration) {
        body.LIGHTNING_DEAL_DURATION = lightningDealDuration
      }

      if (location.state.lightningDealStartTime !== lightningDealStartTime) {
        body.LIGHTNING_DEAL_START_TIME = lightningDealStartTime
      }

      if (
        location.state.lightningDealDuration !== lightningDealDuration ||
        location.state.lightningDealStartTime !== lightningDealStartTime
      ) {
        body.LIGHTNING_DEAL_END_TIME = calculateLightningDealEndTime(
          lightningDealDuration,
          lightningDealStartTime
        )
      }

      if (location.state.dealPrice !== dealPrice) {
        body.DEAL_PRICE = parseInt(dealPrice, 10)
      }
    } else {
      body.removeAttributes = [
        "LIGHTNING_DEAL_DURATION",
        "LIGHTNING_DEAL_START_TIME",
        "LIGHTNING_DEAL_END_TIME",
      ]

      if (productType === productTypes.NORMAL.name) {
        body.removeAttributes.push("DEAL_PRICE")
      }
    }

    console.log(body)

    if (images.length > 0 && imagesResized.length > 0) {
      const transformedImages = []

      for (let i = 0; i < images.length; i += 1) {
        transformedImages.push({
          name: imageNames[i],
          content: images[i],
          contentResized: imagesResized[i],
        })
      }

      body.PRODUCT_IMAGES = transformedImages
      body.PRODUCT_COVER_IMAGE = imagesResized[0]
    }

    if (
      imageNames.length === 0 &&
      images.length === 0 &&
      !isArraySorted(orderIndex)
    ) {
      body.reorderImages = orderIndex
      body.PRODUCT_COVER_IMAGE = imagesResized[0]
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        [ACCESS_TOKEN_NAME]: token,
      },
    }

    try {
      setIsWaitingResponse(true)
      const res = await axios.patch(
        `${REST_API}/${PRODUCT_ENDPOINT}`,
        JSON.stringify(body),
        config
      )

      if (res.status === 200) {
        history.push(`/${MANAGE_PRODUCTS}`)
      }

      setOperationStatus({
        status: undefined,
        show: false,
        message: undefined,
        variant: undefined,
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
      scrollToTop()
    } finally {
      setIsWaitingResponse(false)
    }
  }

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <Form onSubmit={edit ? handleEditSubmit : handleCreateSubmit}>
        <AlertWithMessage
          variant={operationStatus.variant}
          show={operationStatus.show}
          setShow={(value) =>
            setOperationStatus({ ...operationStatus, show: value })
          }
          message={operationStatus.message}
        />
        <MissingFieldsAlert
          show={showMissingFieldsAlert}
          setShow={setShowMissingFieldsAlert}
          name={name}
          description={description}
          price={price}
          images={images}
          productType={productType}
          dealPrice={dealPrice}
          lightningDealStartTime={lightningDealStartTime}
        />
        <h1>{edit ? "Edite o produto" : "Crie um novo produto"}</h1>
        <Form.Group className="mb-3" controlId="formBasicProductName">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder=""
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicDescription">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder=""
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPrice">
          <Form.Label>Preço</Form.Label>
          <CurrencyInput
            className="form-control"
            placeholder=""
            decimalsLimit={2}
            onValueChange={(value) => setPrice(value)}
            allowNegativeValue={false}
            prefix="R$ "
            disableGroupSeparators
            value={price}
          />
        </Form.Group>
        <ProductSellTypes
          isProductStock={isProductStock}
          setIsProductStock={setIsProductStock}
          isProductOrder={isProductOrder}
          setIsProductOrder={setIsProductOrder}
          productStock={productStock}
          setProductStock={setProductStock}
        />
        <TagSelector createdTags={createdTags} tags={tags} setTags={setTags} />
        <ProductType
          lightningDealDuration={lightningDealDuration}
          setLightningDealDuration={setLightningDealDuration}
          lightningDealTime={lightningDealTime}
          setLightningDealTime={setLightningDealTime}
          lightningDealDate={lightningDealDate}
          setLightningDealDate={setLightningDealDate}
          productType={productType}
          setProductType={setProductType}
          dealPrice={dealPrice}
          setDealPrice={setDealPrice}
        />
        <ImageUploadPreview
          imageInput={imageInput}
          imageData={imageData}
          setImageData={setImageData}
          orderIndex={orderIndex}
          setOrderIndex={setOrderIndex}
        />
        <Button
          className="no-border secondary-background font-face-poppins-bold"
          type="submit"
          disabled={isWaitingResponse}
        >
          {isWaitingResponse && (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="visually-hidden">Aguarde...</span>
            </>
          )}
          {isWaitingResponse ? " Aguarde..." : "Enviar"}
        </Button>
      </Form>
    </Container>
  )
}
