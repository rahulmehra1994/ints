import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import _ from 'underscore'
import FeedbackRating from './FeedbackRating'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@vmockinc/dashboard/Common/commonComps/Modal'
import {
  checkForRendering,
  hideFeedbackModal,
  createCustomerFeedback,
} from '../../actions/CustomerFeedback'
import {
  MultipleChoiceQuestion,
  TextQuestion,
  SingleRatingQuestion,
  QuestionSet,
  SelectCheckBoxesQuestion,
} from './FeedbackQuestions'
import constants from '../../config/constants'
import { customerFeedbackAriaLabel } from '../Constants/AriaLabelText'
import FocusLock from 'react-focus-lock'

class CustomerFeedback extends Component {
  constructor(props) {
    super(props)
    this.setFeedbackRating = this.setFeedbackRating.bind(this)
    this.textareaChange = this.textareaChange.bind(this)
    this.changeRadio = this.changeRadio.bind(this)
    this.changeCheckBox = this.changeCheckBox.bind(this)
    this.state = {
      rating: 0,
      exp_user_experience: 0,
      exp_aesthetics: 0,
      exp_navigation_ease: 0,
      exp_clarity_consistency: 0,
      exp_fonts_language: 0,
      most_liked_aspect: null,
      improvement: null,
      suggestion: null,
      aspect_profile_picture_evaluation: 0,
      aspect_headline_suggestion: 0,
      aspect_content_feedback: 0,
      aspect_language_feedback: 0,
      aspect_skills_feedback: 0,
      aspect_profile_visibility_feedback: 0,
      aspect_edit_mode: 0,
      aspect_resume_skills_match: 0,
      aspect_logs: 0,
    }
  }

  componentDidMount() {
    // sendTrackingData('event', 'aspire_customer_feedback_modal', 'auto_trigger', 'feedback_form_open')
  }

  componentWillUnmount() {}

  setFeedbackRating(rating, column) {
    this.state[column] = parseInt(rating)
  }

  hideModal() {
    sendTrackingData(
      'event',
      'aspire_customer_feedback_modal',
      'click',
      'hide_feedback_form'
    )
    const { hideFeedbackModal, checkForRendering } = this.props
    this.setState({ showErrorMessage: false })
    let interval = constants.interval
    interval = interval * 60 * 1000
    setTimeout(function() {
      checkForRendering()
    }, interval)
    hideFeedbackModal()
    setTimeout(() => {
      this.scrollToTop()
    }, 2000)
  }

  handleSubmit() {
    const { createCustomerFeedback } = this.props
    if (this.state.rating == 0) {
      this.setState({ showErrorMessage: true })
      this.scrollToTop()
      sendTrackingData(
        'event',
        'aspire_customer_feedback_modal',
        'click',
        'submit_feedback_error'
      )
    } else {
      sendTrackingData(
        'event',
        'aspire_customer_feedback_modal',
        'click',
        'submit_feedback_form'
      )
      this.hideModal()
      createCustomerFeedback(this.state)
    }
  }

  scrollToTop() {
    $('.modal-backdrop.customer-feedback').animate({ scrollTop: 0 }, 300)
  }

  inputChange(e) {
    var inputBox = e.target.value
    this.state[e.target.name] = inputBox
  }

  textareaChange(e) {
    this.state[e.target.name] = e.target.value
  }

  changeRadio(e) {
    let selectedRadio = e.target.value
    let questionName = e.target.name
    this.state[questionName] = selectedRadio
  }

  changeCheckBox(e) {
    let checked = e.target.checked
    if (checked) {
      this.state[e.target.value] = 1
    } else {
      this.state[e.target.value] = 0
    }
  }

