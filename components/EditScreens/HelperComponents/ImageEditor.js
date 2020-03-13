import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactAvatarEditor from 'react-avatar-editor'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import $ from 'jquery'
import { dynamicImageFeedback } from '../../../actions/ImageUpload'
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@vmockinc/dashboard/Common/commonComps/Modal'
import FocusLock from 'react-focus-lock'
import { Panel, PanelGroup } from 'react-bootstrap'
import classNames from 'classnames'
import { notification } from '../../../services/helpers'
import {
  feedbackMap,
  colorMap,
  symbolMap,
} from '../../Constants/ProfilePictureFeedback'
import { editModalAriaLabel } from '../../Constants/AriaLabelText'
import _ from 'underscore'

class ImageEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      position: { x: 0.5, y: 0.5 },
      scale: 1.1,
      rotate: 0,
      borderRadius: 100,
      width: 200,
      height: 200,
      brightness: 1,
      contrast: 1,
      editMade: null,
      getNewFeedback: false,
      resetClicked: false,
    }
    this.handleScale = this.handleScale.bind(this)
    this.handleRotate = this.handleRotate.bind(this)
    this.setEditorRef = this.setEditorRef.bind(this)
    this.handlePositionChange = this.handlePositionChange.bind(this)
    this.handleRotateStraighten = this.handleRotateStraighten.bind(this)
    this.handleBrightness = this.handleBrightness.bind(this)
    this.handleContrast = this.handleContrast.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.straightenerValue = 0
    this.trackNotifyError = _.debounce(this.trackProcess, 2000, true)
    this.trackRotateClick = _.debounce(this.trackUserClick, 5000, true)
    this.trackZoomClick = _.debounce(this.trackUserClick, 5000, true)
    this.trackBrightness = _.debounce(this.trackUserClick, 5000, true)
    this.trackContrast = _.debounce(this.trackUserClick, 5000, true)
    this.trackStraighten = _.debounce(this.trackUserClick, 5000, true)
    this.trackPositionChange = _.debounce(this.trackUserClick, 5000, true)
    this.trackReset = _.debounce(this.trackUserClick, 5000, true)
    this.trackUpload = _.debounce(this.trackUserClick, 5000, true)
    this.trackChangePhoto = _.debounce(this.trackUserClick, 5000, true)
    this.trackNewPhotoAdded = _.debounce(this.trackUserClick, 5000, true)
    this.debounceDynamicFeedback = _.debounce(
      this.getDynamicFeedback,
      2000,
      false
    )
    this.canvasFilterStyle = `brightness(1) contrast(1)`
    this.currentFeedback = null
    this.featuresNotDetected = false
    this.initialFeedbackToShow = true
    this.initialFeedback = null
    this.initialFeaturesNotDetected = false
  }

  trackUserClick(tag) {
    sendTrackingData('event', 'aspire_edit_screen', 'click', tag)
  }

  trackProcess(tag) {
    sendTrackingData('process', 'aspire_edit_screen', 'notify_error', tag)
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

  getDynamicFeedback() {
    const { dynamicImageFeedback } = this.props
    const dataURI = this.editor.getImageScaledToCanvas().toDataURL()
    const img = this.dataURItoBlob(dataURI)
    const formData = new FormData()
    formData.append('profile_picture', img)
    dynamicImageFeedback(formData)
    this.setState({
      editMade: true,
      getNewFeedback: false,
      resetClicked: false,
    })
  }

  setEditorRef(editor) {
    if (editor) this.editor = editor
  }

  componentDidMount() {
    const { feedback } = this.props
    $(document).ready(function() {
      $('canvas').on('drop', function() {
        return false
      })
    })
    if (!_.isEmpty(feedback[0][1])) {
      this.initialFeedback = feedback[0][1]
    }
    this.initialFeaturesNotDetected = !_.isEmpty(feedback[1][1])
    sendTrackingData(
      'event',
      'aspire_edit_screen',
      'click',
      'image_editor_open'
    )
  }

  handlePositionChange(position) {
    this.setState({ position, editMade: true, getNewFeedback: true })
    this.debounceDynamicFeedback()
    this.trackPositionChange('image_position_adjusted')
  }

  handleScale(e) {
    const scale = parseFloat(e.target.value)
    this.setState({ scale, editMade: true, getNewFeedback: true })
    this.debounceDynamicFeedback()
    this.trackZoomClick('image_zoom_adjusted')
  }

  handleRotateStraighten(e) {
    const currentScale = parseFloat(e.target.value)
    let rotate = this.state.rotate
    let previousScale = this.straightenerValue
    let degree = currentScale - previousScale
    rotate = rotate + degree
    this.straightenerValue = currentScale
    this.setState({ rotate: rotate, editMade: true, getNewFeedback: true })
    this.debounceDynamicFeedback()
    this.trackStraighten('image_straighten')
  }

  handleRotate(position) {
    let rotate = this.state.rotate
    if (position == 'left') {
      rotate = rotate - 90
    } else {
      rotate = rotate + 90
    }
    rotate %= 360
    rotate = rotate < 0 ? rotate + 360 : rotate

    this.setState({ rotate: rotate, editMade: true, getNewFeedback: true })
    this.debounceDynamicFeedback()
    this.trackRotateClick('image_rotate_btn')
  }

  handleBrightness(e) {
    const brightness = parseFloat(e.target.value)
    this.setState({
      brightness: brightness,
      editMade: true,
      getNewFeedback: true,
    })
    this.canvasFilterStyle = `brightness(${brightness}) contrast(${this.state.contrast})`
    this.debounceDynamicFeedback()
    this.trackBrightness('image_brightness_adjusted')
  }

  handleContrast(e) {
    const contrast = parseFloat(e.target.value)
    this.setState({ contrast: contrast, editMade: true, getNewFeedback: true })
    this.canvasFilterStyle = `brightness(${this.state.brightness}) contrast(${contrast})`
    this.debounceDynamicFeedback()
    this.trackContrast('image_contrast_adjusted')
  }

  handleReset() {
    document.getElementById('zoom-slider').value = '1.1'
    document.getElementById('straighten-slider').value = '0'
    document.getElementById('brightness-slider').value = '1'
    document.getElementById('contrast-slider').value = '1'
    this.straightenerValue = 0
    this.setState({
      rotate: 0,
      scale: 1.1,
      brightness: 1,
      contrast: 1,
      editMade: false,
      getNewFeedback: false,
      resetClicked: true,
    })
    this.initialFeedbackToShow = true
    this.currentFeedback = this.initialFeedback
    this.featuresNotDetected = this.initialFeaturesNotDetected
    this.trackReset('reset_btn_clicked')
  }

  handleClick() {
    const { uploading } = this.props
    if (!uploading) {
      this.formPhoto.value = ''
      $(this.formPhoto).trigger('click')
    }
    this.trackChangePhoto('change_photo_clicked')
  }

  handleFile(e) {
    const { handleFileChange } = this.props
    var reader = new FileReader()
    var file = e.target.files[0]
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
        this.trackNotifyError('upload_picture_exceeds_size')
        this.formPhoto.value = ''
        return
      }
    }

    const fileTypes = ['image/png', 'image/jpeg', 'image/jpg']
    const invalidFileMessage =
      'The file type is not supported. Please choose an image.'
    if (fileTypes.indexOf(pictureType) === -1) {
      notification(invalidFileMessage, 'error')
      this.trackNotifyError('upload_failed_not_image_type')
      this.formPhoto.value = ''
      return
    }
    reader.onload = function(img) {
      handleFileChange(img.target.result)
    }.bind(this)
    reader.readAsDataURL(file)
    this.handleReset()
    setTimeout(() => {
      this.getDynamicFeedback()
    }, 1000)
    this.trackNewPhotoAdded('change_photo_submit')
  }

  getSliderBackgroundStyle(element) {
    let width = 0
    switch (element) {
      case 'zoom':
        width = ((parseFloat(this.state.scale) - 1) / 2) * 100
        break
      case 'straighten':
        width = ((parseFloat(this.straightenerValue) + 45) / 90) * 100
        break
      case 'brightness':
        width = (parseFloat(this.state.brightness) - 0.5) * 100
        break
      case 'contrast':
        width = (parseFloat(this.state.contrast) - 0.5) * 100
        break
    }
    return `linear-gradient(to right, #0075cb 0%,#0075cb ${width}%,#dadada ${width}%,#dadada 100%)`
  }

  handleSave() {
    const { handleSaveChanges, imageData } = this.props
    const { uploading_image, uploaded_image } = imageData

    if (this.state.getNewFeedback || (uploading_image && !uploaded_image)) {
      setTimeout(() => {
        handleSaveChanges()
      }, 2000)
    } else {
      handleSaveChanges()
    }
    this.setState({ editMade: false, getNewFeedback: false })
  }

  closeEditModal() {
    const {
      onRequestHide,
      hideEditModal,
      currentIndex,
      sectionWiseTextEditable,
      sectionWiseTextStatic,
    } = this.props
    if (_.isNull(this.state.editMade)) {
      onRequestHide()
    } else if (this.state.resetClicked) {
      hideEditModal(
        'profile_picture',
        currentIndex,
        sectionWiseTextStatic,
        sectionWiseTextStatic,
        false
      )
    } else {
      hideEditModal(
        'profile_picture',
        currentIndex,
        sectionWiseTextEditable,
        sectionWiseTextStatic,
        this.state.editMade
      )
    }
  }

  getFeedbackTiles() {
    const { imageData, northWesternCustomisation } = this.props

    let params = [
      ['face_frame_ratio', 'Face/Frame Ratio'],
      ['face_body_ratio', 'Face/Body Ratio'],
      ['background', 'Background Illumination'],
      ['pupil', 'Eye Contact'],
      ['foreground', 'Foreground Illumination'],
      ['smile', 'Smile Detection'],
    ]
    if (northWesternCustomisation) {
      params = [
        ['face_frame_ratio', 'Face/Frame Ratio'],
        ['foreground', 'Foreground Illumination'],
        ['background', 'Background Illumination'],
        ['pupil', 'Eye Contact'],
      ]
    }
    let output = {
      detected: [],
      not_detected: [],
    }
    this.featuresNotDetected = false
    _.map(params, (value, key) => {
      if (_.isUndefined(imageData[value[0]]['color_feedback'])) {
        this.featuresNotDetected = true
      } else {
        output.detected.push(
          <div className="col-sm-6 profile-picture-col">
            <span
              className={
                'profile-status-icon ' +
                colorMap[imageData[value[0]]['color_feedback']]
              }>
              {symbolMap[imageData[value[0]]['color_feedback']]}{' '}
            </span>
            <span
              className={classNames('feedback-tile-text', {
                'width-85':
                  feedbackMap[value[0]][imageData[value[0]]['color_feedback']]
                    .length > 85,
              })}>
              {value[1]}
            </span>
          </div>
        )
      }
    })

    return output['detected']
  }

  renderDynamicFeedback() {
    const { imageData, feedback, isOpen } = this.props
    if (!isOpen) {
      this.currentFeedback = null
    }
    const { uploading_image, uploaded_image } = imageData
    if (
      _.isEmpty(feedback[0][1]) &&
      _.isEmpty(feedback[1][1]) &&
      !uploaded_image &&
      !uploading_image
    ) {
      setTimeout(() => {
        this.getDynamicFeedback()
      }, 1000)
      this.currentFeedback = <div>Getting Feedback</div>
    }
    if (uploaded_image) {
      this.currentFeedback = this.getFeedbackTiles()
      this.initialFeedbackToShow = false
    }
    if (this.initialFeedbackToShow) {
      this.currentFeedback = this.initialFeedback
      this.featuresNotDetected = this.initialFeaturesNotDetected
    }
  }

  render() {
    const {
      img,
      isOpen,
      onRequestHide,
      feedback,
      loaderInput,
      imageData,
      focusDisable,
      northWesternCustomisation,
    } = this.props

    const { uploading_image, saving_image } = imageData
    let loaderEl = (
      <div className="lds-ellipsis">
        <div />
        <div />
        <div />
        <div />
      </div>
    )
    let reactAvatorCanvasFilter = `brightness(${this.state.brightness}) contrast(${this.state.contrast})`
    let zoomBackgroundStyle = this.getSliderBackgroundStyle('zoom')
    let straightenBackgroundStyle = this.getSliderBackgroundStyle('straighten')
    let brightnessBackgroundStyle = this.getSliderBackgroundStyle('brightness')
    let contrastBackgroundStyle = this.getSliderBackgroundStyle('contrast')
    this.renderDynamicFeedback()
    let saveButton = (
      <button
        aria-label={editModalAriaLabel['save']}
        className="btn btn-primary apply-btn"
        onClick={this.handleSave}>
        Save Changes
      </button>
    )
    if (uploading_image || this.state.getNewFeedback || saving_image) {
      saveButton = (
        <button
          aria-label={editModalAriaLabel['loading_feedback']}
          className="btn btn-primary apply-btn cusrsor-not-allowed"
          disabled>
          Save Changes
        </button>
      )
    } else if (!_.isEmpty(loaderInput)) {
      saveButton = (
        <button
          tabIndex={0}
          aria-label={editModalAriaLabel['saving']}
          className="btn btn-primary apply-btn cusrsor-not-allowed"
          disabled>
          Saving ...
        </button>
      )
    } else if (this.state.resetClicked) {
      saveButton = (
        <button
          tabIndex={0}
          aria-label={editModalAriaLabel['no_change_made']}
          className="btn btn-primary apply-btn cusrsor-not-allowed"
          disabled>
          Save Changes
        </button>
      )
    }
    let resetButton = (
      <button
        className="btn reset-btn"
        aria-label={editModalAriaLabel['reset']}
        onClick={this.handleReset}>
        Reset
      </button>
    )
    if (!this.state.editMade) {
      resetButton = (
        <button
          className="btn reset-btn cursor-not-allowed"
          aria-label={editModalAriaLabel['no_change_made']}
          disabled>
          Reset
        </button>
      )
    }
    if (this.state.resetClicked) {
      this.currentFeedback = this.initialFeedback
      this.featuresNotDetected = this.initialFeaturesNotDetected
    }
    let disabled = !_.isEmpty(loaderInput)
    return (
      <div>
        <FocusLock disabled={!isOpen || focusDisable}>
          <Modal
            className="edit-profile-picture-wrapper"
            isOpen={isOpen}
            onRequestHide={this.closeEditModal.bind(this)}>
            <ModalHeader>
              <a
                href="javascript:void(0);"
                className="icon-cross edit-close-btn"
                onClick={this.closeEditModal.bind(this)}></a>
              <ModalTitle>Edit Profile Picture</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="row edit-modal-body">
                <div className="col-sm-8 left-container">
                  <div
                    className="picture-canvas-container"
                    id="picture-canvas-container">
                    <div className="canvas-grid-container">
                      <div className="canvas-grid-container-top-horizontal" />
                      <div className="canvas-grid-container-bottom-horizontal" />
                      <div className="canvas-grid-container-left-vertical" />
                      <div className="canvas-grid-container-right-vertical" />
                    </div>
                    <ReactAvatarEditor
                      className="reactAvatorCanvasStyle"
                      ref={this.setEditorRef}
                      border={[150, 50]}
                      scale={parseFloat(this.state.scale)}
                      width={this.state.width}
                      height={this.state.height}
                      position={this.state.position}
                      onPositionChange={this.handlePositionChange}
                      rotate={parseFloat(this.state.rotate)}
                      borderRadius={this.state.borderRadius}
                      onSave={this.handleSave}
                      image={img}
                      filters={reactAvatorCanvasFilter}
                      disabled={disabled}
                    />
                  </div>
                  <div
                    className={classNames(
                      'dynamic-feedback-container',
                      uploading_image ? 'dynamic-feedback-loader' : '',
                      { 'padding-t-40': northWesternCustomisation }
                    )}>
                    {this.currentFeedback}
                    {loaderEl}
                    {this.featuresNotDetected ? (
                      <div className="text-red red-info-msg-detect">
                        * Unable to detect other features.
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="col-sm-4 right-container">
                  <PanelGroup
                    accordion
                    id="edit-profile-picture-modal"
                    defaultActiveKey="1"
                    onSelect={this.handlePanelCollapse}>
                    <Panel eventKey="1" className="panel-container">
                      <Panel.Heading>
                        <Panel.Title toggle>
                          <div>
                            <span>
                              <img
                                src={`${process.env.APP_BASE_URL}dist/images/edit-screens/profile-picture-crop.svg`}
                                alt="crop icon"
                              />
                            </span>
                            <span className="panel-tab-heading-text">
                              <strong>Crop</strong>
                            </span>
                            <span className="pull-right panel-arrow">
                              <img
                                src={`${process.env.APP_BASE_URL}dist/images/edit-screens/profile-picture-panel-arrow.svg`}
                                alt=""
                              />
                            </span>
                          </div>
                        </Panel.Title>
                      </Panel.Heading>
                      <Panel.Body collapsible>
                        <div className="panel-body-el">
                          <div className="panel-body-text">Zoom</div>
                          <input
                            className="edit-picture-slider"
                            aria-label="slider to zoom in your profile photo"
                            id="zoom-slider"
                            name="scale"
                            type="range"
                            onChange={this.handleScale}
                            min="1"
                            max="3"
                            step="0.01"
                            defaultValue="1.1"
                            style={{
                              background: zoomBackgroundStyle,
                            }}
                            disabled={disabled}
                          />
                        </div>
                        <div className="panel-body-el">
                          <div className="panel-body-text">Straighten</div>
                          <input
                            className="edit-picture-slider"
                            aria-label="slider to rotate your profile picture"
                            id="straighten-slider"
                            name="scale"
                            type="range"
                            onChange={this.handleRotateStraighten}
                            min="-45"
                            max="45"
                            step="0.5"
                            defaultValue="0"
                            style={{
                              background: straightenBackgroundStyle,
                            }}
                            disabled={disabled}
                          />
                        </div>
                        <div className="panel-body-el">
                          <div className="panel-body-text">Rotate</div>
                          <div>
                            <button
                              className="rotate-btn"
                              disabled={disabled}
                              onClick={() => this.handleRotate('left')}>
                              <img
                                className="rotate-img"
                                src={`${process.env.APP_BASE_URL}dist/images/edit-screens/rotate-left.svg`}
                                alt="rotate left"
                              />
                            </button>
                            <button
                              className="rotate-btn"
                              disabled={disabled}
                              onClick={() => this.handleRotate('right')}>
                              <img
                                className="rotate-img"
                                src={`${process.env.APP_BASE_URL}dist/images/edit-screens/rotate-right.svg`}
                                alt="rotate right"
                              />
                            </button>
                          </div>
                        </div>
                      </Panel.Body>
                    </Panel>
                    <Panel eventKey="2" className="panel-container-2">
                      <Panel.Heading>
                        <Panel.Title toggle>
                          <div>
                            <div>
                              <span>
                                {' '}
                                <img
                                  src={`${process.env.APP_BASE_URL}dist/images/edit-screens/profile-picture-illumination.svg`}
                                  alt="illuination icon"
                                />{' '}
                              </span>
                              <span className="panel-tab-heading-text">
                                <strong>Illumination</strong>
                              </span>
                              <span className="pull-right panel-arrow">
                                <img
                                  src={`${process.env.APP_BASE_URL}dist/images/edit-screens/profile-picture-panel-arrow.svg`}
                                  alt=""
                                />
                              </span>
                            </div>
                          </div>
                        </Panel.Title>
                      </Panel.Heading>
                      <Panel.Body collapsible>
                        <div className="panel-body-el">
                          <div className="panel-body-text">Brightness</div>
                          <input
                            className="edit-picture-slider"
                            aria-label="slider to increase decrease brightness"
                            id="brightness-slider"
                            name="scale"
                            type="range"
                            onChange={this.handleBrightness}
                            min="0.5"
                            max="1.5"
                            step="0.01"
                            defaultValue="1"
                            style={{
                              background: brightnessBackgroundStyle,
                            }}
                            disabled={disabled}
                          />
                        </div>
                        <div className="panel-body-el">
                          <div className="panel-body-text">Contrast</div>
                          <input
                            className="edit-picture-slider"
                            aria-label="slider to increase decrease contrast"
                            id="contrast-slider"
                            name="scale"
                            type="range"
                            onChange={this.handleContrast}
                            min="0.5"
                            max="1.5"
                            step="0.01"
                            defaultValue="1"
                            style={{
                              background: contrastBackgroundStyle,
                            }}
                            disabled={disabled}
                          />
                        </div>
                      </Panel.Body>
                    </Panel>
                  </PanelGroup>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="col-sm-2">
                <button
                  className="btn change-photo-btn"
                  onClick={e => this.handleClick(e)}>
                  <span className="change-photo-text">Change Photo</span>
                </button>
                <form method="post" ref={c => (this.form = c)}>
                  <input
                    type="file"
                    name="profile_picture"
                    accept="image/*"
                    className="sr-only"
                    ref={c => (this.formPhoto = c)}
                    onChange={this.handleFile}
                    className="hide-it"
                    aria-label="input field to change picture"
                  />
                </form>
              </div>
              <div className="col-sm-8 pull-right">
                {resetButton}
                {saveButton}
              </div>
            </ModalFooter>
          </Modal>
        </FocusLock>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    imageData: state.imageData,
  }
}
export default connect(mapStateToProps, { dynamicImageFeedback })(ImageEditor)
