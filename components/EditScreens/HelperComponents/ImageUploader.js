import React, { Component } from 'react'
import { connect } from 'react-redux'
import ImageEditor from './ImageEditor'
import { notification } from '../../../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import _ from 'underscore'
import { saveCurrentImage } from '../../../actions/ImageUpload'
import { editModalAriaLabel } from '../../Constants/AriaLabelText'

class ImageUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cropperOpen: false,
      img: null,
      croppedImg: props.imageUrl,
      currentImage: props.dataURI,
    }
    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleRequestHide = this.handleRequestHide.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.saveUploadedImage = this.saveUploadedImage.bind(this)
    this.openEditModal = this.openEditModal.bind(this)
    this.sendTrackingDataDebounceClick = _.debounce(
      sendTrackingData,
      1000,
      true
    )
    this.sendTrackingDataDebounce = _.debounce(sendTrackingData, 2000, true)
  }

  componentDidUpdate() {
    const { clicked, changeClicked, toggleKeyboardFunctionality } = this.props
    if (clicked) {
      changeClicked(false)
      $(this.formPhoto).trigger('click')
    }
    toggleKeyboardFunctionality(!this.state.cropperOpen)
  }

  handleFileChange(dataURI) {
    this.setState({
      img: dataURI,
      cropperOpen: true,
      currentImage: dataURI,
    })
    this.saveUploadedImage(dataURI)
  }

  saveUploadedImage(dataURI) {
    const { saveCurrentImage } = this.props
    const blob = this.dataURItoBlob(dataURI)
    const formData = new FormData()
    formData.append('original_picture', blob)
    saveCurrentImage(formData)
  }

  dataURItoBlob(dataURI) {
    if (_.isEmpty(dataURI)) {
      return null
    }
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1])
    // separate out the mime component
    var mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length)

    // create a view into the buffer
    var ia = new Uint8Array(ab)

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString })
    return blob
  }

  handleRequestHide() {
    sendTrackingData(
      'event',
      'aspire_edit_screen',
      'click',
      'cropped_img_close_btn'
    )
    this.setState({
      cropperOpen: false,
    })
    $('body').removeClass('modal-open')
  }

  handleClick(e) {
    e.preventDefault()
    const { uploading } = this.props
    if (!uploading) {
      this.formPhoto.value = ''
      $(this.formPhoto).trigger('click')
    }
    this.sendTrackingDataDebounceClick(
      'event',
      'aspire_edit_screen',
      'click',
      'click_to_change_btn'
    )
  }

  handleFile(e, file = null) {
    var reader = new FileReader()
    if (_.isNull(file)) {
      file = e.target.files[0]
    }
    if (!file) {
      return
    }
    let pictureName = null,
      pictureSize = null,
      pictureType = null

    if (file) {
      pictureName = file.name
      pictureSize = file.size
      pictureType = file.type
    }
    const notifyErrorOptions = { timeout: 10000 }
    if (pictureName) {
    }
    if (pictureSize) {
      if (pictureSize > 8388608) {
        notification('Failed to upload file. File size exceeds 8MB.', 'error')
        this.sendTrackingDataDebounce(
          'process',
          'aspire_edit_screen',
          'notify_error',
          'upload_picture_exceeds_size'
        )
        this.formPhoto.value = ''
        return
      }
    }

    const fileTypes = ['image/png', 'image/jpeg', 'image/jpg']
    const invalidFileMessage =
      'The file type is not supported. Please choose an image.'
    if (fileTypes.indexOf(pictureType) === -1) {
      notification(invalidFileMessage, 'error')
      this.sendTrackingDataDebounce(
        'process',
        'aspire_edit_screen',
        'notify_error',
        'upload_failed_not_image_type'
      )
      this.formPhoto.value = ''
      return
    }

    reader.onload = function(img) {
      this.handleFileChange(img.target.result)
    }.bind(this)
    reader.readAsDataURL(file)
  }

  openEditModal() {
    this.setState({
      croppedImg: this.state.croppedImg,
      cropperOpen: true,
    })
  }

  render() {
    const {
      imageUrl,
      uploading,
      processingStatus,
      isPictureUploaded,
      feedback,
      dataURI,
      hideEditModal,
      handleConfirmCloseModal,
      currentIndex,
      sectionWiseTextEditable,
      sectionWiseTextStatic,
      handleSaveChanges,
      loaderInput,
      focusDisable,
      northWesternCustomisation,
    } = this.props
    let imageToEdit = this.state.currentImage
    let uploadBtnText = 'Edit Profile Picture'
    if (!isPictureUploaded) {
      uploadBtnText = 'Upload'
      if (!_.isEmpty(imageToEdit)) {
        uploadBtnText = 'Edit Profile Picture'
      }
    }
    let clickToChangeBtn = (
      <button
        tabIndex={0}
        aria-label={
          isPictureUploaded
            ? editModalAriaLabel['profile_picture']['edit']
            : editModalAriaLabel['profile_picture']['upload']
        }
        className="btn btn-primary btn-click-to-change-picture"
        onClick={e => this.handleClick(e)}>
        {uploadBtnText}
      </button>
    )
    if (uploading) {
      clickToChangeBtn = (
        <a
          href="javascript:void(0);"
          className="btn btn-primary btn-click-to-change-picture cusrsor-not-allowed"
          type="button"
          disabled>
          Uploading. Please wait...
        </a>
      )
    }
    let editPictureBtn = (
      <a
        href="javascript:void(0);"
        className="btn btn-primary btn-click-to-change-picture"
        type="button"
        onClick={this.openEditModal}>
        {uploadBtnText}
      </a>
    )
    if (!_.isEmpty(imageToEdit)) {
      return (
        <div className="btn-click-to-change-picture-block">
          <ImageEditor
            handleClick={this.handleClick}
            img={imageToEdit}
            isOpen={this.state.cropperOpen}
            onRequestHide={this.handleRequestHide}
            handleFileChange={this.handleFileChange}
            feedback={feedback}
            uploading={uploading}
            handleConfirmCloseModal={handleConfirmCloseModal}
            hideEditModal={hideEditModal}
            currentIndex={currentIndex}
            sectionWiseTextEditable={sectionWiseTextEditable}
            sectionWiseTextStatic={sectionWiseTextStatic}
            handleSaveChanges={handleSaveChanges}
            loaderInput={loaderInput}
            focusDisable={focusDisable}
            northWesternCustomisation={northWesternCustomisation}
          />
          {editPictureBtn}
        </div>
      )
    }
    return (
      <div className="btn-click-to-change-picture-block">
        <form method="post" ref={c => (this.form = c)}>
          {clickToChangeBtn}
          <input
            aria-label={editModalAriaLabel['profile_picture']['input_file']}
            type="file"
            name="profile_picture"
            accept="image/*"
            className="sr-only"
            ref={c => (this.formPhoto = c)}
            onChange={this.handleFile}
            className="hide-it"
          />
        </form>
        {this.state.cropperOpen && (
          <ImageEditor
            handleClick={this.handleClick}
            img={this.state.img}
            isOpen={this.state.cropperOpen}
            onRequestHide={this.handleRequestHide}
            handleFileChange={this.handleFileChange}
            feedback={feedback}
            uploading={uploading}
            hideEditModal={hideEditModal}
            handleConfirmCloseModal={handleConfirmCloseModal}
            currentIndex={currentIndex}
            sectionWiseTextEditable={sectionWiseTextEditable}
            sectionWiseTextStatic={sectionWiseTextStatic}
            handleSaveChanges={handleSaveChanges}
            loaderInput={loaderInput}
            focusDisable={focusDisable}
            northWesternCustomisation={northWesternCustomisation}
          />
        )}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {}
}
export default connect(mapStateToProps, { saveCurrentImage })(ImageUploader)
