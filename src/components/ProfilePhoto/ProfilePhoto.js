import React, { useState } from "react"

import ProfilePhotoDetails from "./ProfilePhotoDetails"

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
    const fileName = "profile-photo.jpg"
    fetch(url).then(async (response) => {
      const contentType = response.headers.get("content-type")
      const blob = await response.blob()
      const file = new File([blob], fileName, { contentType })

      setFile(file)
    })
  }

  const isProfilePhotoSet = imagePreview !== undefined
  if (isProfilePhotoSet && !isNewImage) {
    if (file === undefined) {
      getFile(imagePreview)
      return <></>
    }

    return (
      <ProfilePhotoDetails
        isProfilePhotoSet={isProfilePhotoSet}
        handleFileUpload={handleFileUpload}
        setPosition={setPosition}
        setZoom={setZoom}
        setRotate={setRotate}
        image={file}
        position={position}
        zoom={zoom}
        rotate={rotate}
        setAvatarImageEditorRef={setAvatarImageEditorRef}
      />
    )
  }

  return (
    <ProfilePhotoDetails
      isProfilePhotoSet={isProfilePhotoSet}
      handleFileUpload={handleFileUpload}
      setPosition={setPosition}
      setZoom={setZoom}
      setRotate={setRotate}
      image={imagePreview}
      position={position}
      zoom={zoom}
      rotate={rotate}
      setAvatarImageEditorRef={setAvatarImageEditorRef}
    />
  )
}
