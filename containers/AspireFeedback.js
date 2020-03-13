import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import {
  fetchFeedback,
  redirectSelect,
  runNotifier,
  updateFeedbackState,
  resumeOrCv,
} from '../actions/AspireFeedback'
import {
  updateResumeState,
  updatePdfState,
  updateFunctionState,
} from '../actions/Login'
import { generateUrl } from '../services/helpers'
import { updateEditedDataState } from '../actions/Edit'
import { refreshImageUrl } from '../actions/ImageUpload'
import AspireFeedbackComponent from '../components/AspireFeedback'
import { notification } from '../services/helpers'
import Loading from '@vmockinc/dashboard/Dashboard/components/Loading'
import _ from 'underscore'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

const timeOutMilliseconds = 2000

class AspireFeedback extends Component {
  constructor() {
    super()
    this.state = {
      elapsed: 0,
      loaded: false,
      prev_fetch_id: 0,
      elapsed_static: 0,
      loaded_static: true,
      fetch_id_static: 0,
      latest_fetch_id: null,
    }
    this.mini_loader_text = ''
    this.prev_elapsed_static = -1
    this.fetched_at_time = []
    this.fetchResume = this.fetchResume.bind(this)
    this.fetchPdf = this.fetchPdf.bind(this)
    this.fetchEditedData = this.fetchEditedData.bind(this)
    this.fetchChangedFunction = this.fetchChangedFunction.bind(this)
    this.sendTrackingDataDebounce = _.debounce(sendTrackingData, 2000, true)
  }

  UNSAFE_componentWillMount() {
    const { userCustomizations = {} } = this.props

    if (
      !_.isEmpty(userCustomizations) &&
      userCustomizations.hasOwnProperty('is_resume_called_cv')
    ) {
      let result = userCustomizations['is_resume_called_cv']
      this.props.resumeOrCv(result)
    } else {
      this.props.resumeOrCv(0)
    }
  }

