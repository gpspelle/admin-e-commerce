import React, { useState } from "react"
import AvatarEditor from "react-avatar-editor"
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css"
import RangeSlider from "react-bootstrap-range-slider"
import { Form } from "react-bootstrap"

export const zoomMin = 1
export const rotateMin = 0
export const defaultPosition = { x: 0.5, y: 0.5 }

export default function ProfilePhoto({
  zoom,
  setZoom,
  rotate,
  setRotate,
  position,
  setPosition,
  imagePreview,
  setImagePreview,
  setAvatarImageEditorRef,
}) {
  const zoomMax = 10
  const zoomStep = 0.25
  const rotateMax = 360
  const rotateStep = 15
  const [isNewImage, setIsNewImage] = useState(false)
  const [file, setFile] = useState(undefined)

  const handleFileUpload = async (e) => {
    const filesAsArray = [...e.target.files]
    const file = filesAsArray[0]

    setImagePreview(file)
    setZoom(zoomMin)
    setRotate(rotateMin)
    setPosition(defaultPosition)
    setIsNewImage(true)
  }

  const getFile = async (url) => {
    const fileName = "myFile.jpg"
    fetch(url).then(async (response) => {
      const contentType = response.headers.get("content-type")
      const blob = await response.blob()
      const file = new File([blob], fileName, { contentType })

      setFile(file)
    })
  }

  if (imagePreview && !isNewImage) {
    if (!file) {
      getFile(imagePreview)
      return <></>
    }

    return (
      <div>
        <p className="my-2">Foto de Perfil</p>
        <Form.Control
          type="file"
          multiple={false}
          className="form-control my-2"
          accept=".jpg, .jpeg, .png"
          onChange={(e) => handleFileUpload(e)}
        />
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <AvatarEditor
            image={file}
            position={position}
            onPositionChange={(e) => setPosition(e)}
            width={300}
            height={300}
            color={[83, 83, 83, 0.6]} // RGBA
            scale={parseFloat(zoom)}
            rotate={parseFloat(rotate)}
            borderRadius={300}
            ref={setAvatarImageEditorRef}
          />
        </div>
        <Form.Group className="mb-3" controlId="formProfilePhotoZoom">
          <Form.Label>Zoom</Form.Label>
          <RangeSlider
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            min={zoomMin}
            max={zoomMax}
            step={zoomStep}
          />
          <Form.Label>Rotação</Form.Label>
          <RangeSlider
            value={rotate}
            onChange={(e) => setRotate(e.target.value)}
            min={rotateMin}
            max={rotateMax}
            step={rotateStep}
          />
        </Form.Group>
      </div>
    )
  }

  return (
    <div>
      {imagePreview === undefined ? (
        <p>Ainda não tem foto de perfil? Adicione uma</p>
      ) : (
        <p className="my-2">Foto de Perfil</p>
      )}
      <Form.Control
        type="file"
        multiple={false}
        className="form-control my-2"
        accept=".jpg, .jpeg, .png"
        onChange={(e) => handleFileUpload(e)}
      />
      {imagePreview !== undefined && (
        <div>
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <AvatarEditor
              image={imagePreview}
              position={position}
              onPositionChange={(e) => setPosition(e)}
              width={300}
              height={300}
              color={[83, 83, 83, 0.6]} // RGBA
              scale={parseFloat(zoom)}
              rotate={parseFloat(rotate)}
              borderRadius={300}
              ref={setAvatarImageEditorRef}
            />
          </div>
          <Form.Group className="mb-3" controlId="formProfilePhotoZoom">
            <Form.Label>Zoom</Form.Label>
            <RangeSlider
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              min={zoomMin}
              max={zoomMax}
              step={zoomStep}
            />
            <Form.Label>Rotação</Form.Label>
            <RangeSlider
              value={rotate}
              onChange={(e) => setRotate(e.target.value)}
              min={rotateMin}
              max={rotateMax}
              step={rotateStep}
            />
          </Form.Group>
        </div>
      )}
    </div>
  )
}
