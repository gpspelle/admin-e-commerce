import React from "react"
import AvatarEditor from "react-avatar-editor"
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css"
import RangeSlider from "react-bootstrap-range-slider"
import { Form } from "react-bootstrap"
import { rotateMin, zoomMin } from "./ProfilePhoto"

const zoomMax = 10
const zoomStep = 0.25
const rotateMax = 360
const rotateStep = 15

export default function ProfilePhotoDetails({
  isProfilePhotoSet,
  handleFileUpload,
  setPosition,
  setZoom,
  setRotate,
  image,
  position,
  zoom,
  rotate,
  setAvatarImageEditorRef,
}) {
  return (
    <div>
      {isProfilePhotoSet ? (
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
      {isProfilePhotoSet && (
        <div>
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <AvatarEditor
              image={image}
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