  componentDidMount() {
    this.imgUrlRefresher = setInterval(() => this.updateImageUrl(), 1800000)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      _.isUndefined(this.interval) &&
      this.state.loaded == false &&
      nextProps.latestFetchIdFetched
    ) {
      let lastFetchId = nextProps.latestFetchId
      nextProps.fetchFeedback(lastFetchId, false)
      this.interval = setInterval(
        () => this.tick('loaded', 'feedback_fetched', false, 1000),
        1000
      )
    }
  }

  UNSAFE_componentWillUpdate() {
    let modulo = 5
    if (
      this.props.latestFetchIdFetched &&
      this.state.elapsed != 0 &&
      this.state.elapsed % modulo == 0 &&
      this.state.loaded == false &&
      this.props.feedback_fetched == false
    ) {
      const {
        match: { params },
        fetchFeedback,
      } = this.props
      const { fetchId } = params
      let lastFetchId = this.props.latestFetchId
      fetchFeedback(lastFetchId, false)
    }

    if (this.mini_loader_text == 'edited_data') {
      modulo = 2
    }

    if (
      this.mini_loader_text == 'resume' ||
      this.mini_loader_text == 'pdf' ||
      this.mini_loader_text == 'changed_function'
    ) {
      modulo = 2
    }

    if (
      this.state.elapsed_static != 0 &&
      this.state.elapsed_static % modulo == 0 &&
      this.state.elapsed_static !== this.prev_elapsed_static &&
      !_.contains(this.fetched_at_time, this.state.elapsed_static) &&
      this.state.loaded_static == false &&
      this.props.feedback_fetched == false
    ) {
      const { fetchFeedback } = this.props
      this.prev_elapsed_static = this.state.elapsed_static
      this.fetched_at_time.push(this.state.elapsed_static)
      fetchFeedback(this.state.fetch_id_static)
    }
  }

  componentDidUpdate() {
    const {
      allCapsResume,
      allSmallResume,
      normalResume,
      match: { params },
    } = this.props
    var updatePath = false
    let lastFetchId = this.props.latestFetchId
    let paramFetchId = params.fetchId
    let pathFetchId = -1
    let page = _.isUndefined(params.page) ? 'summary' : params.page
    let locationHash = this.props.location.hash
    if (
      !_.isNull(lastFetchId) &&
      parseInt(lastFetchId) !== parseInt(paramFetchId) &&
      parseInt(this.state.latest_fetch_id) != parseInt(paramFetchId)
    ) {
      // if URL path fetch id is not the latest fetch id for the user
      pathFetchId = lastFetchId
      updatePath = true
    }

    if (this.state.loaded == false && this.props.feedback_fetched == true) {
      this.setState({ loaded: true })
      clearInterval(this.interval)
      const { status } = this.props
      if (status == 'failed') {
        notification('Oops! Processing failed.', 'error', timeOutMilliseconds)
      }
    }

    if (
      this.state.loaded_static == false &&
      this.props.feedback_fetched == true
    ) {
      clearInterval(this.intervalStatic)
      // Check that new state variables from reducer have correctly replaced previous screen data.
      // e.g. in Containers/DetailedFeedback, fetchProfileData() has to be called again, for DetailedFeedback reducer state.
      // edit section data gets updated only on mount and unmount. to be updated.

      const { status, location, updateFeedbackState } = this.props
      if (!_.isUndefined(status)) {
        if (
          status === 'done' ||
          status === 'wrong_resume' ||
          status === 'wrong_pdf' ||
          status === 'invalid_pdf' ||
          status === 'size_exceeded' ||
          status === 'unsupported_language'
        ) {
          if (
            status !== 'wrong_resume' &&
            status !== 'wrong_pdf' &&
            status !== 'invalid_pdf' &&
            status !== 'size_exceeded' &&
            status !== 'unsupported_language'
          ) {
            pathFetchId = this.state.fetch_id_static
            updatePath = true
          }

          if (status === 'done') {
          } else if (status === 'wrong_resume') {
            notification(
              'Wrong ' + allSmallResume + ' file uploaded !',
              'error',
              timeOutMilliseconds
            )
            this.sendTrackingDataDebounce(
              'process',
              'aspire',
              'notify_error',
              'wrong_resume_uploaded'
            )
          } else if (status === 'wrong_pdf') {
            notification(
              'Wrong pdf file uploaded !',
              'error',
              timeOutMilliseconds
            )
            this.sendTrackingDataDebounce(
              'process',
              'aspire',
              'notify_error',
              'wrong_pdf_uploaded'
            )
          } else if (status === 'invalid_pdf') {
            notification(
              'Invalid pdf file uploaded !',
              'error',
              timeOutMilliseconds
            )
            this.sendTrackingDataDebounce(
              'process',
              'aspire',
              'notify_error',
              'invalid_pdf_uploaded'
            )
          } else if (status === 'size_exceeded') {
            notification('Profile size limit exceeded !', 'error')
            this.sendTrackingDataDebounce(
              'process',
              'aspire',
              'notify_error',
              'pdf_size_exceeded'
            )
          } else if (status === 'unsupported_language') {
            notification(
              "Currently, we don't support this language in LinkedIn pdf. We have notified our tech team and will reach back to you soon.",
              'error'
            )
            this.sendTrackingDataDebounce(
              'process',
              'aspire',
              'notify_error',
              'unsupported_language',
              4000
            )
          }
        } else if (status === 'failed') {
          notification('Oops! Processing failed.', 'error', timeOutMilliseconds)
          this.sendTrackingDataDebounce(
            'process',
            'aspire',
            'notify_error',
            'processing_failed'
          )
        }

        if (this.mini_loader_text == 'resume') {
          const { updateResumeState } = this.props
          updateResumeState({
            updateKeys: [['uploading_resume'], ['uploaded_resume']],
            data: { uploading_resume: false, uploaded_resume: false },
          })
          if (status === 'done') {
            notification(
              'Check the Skills profile guide in Edit mode to see the ' +
                normalResume +
                ' Skills Match.',
              'information',
              4000
            )
            this.sendTrackingDataDebounce(
              'process',
              'aspire_resume_upload',
              'notify_success',
              'resume_uploaded_successfully'
            )
          }
        } else if (this.mini_loader_text == 'pdf') {
          const { updatePdfState } = this.props
          updatePdfState({
            updateKeys: [['uploading_pdf'], ['uploaded_pdf']],
            data: { uploading_pdf: false, uploaded_pdf: false },
          })
          if (status === 'done') {
            notification(
              'Profile processed',
              'information',
              timeOutMilliseconds
            )
            this.sendTrackingDataDebounce(
              'process',
              'aspire_pdf_upload',
              'notify_success',
              'pdf_uploaded_successfully'
            )
          }
        } else if (this.mini_loader_text == 'edited_data') {
          const { updateEditedDataState } = this.props
          updateEditedDataState({
            updateKeys: [['uploading_edited_data'], ['uploaded_edited_data']],
            data: { uploading_edited_data: false, uploaded_edited_data: false },
          })
          if (status === 'done') {
            notification(
              'Profile processed.',
              'information',
              timeOutMilliseconds
            )
            this.sendTrackingDataDebounce(
              'process',
              'aspire_edit',
              'notify_success',
              'edit_done_successfully'
            )
          }
        } else if (this.mini_loader_text == 'changed_function') {
          const { updateFunctionState } = this.props
          updateFunctionState({
            updateKeys: [['changing_function'], ['changed_function']],
            data: { changing_function: false, changed_function: false },
          })
          if (status === 'done') {
            notification(
              'Profile processed.',
              'information',
              timeOutMilliseconds
            )
            this.sendTrackingDataDebounce(
              'process',
              'aspire_target_function_change',
              'notify_success',
              'profile_processed_successfully'
            )
          }
        }

        updateFeedbackState({
          updateKeys: [['mini_loader_text']],
          data: { mini_loader_text: '' },
        })
        this.mini_loader_text = ''
        this.setState({
          loaded_static: true,
          fetch_id_static: 0,
          prev_fetch_id: 0,
          latest_fetch_id: this.state.fetch_id_static,
        })
      }
    }

    // replace route
    if (updatePath) {
      const { redirectSelect } = this.props
      redirectSelect(pathFetchId, page, locationHash, true)
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    clearInterval(this.intervalStatic)
    clearInterval(this.imgUrlRefresher)
  }

  tick(loaded, feedback_fetched, isStatic = false, interval = 1000) {
    let increment = interval / 1000
    if (this.state[loaded] == false && this.props[feedback_fetched] == false) {
      if (isStatic == false) {
        this.setState(prevState => ({ elapsed: prevState.elapsed + increment }))
      } else {
        this.setState(prevState => ({
          elapsed_static: prevState.elapsed_static + increment,
        }))
      }
    }
  }

  updateImageUrl() {
    if (!_.isEmpty(this.mini_loader_text)) {
      return
    }

    const {
      refreshImageUrl,
      uploaded_picture,
      imageData,
      feedback,
    } = this.props
    if (
      !_.isEmpty(feedback['section_wise_feedback']['profile_picture_feedback'])
    ) {
      if (
        uploaded_picture != '' &&
        uploaded_picture.hasOwnProperty('string') &&
        uploaded_picture['string']['profile_picture_string'] != '' &&
        uploaded_picture.hasOwnProperty('url')
      ) {
        refreshImageUrl(uploaded_picture['string']['profile_picture_string'])
      } else if (imageData.string != '' && !_.isNull(imageData.url)) {
        refreshImageUrl(image_string)
      }
    }
  }

  renderLoading() {
    return <Loading className="fullscreen" />
  }

  fetchResume(newFetchId) {
    // Do not fetch new resume/pdf/edited data when one is processing already. New input processes in aspire-api nevertheless, but do not fetch.
    if (!_.isEmpty(this.mini_loader_text)) {
      notification(
        'Cannot process new data until current processing is complete.',
        'error',
        timeOutMilliseconds
      )
      this.sendTrackingDataDebounce(
        'process',
        'aspire',
        'notify_error',
        'cannot_process_until_current_complete'
      )
      return
    }

    const {
      fetchFeedback,
      match: { params },
      updateFeedbackState,
    } = this.props
    const { fetchId } = params
    updateFeedbackState({
      updateKeys: [['mini_loader_text'], ['processed_modules_count']],
      data: { mini_loader_text: 'resume', processed_modules_count: null },
    })
    this.mini_loader_text = 'resume'
    this.setState({
      elapsed_static: 0,
      loaded_static: false,
      fetch_id_static: newFetchId,
      prev_fetch_id: fetchId,
    })
    this.prev_elapsed_static = -1
    this.fetched_at_time = [0]
    fetchFeedback(newFetchId)

    if (typeof this.intervalStatic !== 'function') {
      this.intervalStatic = setInterval(
        () => this.tick('loaded_static', 'feedback_fetched', true, 1000),
        1000
      )
    }
  }

  fetchPdf(newFetchId) {
    // Do not fetch new resume/pdf/edited data when one is processing already. New input processes in aspire-api nevertheless, but do not fetch.
    if (!_.isEmpty(this.mini_loader_text)) {
      notification(
        'Cannot process new data until current processing is complete.',
        'error',
        timeOutMilliseconds
      )
      this.sendTrackingDataDebounce(
        'process',
        'aspire',
        'notify_error',
        'cannot_process_until_current_complete'
      )
      return
    }

    const {
      fetchFeedback,
      match: { params },
      updateFeedbackState,
    } = this.props
    const { fetchId } = params
    updateFeedbackState({
      updateKeys: [['mini_loader_text'], ['processed_modules_count']],
      data: { mini_loader_text: 'pdf', processed_modules_count: null },
    })
    this.mini_loader_text = 'pdf'
    this.setState({
      elapsed_static: 0,
      loaded_static: false,
      fetch_id_static: newFetchId,
      prev_fetch_id: fetchId,
    })
    this.prev_elapsed_static = -1
    this.fetched_at_time = [0]
    fetchFeedback(newFetchId)

    if (typeof this.intervalStatic !== 'function') {
      this.intervalStatic = setInterval(
        () => this.tick('loaded_static', 'feedback_fetched', true, 1000),
        1000
      )
    }
  }

  fetchChangedFunction(newFetchId) {
    // Do not fetch new resume/pdf/function/edited data when one is processing already. New input processes in aspire-api nevertheless, but do not fetch.
    if (!_.isEmpty(this.mini_loader_text)) {
      notification(
        'Cannot process new data until current processing is complete.',
        'error',
        timeOutMilliseconds
      )
      this.sendTrackingDataDebounce(
        'process',
        'aspire',
        'notify_error',
        'cannot_process_until_current_complete'
      )
      return
    }

    const {
      fetchFeedback,
      match: { params },
      updateFeedbackState,
    } = this.props
    const { fetchId } = params
    updateFeedbackState({
      updateKeys: [['mini_loader_text'], ['processed_modules_count']],
      data: {
        mini_loader_text: 'changed_function',
        processed_modules_count: null,
      },
    })
    this.mini_loader_text = 'changed_function'
    this.setState({
      elapsed_static: 0,
      loaded_static: false,
      fetch_id_static: newFetchId,
      prev_fetch_id: fetchId,
    })
    this.prev_elapsed_static = -1
    this.fetched_at_time = [0]
    fetchFeedback(newFetchId)

    if (typeof this.intervalStatic !== 'function') {
      this.intervalStatic = setInterval(
        () => this.tick('loaded_static', 'feedback_fetched', true, 1000),
        1000
      )
    }
  }

  fetchEditedData(newFetchId) {
    // Do not fetch new resume/pdf/edited data when one is processing already. New input processes in aspire-api nevertheless, but do not fetch.
    if (!_.isEmpty(this.mini_loader_text)) {
      notification(
        'Cannot process new data until current processing is complete.',
        'error',
        timeOutMilliseconds
      )
      this.sendTrackingDataDebounce(
        'process',
        'aspire',
        'notify_error',
        'cannot_process_until_current_complete'
      )
      return
    }

    const {
      fetchFeedback,
      match: { params },
      updateFeedbackState,
    } = this.props
    const { fetchId } = params
    updateFeedbackState({
      updateKeys: [['mini_loader_text'], ['processed_modules_count']],
      data: { mini_loader_text: 'edited_data', processed_modules_count: null },
    })
    this.mini_loader_text = 'edited_data'
    this.setState({
      elapsed_static: 0,
      loaded_static: false,
      fetch_id_static: newFetchId,
      prev_fetch_id: fetchId,
    })
    this.prev_elapsed_static = -1
    this.fetched_at_time = [0]
    fetchFeedback(newFetchId)

    if (typeof this.intervalStatic !== 'function') {
      this.intervalStatic = setInterval(
        () => this.tick('loaded_static', 'feedback_fetched', true, 1000),
        1000
      )
    }
  }

  render() {
    const {
      status,
      feedback,
      resumeFiles,
      children,
      match: { params },
      tourStatus,
      latestFetchId,
      latestFetchIdFetched,
      functionMappingFetched,
      functions,
      userCustomizations = {},
    } = this.props
    if (_.isEmpty(userCustomizations)) {
      return this.renderLoading()
    }

    if (
      _.isUndefined(userCustomizations.is_aspire_enabled) ||
      userCustomizations.is_aspire_enabled !== 1
    ) {
      window.location = config.rootUrl
      return this.renderLoading()
    }
    const { fetchId, page } = params

    if (_.isEmpty(feedback) && status == 'failed') {
      return null
    }

    if (
      _.isNull(functions) ||
      !latestFetchIdFetched ||
      !functionMappingFetched ||
      _.isNull(tourStatus) ||
      (_.isEmpty(feedback) &&
        this.state.fetch_id_static == 0 &&
        this.props.logIdEdit == 0)
    ) {
      return this.renderLoading()
    }

    let targetJobFunctions = [].concat(
      feedback['student_dashboard']['targetJobFunctions']
    )
    // default case set to false
    if (feedback['student_dashboard']['user_benchmark_changed']) {
      let url = `${window.location.origin}${process.env.APP_NAVBAR_URL}`
      window.location.assign(url)
      return null
    }

    return (
      <AspireFeedbackComponent
        changeState={() => this.setState()}
        fetchId={fetchId}
        page={page}
        targetJobFunctions={targetJobFunctions}
        resumeFiles={resumeFiles}
        fetchResume={this.fetchResume}
        fetchPdf={this.fetchPdf}
        fetchChangedFunction={this.fetchChangedFunction}
        fetchEditedData={this.fetchEditedData}
        tourStatus={tourStatus}>
        {children}
      </AspireFeedbackComponent>
    )
  }
}

