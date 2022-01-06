import React, { useState, useEffect, useRef } from "react"
import { useHistory, useLocation } from "react-router-dom"
import axios from "axios"
import ImageUploadPreview from "../ImageUploadPreview/ImageUploadPreview"
import CreateAlert from "../Alert/CreateAlert"
import EditAlert from "../Alert/EditAlert"
import {
  ACCESS_TOKEN_NAME,
  API,
  MANAGE_PRODUCTS,
  PRODUCT_ENDPOINT,
  TAGS_ENDPOINT,
} from "../../constants/constants"
import { Form, Container, Button, Spinner } from "react-bootstrap"
import TagSelector from "../TagSelector/TagSelector"
import { areArraysEqual } from "../../utils/compareTwoArrays"
import MissingFieldsAlert from "../Alert/MissingFieldsAlert"
import useToken from "../../hooks/useToken"
import ProductType, { productTypes } from "../ProductType/ProductType"
import { isArraySorted } from "../../utils/isArraySorted"
import { convertDateAndTimeToIsoString } from "../../utils/convertDateToIsoString"
import { lightingDealDurations } from "../LightingDealProduct/LightingDealProduct"
import { calculateLightingDealEndTime } from "../../utils/LightingDealUtils"
import scrollToTop from "../../utils/scrollToTop"

