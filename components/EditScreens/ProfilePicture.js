import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loader from '../Loader'
import SamplesGuide from './Guides/SamplesGuide'
import classNames from 'classnames'
import { uploadImage, updateImageData } from '../../actions/ImageUpload'
import InfoScreens from '../InfoScreens'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import ImageUploader from './HelperComponents/ImageUploader'
import {
  feedbackMap,
  colorMap,
  symbolMap,
} from '../Constants/ProfilePictureFeedback'
import { editModalAriaLabel } from '../Constants/AriaLabelText'

class ProfilePicture extends Component {
  constructor(props) {
    super(props)
    this.notDetectedAnything = false
    this.state = {
      showInfoScreen: false,
      activeInfoScreen: '',
      clicked: false,
      editMade: false,
    }

    this.handleUndoClick = this.handleUndoClick.bind(this)
    this.changeClicked = this.changeClicked.bind(this)
    this.hasSampleScrolled = false
    this.handleSampleScroll = this.handleSampleScroll.bind(this)
    this.handleConfirmCloseModal = this.handleConfirmCloseModal.bind(this)
    this.sendTrackingDataDebounceUndo = _.debounce(sendTrackingData, 3000, true)
    this.sendTrackingDataDebounceSample = _.debounce(
      sendTrackingData,
      3000,
      true
    )
  }

  UNSAFE_componentWillMount() {
    const { updateImageData } = this.props
    updateImageData({
      updateKeys: [['edit_picture_mounted']],
      data: { edit_picture_mounted: true },
    })
  }

  componentDidMount() {
    const { sectionWiseTextEditable } = this.props
    window.addEventListener('scroll', this.handleSampleScroll)
    let url = this.fetchImageUrl(sectionWiseTextEditable[0]['picture_url'])
    $('.as-picture-bg-profile-pic-real').css(
      'background-image',
      'url(' + url + ')'
    )
    this.replaceImageWithAvatarIfNotPresent('edit-profile-img')
  }

  componentWillUnmount() {
    const { updateImageData } = this.props
    window.removeEventListener('scroll', this.handleSampleScroll)
    updateImageData({
      updateKeys: [['edit_picture_mounted']],
      data: { edit_picture_mounted: false },
    })
  }

  UNSAFE_componentWillUpdate() {
    this.replaceImageWithAvatarIfNotPresent('edit-profile-img')
    this.notDetectedAnything = false
  }

  componentDidUpdate() {
    const { imageData, sectionWiseTextEditable, sectionWiseText } = this.props

    if (imageData.uploaded_image == true) {
      const { updateImageData } = this.props
      updateImageData({
        updateKeys: [['uploaded_image']],
        data: { uploaded_image: false },
      })
      this.props.handleOnChangePicture(this.props.currentIndex, imageData)
    }

    // let url = _.isNull(imageData['url'])
    //   ? this.fetchImageUrl(sectionWiseTextEditable[0]['picture_url'])
    //   : imageData['url']
    let url = this.fetchImageUrl(sectionWiseText['imageUrl'])
    $('.as-picture-bg-profile-pic-real').css(
      'background-image',
      'url(' + url + ')'
    )
  }

  replaceImageWithAvatarIfNotPresent(id) {
    $('#' + id).on('error', function() {
      $(this).attr(
        'src',
        `${process.env.APP_BASE_URL}dist/images/profile-avatar.png`
      )
      $('.as-picture-bg-profile-pic-real').css(
        'background-image',
        'url(' +
          `${process.env.APP_BASE_URL}dist/images/profile-avatar.png` +
          ')'
      )
    })
  }

  changeClicked(clicked) {
    this.setState({ clicked: clicked })
  }

  changePicture() {
    this.changeClicked(true)
  }

  fetchImageUrl(url) {
    if (_.isEmpty(url)) {
      return `${process.env.APP_BASE_URL}dist/images/profile-avatar.png`
    }

    return url
  }

  renderFeedback(parameter, title, feedback, isFirst, tabIndex) {
    if (_.isUndefined(feedback['color_feedback'])) {
      this.notDetectedAnything = true
      return [
        <div className="col-sm-6 profile-picture-col">
          <span
            className={'profile-status-icon empty-icon ' + colorMap['gray']}>
            {' '}
          </span>
          <span
            tabIndex={tabIndex}
            aria-label={`${title} not detected`}
            className={classNames('feedback-tile-text', {
              'width-85': feedbackMap[parameter]['gray'].length > 85,
            })}>
            {title}
          </span>
        </div>,
        'not_detected',
      ]
    } else {
      return [
        <div className="col-sm-6 profile-picture-col">
          <span
            className={
              'profile-status-icon ' + colorMap[feedback['color_feedback']]
            }>
            {symbolMap[feedback['color_feedback']]}{' '}
          </span>
          <span
            tabIndex={tabIndex}
            aria-label={`${title} is in ${colorMap[
              feedback['color_feedback']
            ].substring(6)} zone`}
            className={classNames('feedback-tile-text', {
              'width-85':
                feedbackMap[parameter][feedback['color_feedback']].length > 85,
            })}>
            {title}
          </span>
        </div>,
        'detected',
      ]
    }
  }

  handleClick() {
    const { handleSaveChanges } = this.props
    this.setState({ editMade: false })
    handleSaveChanges()
  }

  handleUndoClick() {
    const { currentIndex } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'undo_changes_btn',
      currentSection: 'Profile Picture',
      currentIndex: currentIndex,
    }

    this.sendTrackingDataDebounceUndo(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.props.handleUndoData('profile_picture', this.props.currentIndex)
  }