AspireFeedback.propTypes = {
  children: PropTypes.node,
}

function mapStateToProps(state, ownProps) {
  return {
    feedback_fetched: state.aspireFeedbackData.fetched,
    status: state.aspireFeedbackData.status,
    feedback: state.aspireFeedbackData.data, // aspire feedback data
    resumeFiles: state.aspireFeedbackData.resume_files,
    logIdEdit: state.editData.log_id,
    uploaded_picture: state.aspireFeedbackData.uploaded_picture,
    imageData: state.imageData,
    tourStatus: state.tour.tourStatus,
    samples: state.aspireFeedbackData.samples,
    allCapsResume: state.aspireFeedbackData.allCapsResume,
    allSmallResume: state.aspireFeedbackData.allSmallResume,
    normalResume: state.aspireFeedbackData.normalResume,
    userCustomizations: state.userCustomizations.data,
    functions: state.aspireFunctionMappings.function_mappings,
    functionMappingFetched: state.aspireFunctionMappings.fetched,
    latestFetchIdFetched: state.aspireLatestFetchId.fetched,
    latestFetchId: state.aspireLatestFetchId.fetch_id,
  }
}

export default connect(mapStateToProps, {
  fetchFeedback,
  redirectSelect,
  updateFeedbackState,
  updateResumeState,
  updatePdfState,
  updateFunctionState,
  updateEditedDataState,
  refreshImageUrl,
  resumeOrCv,
})(AspireFeedback)