export default function ProductForm() {
  const { token } = useToken()
  const history = useHistory()
  const location = useLocation()
  const imageInput = useRef()
  const [createdTags, setCreatedTags] = useState([])
  const [edit, setEdit] = useState()
  const [id, setId] = useState()
  const [name, setName] = useState("")
  const [createdProductName, setCreatedProductName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [tags, setTags] = useState(new Set([]))
  const [imageData, setImageData] = useState({
    images: [],
    imageNames: [],
    imagePreview: [],
    imagesResized: [],
  })
  const [createStatus, setCreateStatus] = useState()
  const [editStatus, setEditStatus] = useState()
  const [showMissingFieldsAlert, setShowMissingFieldsAlert] = useState(false)
  const [showEditAlert, setShowEditAlert] = useState(false)
  const [showCreateAlert, setShowCreateAlert] = useState(false)
  const [isWaitingResponse, setIsWaitingResponse] = useState(false)
  const [productType, setProductType] = useState(productTypes.NORMAL.name)
  const [lightingDealTime, setLightingDealTime] = useState("10:00")
  const [lightingDealDate, setLightingDealDate] = useState(new Date())
  const [lightingDealDuration, setLightingDealDuration] = useState(
    lightingDealDurations["12h"].name
  )
  const [dealPrice, setDealPrice] = useState("")
  const [lightingDealStartTime, setLightingDealStartTime] = useState()
  const [orderIndex, setOrderIndex] = useState([])

  const { images, imageNames, imagesResized } = imageData

  useEffect(() => {
    if (lightingDealTime && lightingDealDate) {
      setLightingDealStartTime(
        convertDateAndTimeToIsoString(lightingDealDate, lightingDealTime)
      )
    }
  }, [lightingDealDate, lightingDealTime])

  useEffect(() => {
    async function getTagsFromDatabase() {
      const data = await fetch(`${API}/${TAGS_ENDPOINT}`)
      const json = await data.json()

      setCreatedTags(json)
    }

    getTagsFromDatabase()
  }, [createStatus, editStatus])

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

      if (location.state.productType === productTypes.DEAL.name) {
        setDealPrice(location.state.dealPrice)
      } else if (location.state.productType === productTypes.LIGHTING_DEAL.name) {
        setDealPrice(location.state.dealPrice)
        setLightingDealDate(location.state.lightingDealDate)
        setLightingDealTime(location.state.lightingDealTime)
        setLightingDealDuration(location.state.lightingDealDuration)
      }
    }
  }, [location])

  const isCreateInputValid = () => {
    const isNormalCreateInput =
      name !== "" && description !== "" && price !== "" && images.length > 0

    if (productType === productTypes.DEAL.name) {
      return isNormalCreateInput && dealPrice !== ""
    } else if (productType === productTypes.LIGHTING_DEAL.name) {
      return isNormalCreateInput && lightingDealTime.length === 5 && dealPrice !== ""
    }

    return isNormalCreateInput
  }

  async function handleCreateSubmit(event) {
    event.preventDefault()
    setShowMissingFieldsAlert(false)
    setShowCreateAlert(false)
    setShowEditAlert(false)

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

    const body = {
      name,
      description,
      price,
      tags: [...tags],
      images: transformedImages,
      productType: productType,
      coverImage: imagesResized[0],
    }

    if (productType === productTypes.DEAL.name) {
      body.dealPrice = dealPrice
    } else if (productType === productTypes.LIGHTING_DEAL.name) {
      body.lightingDealStartTime = lightingDealStartTime
      body.lightingDealDuration = lightingDealDuration
      body.lightingDealEndTime = calculateLightingDealEndTime(
        lightingDealDuration,
        lightingDealStartTime
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
        `${API}/${PRODUCT_ENDPOINT}`,
        JSON.stringify(body),
        config
      )
      setCreateStatus(res.status)

      if (res.status === 200) {
        imageInput.current.value = null
        setCreatedProductName(name)
        setName("")
        setDescription("")
        setPrice("")
        setTags(new Set([]))
        setImageData({
          images: [],
          imagesResized: [],
          imageNames: [],
          imagePreview: [],
        })

        if (
          productType === productTypes.DEAL.name ||
          productType === productTypes.LIGHTING_DEAL.name
        ) {
          setDealPrice("")
        }
      }
    } catch (error) {
      setCreateStatus(error.statusCode)
    } finally {
      setIsWaitingResponse(false)
      setShowCreateAlert(true)
      scrollToTop()
    }
  }

  async function handleEditSubmit(event) {
    event.preventDefault()
    setShowMissingFieldsAlert(false)
    setShowCreateAlert(false)
    setShowEditAlert(false)

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

    if (productType === productTypes.DEAL.name) {
      if (location.state.dealPrice !== dealPrice) {
        body.DEAL_PRICE = parseInt(dealPrice, 10)
        body.removeAttributes = [
          "LIGHTING_DEAL_DURATION",
          "LIGHTING_DEAL_START_TIME",
          "LIGHTING_DEAL_END_TIME",
        ]
      }
    } else if (productType === productTypes.LIGHTING_DEAL.name) {
      if (location.state.lightingDealDuration !== lightingDealDuration) {
        body.LIGHTING_DEAL_DURATION = lightingDealDuration
      }

      if (location.state.lightingDealStartTime !== lightingDealStartTime) {
        body.LIGHTING_DEAL_START_TIME = lightingDealStartTime
      }

      if (
        location.state.lightingDealDuration !== lightingDealDuration ||
        location.state.lightingDealStartTime !== lightingDealStartTime
      ) {
        body.LIGHTING_DEAL_END_TIME = calculateLightingDealEndTime(
          lightingDealDuration,
          lightingDealStartTime
        )
      }

      if (location.state.dealPrice !== dealPrice) {
        body.DEAL_PRICE = parseInt(dealPrice, 10)
      }
    } else if (location.state.productType !== productTypes.NORMAL.name) {
      body.removeAttributes = [
        "LIGHTING_DEAL_DURATION",
        "DEAL_PRICE",
        "LIGHTING_DEAL_START_TIME",
        "LIGHTING_DEAL_END_TIME",
      ]
    }

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
        `${API}/${PRODUCT_ENDPOINT}`,
        JSON.stringify(body),
        config
      )

      if (res.status === 200) {
        history.push(`/${MANAGE_PRODUCTS}`)
      }
    } catch (error) {
      setEditStatus(error.statusCode)
      setShowEditAlert(true)
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
        {edit ? (
          <EditAlert
            show={showEditAlert}
            setShow={setShowEditAlert}
            status={editStatus}
            editedProductName={location.state.name}
            newEditedProductName={name}
          />
        ) : (
          <CreateAlert
            show={showCreateAlert}
            setShow={setShowCreateAlert}
            status={createStatus}
            createdProductName={createdProductName}
          />
        )}
        <MissingFieldsAlert
          show={showMissingFieldsAlert}
          setShow={setShowMissingFieldsAlert}
          name={name}
          description={description}
          price={price}
          images={images}
          productType={productType}
          dealPrice={dealPrice}
          lightingDealStartTime={lightingDealStartTime}
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
          <Form.Control
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder=""
          />
        </Form.Group>
        <TagSelector createdTags={createdTags} tags={tags} setTags={setTags} />
        <ProductType
          lightingDealDuration={lightingDealDuration}
          setLightingDealDuration={setLightingDealDuration}
          lightingDealTime={lightingDealTime}
          setLightingDealTime={setLightingDealTime}
          lightingDealDate={lightingDealDate}
          setLightingDealDate={setLightingDealDate}
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
        <Button variant="primary" type="submit" disabled={isWaitingResponse}>
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