  handleSampleScroll() {
    const { sectionName, currentIndex } = this.props
    if (!this.hasSampleScrolled) {
      this.hasSampleScrolled = true
      let jsonObjectForTracking = {
        eventLabel: 'sample_scrolled',
        currentSection: 'Profile Picture',
        currentIndex: currentIndex,
      }
      this.sendTrackingDataDebounceSample(
        'event',
        'aspire_edit_screen',
        'click',
        JSON.stringify(jsonObjectForTracking)
      )
    }
  }

  handleConfirmCloseModal(editMade) {
    this.setState({ editMade: editMade })
  }

  render() {
    const {
      fetchId,
      hideEditModal,
      sectionWiseText,
      sectionWiseTextStatic,
      sectionWiseTextEditable,
      feedback,
      handleSaveChanges,
      currentIndex,
      handleUndoData,
      imageData,
      uploadImage,
      processingStatus,
      loaderInput,
      toggleKeyboardFunctionality,
      focusDisable,
      communityCustomisations,
    } = this.props

    let northWesternCustomisation = !_.isNull(communityCustomisations)
      ? _.contains(
          communityCustomisations,
          'hide_smile_&_face_to_body_feedback'
        )
      : false

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
    let output = { detected: [], not_detected: [] }

    if (!_.isEmpty(sectionWiseTextEditable[0]['picture_url'])) {
      for (let i = 0; i < params.length; i++) {
        let isFirst = false
        if (i % 2 == 0) {
          isFirst = true
        }

        let t = this.renderFeedback(
          params[i][0],
          params[i][1],
          sectionWiseTextEditable[0][params[i][0]],
          isFirst,
          0
        )
        if (!_.isNull(t)) {
          output[t[1]].push(t[0])
        }
      }
    }
    var obj = output
    var result = Object.keys(obj).map(function(key) {
      return [key, obj[key]]
    })
    let initialFeedback = result
    let pictureNotUploaded = []
    let isPictureUploaded = true

    if (_.isEmpty(sectionWiseTextEditable[0]['picture_url'])) {
      pictureNotUploaded.push(
        <div className="as-no-picture-uploaded-msg">
          <span
            tabIndex={0}
            aria-label={editModalAriaLabel['profile_picture']['empty']}>
            You have not uploaded your profile picture.
          </span>
        </div>
      )
      isPictureUploaded = false
    }
    let imageUrl = this.fetchImageUrl(sectionWiseText['imageUrl'])
    if (imageData.refresh_url) {
      imageUrl = _.isNull(imageData['url'])
        ? this.fetchImageUrl('')
        : imageData['url']
    }
    let uploading = imageData.uploading_image

    return (
      <div className="as-edit-wrapper as-shadow">
        <Loader sectionName="Profile Picture" />
        <div className="as-edit-heading-wrapper">
          <a
            tabIndex={0}
            href="javascript:void(0);"
            aria-label={editModalAriaLabel['close']}
            className="icon-cross as-edit-close-btn modal-close-button"
            onClick={() =>
              hideEditModal(
                'profile_picture',
                currentIndex,
                sectionWiseTextEditable,
                sectionWiseTextStatic,
                this.state.editMade
              )
            }
          />
          <div className="as-edit-heading">Profile Picture</div>
        </div>
        <div className="as-eq-height-row">
          <div className="as-edit-container-left as-profile-picture-container">
            <SamplesGuide
              tabIndex={0}
              fetchId={fetchId}
              currentSection="Profile Picture"
            />
          </div>
          <div className="as-edit-container-right as-eq-height-col as-profile-picture-container">
            <div className="as-edit-heading-picture">
              <span
                tabIndex={0}
                aria-label={
                  editModalAriaLabel['profile_picture']['profile_pic']
                }>
                Your profile picture
              </span>
            </div>
            <div className="as-picture-sample-wrapper">
              <div className="as-picture-sample-img-container">
                <div className="as-picture-bg-color" />
                <div className="as-picture-bg-profile-pic-real" />
                <div className="as-edit-img">
                  <img
                    src={imageUrl}
                    className="edit-img-circular"
                    width="175"
                    height="175"
                    alt="Your profile picture"
                  />
                </div>
              </div>
              <div className="as-picture-sample-feedback-container">
                {pictureNotUploaded}
                <div className="row profile-picture-fake-div">
                  {output['detected']}
                </div>
                {this.notDetectedAnything ? (
                  <div className="text-red red-info-msg-detect">
                    * Unable to detect other features.
                  </div>
                ) : null}
              </div>
              <div className="as-edit-buttons-group-picture">
                <ImageUploader
                  processingStatus={processingStatus}
                  imageUrl={imageUrl}
                  uploading={uploading}
                  updateImage={uploadImage}
                  changeClicked={this.changeClicked}
                  clicked={this.state.clicked}
                  isPictureUploaded={isPictureUploaded}
                  toggleKeyboardFunctionality={toggleKeyboardFunctionality}
                  feedback={initialFeedback}
                  dataURI={imageData.dataUri}
                  handleConfirmCloseModal={this.handleConfirmCloseModal}
                  hideEditModal={hideEditModal}
                  currentIndex={currentIndex}
                  sectionWiseTextEditable={sectionWiseTextEditable}
                  sectionWiseTextStatic={sectionWiseTextStatic}
                  handleSaveChanges={handleSaveChanges}
                  loaderInput={loaderInput}
                  focusDisable={focusDisable}
                  northWesternCustomisation={northWesternCustomisation}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    imageData: state.imageData,
    processingStatus: state.aspireFeedbackData.status,
    loaderInput: state.aspireFeedbackData.mini_loader_text,
    communityCustomisations: state.AspireCommunityCustomisation.customisations,
  }
}
export default connect(mapStateToProps, { uploadImage, updateImageData })(
  ProfilePicture
)