  renderErrorMessage() {
    const { showErrorMessage } = this.state
    if (showErrorMessage) {
      return (
        <div className="error-text" aria-live="polite">
          Please fill all the mandatory (* marked) question(s) and then Submit
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    const { user, customerFeedback, isEditOpen, checkForRendering } = this.props
    let { isOpen } = customerFeedback
    const {
      rating,
      exp_user_experience,
      exp_aesthetics,
      exp_navigation_ease,
      exp_clarity_consistency,
      exp_fonts_language,
      most_liked_aspect,
      improvement,
      suggestion,
    } = this.state
    // isOpen = !tourActive && isOpen

    let aspectRatingsSubQuestions = {
      exp_user_experience: {
        text: 'User Experience',
        value: exp_user_experience,
      },
      exp_aesthetics: { text: 'Aesthetics and Layout', value: exp_aesthetics },
      exp_navigation_ease: {
        text: 'Ease of Navigation',
        value: exp_navigation_ease,
      },
      exp_clarity_consistency: {
        text: 'Clarity and Consistency of Information',
        value: exp_clarity_consistency,
      },
      exp_fonts_language: {
        text: 'Use of Fonts and Language',
        value: exp_fonts_language,
      },
    }
    let aspectRatings = (
      <QuestionSet
        className="aspect-ratings"
        mainText="Based on your experience, please rate the following aspects on a scale of 1 to 5 (1 being the lowest, 5 being the highest)"
        setFeedbackRating={this.setFeedbackRating}
        questions={aspectRatingsSubQuestions}
      />
    )

    let ratingQuestion = (
      <SingleRatingQuestion
        className="scale-rating"
        mainText="Overall how would you rate Aspire as a platform for improving your LinkedIn profile?"
        setFeedbackRating={this.setFeedbackRating}
        rating={rating}
        fieldName="rating"
        mandatory={true}
      />
    )

    let mostLikedAspectOptions = {
      aspect_profile_picture_evaluation: 'Profile Picture Evaluation',
      aspect_headline_suggestion: 'Headline Suggestions',
      aspect_content_feedback: 'Content Feedback',
      aspect_language_feedback: 'Language Feedback',
      aspect_skills_feedback: 'Skills Feedback',
      aspect_profile_visibility_feedback: 'Profile Visibility Feedback',
      aspect_edit_mode: 'Edit Mode',
      aspect_resume_skills_match: 'Resume Skills Match',
      aspect_logs: 'Logs',
    }

    let mostLikedAspect = (
      <SelectCheckBoxesQuestion
        className="most-liked-aspect"
        mainText="Which aspect of the platform did you like the most?"
        changeOption={this.changeCheckBox}
        type="checkbox"
        options={mostLikedAspectOptions}
        questionName="most_liked_aspect"
      />
    )

    let improvementQuestion = (
      <TextQuestion
        className="improvement"
        mainText="What are the features that you would like to improve or add to the platform?"
        textareaChange={this.textareaChange}
        fieldName="improvement"
      />
    )

    let suggestionQuestion = (
      <TextQuestion
        className="suggestions"
        mainText="Do you have any other comments, questions or suggestions?"
        textareaChange={this.textareaChange}
        fieldName="suggestion"
        placeholder="I would like to see.."
      />
    )

    let feedbackBlock = (
      <div className="feedback-block">
        {this.renderErrorMessage()}
        {ratingQuestion}
        {mostLikedAspect}
        {aspectRatings}
        {improvementQuestion}
        {suggestionQuestion}
      </div>
    )

    const dialogStyles = {
      base: {
        top: -600,
        transition: 'top 0.4s',
      },
      open: {
        top: 0,
        left: 0,
        right: 0,
        margin: '30px auto',
      },
    }

    isOpen = isOpen && !isEditOpen

    return (
      <FocusLock disabled={!isOpen} returnFocus={true}>
        <Modal
          role="form"
          aria-label="some"
          className="customer-feedback"
          isOpen={isOpen}
          onRequestHide={this.hideModal.bind(this)}
          dialogStyles={dialogStyles}>
          <ModalBody>
            <button
              className="close-btn"
              onClick={this.hideModal.bind(this)}
              aria-label={customerFeedbackAriaLabel['close']}>
              x
            </button>
            <div
              className="modal-heading"
              aria-live="polite"
              aria-label={`Hi ${user.firstName}. ${
                customerFeedbackAriaLabel['feedbackLive']
              }`}>
              <div className="title">Hi {user.firstName}</div>
              <p>
                We seek your valuable inputs to ensure that you get the best
                feedback on your LinkedIn profile. Please take out a minute and
                share your thoughts about the platform.
              </p>
            </div>
            {feedbackBlock}
            <div className="row">
              <div className="col-sm-6">
                <button
                  className="btn btn-primary btn-block"
                  onClick={this.hideModal.bind(this)}
                  aria-label={customerFeedbackAriaLabel['later']}>
                  Remind me later
                </button>
              </div>
              <div className="col-sm-6">
                <button
                  className="btn btn-primary btn-block"
                  onClick={this.handleSubmit.bind(this)}
                  aria-label={customerFeedbackAriaLabel['submit']}>
                  Submit Feedback
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </FocusLock>
    )
  }
}

CustomerFeedback.propTypes = {
  children: PropTypes.node,
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user.data,
    customerFeedback: state.customerFeedback,
    isEditOpen: state.detailedFeedbackUi.isEditOpen,
    // tourActive:state.feedbackReducer.tourActive,
    // tourActive: state.tour.tourStatus,
  }
}

export default connect(
  mapStateToProps,
  { hideFeedbackModal, createCustomerFeedback, checkForRendering }
)(CustomerFeedback)
