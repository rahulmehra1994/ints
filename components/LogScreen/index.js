import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Modal from 'react-bootstrap/lib/Modal'
import ModalHeader from './ModalHeader'
import { processEditedData } from '../../actions/Edit'
import Loader from '../Loader'
import _ from 'underscore'
import moment from 'moment'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { Modal, ModalBody } from '@vmockinc/dashboard/Common/commonComps/Modal'
import FocusLock, { MoveFocusInside } from 'react-focus-lock'
import { logModalAriaLabel } from '../Constants/AriaLabelText'

const month = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
}

class LogScreen extends Component {
  constructor(props) {
    super(props)
    this.sendTrackingDataDebounce = _.debounce(sendTrackingData, 2000, true)
  }
  getDate(date) {
    date = moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
    var stillUtc = moment.utc(date).toDate()
    var local = moment(stillUtc)
      .local()
      .format('YYYY-MM-DD HH:mm:ss')
    let d = local.split(/[-:\s]/)
    return (
      month[d[1]] +
      ' ' +
      d[2] +
      ', ' +
      d[0] +
      ' ' +
      d[3] +
      ':' +
      d[4] +
      ':' +
      d[5]
    )
  }

  splitParagraphs(text, sectionName) {
    let temp = []
    let splits = text.split('\n')

    for (let k in splits) {
      temp.push(<div key={k + '-' + sectionName}>{splits[k]}</div>)
    }

    return temp
  }

  handleClick(e) {
    const {
      fetchId,
      sectionName,
      currentIndex,
      countSections,
      logs,
      prevData,
      feedback,
      processEditedData,
      processingStatus,
    } = this.props

    if (processingStatus == 'processing' || _.isNull(processingStatus)) return

    let i = $(e.target)
      .closest('[data-id]')
      .data('id')
    let score = feedback['section_score'][currentIndex]['score']

    let jsonObjectForTracking = {
      eventLabel: 'revert_button',
      fetchId: fetchId,
      sectionName: sectionName,
      currentIndex: currentIndex,
    }

    this.sendTrackingDataDebounce(
      'event',
      'aspire_log_modal',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    processEditedData(
      fetchId,
      sectionName,
      currentIndex,
      countSections,
      false,
      logs[i]['data'],
      logs[i]['sub_section_uid'],
      prevData,
      score,
      false,
      false
    )
  }

  fetchImageUrl(url) {
    if (_.isEmpty(url)) {
      // replace by condition to check if invalid
      return false
    }

    return url
  }

  render() {
    const {
      show,
      sectionName,
      currentIndex,
      logs,
      showLogModal,
      hideLogModal,
      processingStatus,
    } = this.props
    let logArray = []

    for (let i in logs) {
      if (i != 0) {
        logArray.push(<div className="borer-1px" />)
        logArray.push(<div className="clearfix" />)
      }

      let scoreChange = []

      if (logs[i]['score_change'] == 1) {
        scoreChange.push(
          <span className="pull-left">
            <span className="glyphicon glyphicon-triangle-top text-green">
              {' '}
            </span>{' '}
            score improved from this version
          </span>
        )
      } else if (logs[i]['score_change'] == -1) {
        scoreChange.push(
          <span className="pull-left">
            <span className="glyphicon glyphicon-triangle-bottom text-red">
              {' '}
            </span>{' '}
            score decreased from this version
          </span>
        )
      } else if (logs[i]['score_change'] == 0) {
        scoreChange.push(
          <span className="pull-left">No improvement from this version</span>
        )
      } else if (logs[i]['score_change'] == 2) {
        scoreChange.push(<span className="pull-left" />)
      }

      logArray.push(
        <div className="log-single-entry">
          <div
            tabIndex={0}
            aria-label={`Saved on ${this.getDate(logs[i]['date'])} ${
              logModalAriaLabel[logs[i]['score_change']]
            }`}>
            <strong> Saved on {this.getDate(logs[i]['date'])}</strong>
          </div>
          <div>
            {scoreChange}
            <span className="undo-text pull-right">
              <a
                aria-label={logModalAriaLabel['revert']}
                href="javascript:void(0);"
                onClick={e => this.handleClick(e)}
                className={
                  processingStatus == 'processing' || _.isNull(processingStatus)
                    ? 'light-gray-txt'
                    : 'text-blue'
                }
                data-id={i}>
                <strong> ↺ revert to this version </strong>
              </a>
            </span>
          </div>
        </div>
      )

      logArray.push(<div className="clearfix" />)

      let data = []

      if (sectionName == 'Personal Information') {
        data.push(<div>{logs[i]['render_text']['name']}</div>)
        data.push(<br />)
        data.push(<div>{logs[i]['render_text']['profile_url']}</div>)
      } else if (sectionName == 'Profile Picture') {
        let url = this.fetchImageUrl(logs[i]['render_text']['picture_url'])

        if (url != false) {
          data.push(
            <div className="edit-img-section">
              <div className="edit-img">
                {' '}
                <img alt="" src={url} className="log-edit-img" />{' '}
              </div>
            </div>
          )
        }
      } else if (sectionName == 'Headline' || sectionName == 'Summary') {
        data = (
          <div>{this.splitParagraphs(logs[i]['render_text'], sectionName)}</div>
        )
      } else if (
        sectionName == 'Experience' ||
        sectionName == 'Education' ||
        sectionName == 'Volunteer Experience' ||
        sectionName == 'Projects' ||
        sectionName == 'Publications'
      ) {
        if (!_.isEmpty(logs[i]['render_text']['title'])) {
          data.push(
            <div className="p-heading-1">{logs[i]['render_text']['title']}</div>
          )
        }

        if (!_.isEmpty(logs[i]['render_text']['sub_title'])) {
          for (let j in logs[i]['render_text']['sub_title']) {
            data.push(
              <div className="p-heading-2">
                {logs[i]['render_text']['sub_title'][j]}
              </div>
            )
          }
        }

        if (!_.isEmpty(logs[i]['render_text']['text'])) {
          let temp = this.splitParagraphs(
            logs[i]['render_text']['text'],
            sectionName
          )
          data.push(<div>{temp}</div>)
        }
      }
      if (!_.isEmpty(data)) {
        logArray.push(<div className="width100 f-edit input-log">{data}</div>)
      }
    }

    return (
      <div
        role="dialog"
        aria-label="Log of edits made in this session"
        aria-modal={true}>
        <FocusLock disabled={!show} returnFocus={true}>
          <Modal
            isOpen={show}
            onRequestHide={hideLogModal}
            className="as-edit-modal-scrollable logs-modal">
            <ModalBody>
              <div className="as-edit-wrapper as-shadow">
                <Loader sectionName={sectionName} />
                <ModalHeader
                  hideLogModal={hideLogModal}
                  sectionName={sectionName}
                />
                <div
                  className="as-edit-container as-edit-container-logs"
                  id="vertical-scroll">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="edit-section log-edit-section-padding">
                        <div className="edit-detail">
                          <div className="clearfix" />
                          <div className="edit-data width100 pull-right">
                            <div className="validation-detail pull-right text-blue">
                              <div className="popover">
                                <div className="arrow" />
                                <div className="popover-content" />
                              </div>
                            </div>
                            <div className="clearfix" />
                            {logArray}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </FocusLock>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    processingStatus: state.aspireFeedbackData.status,
    loaderInput: state.aspireFeedbackData.mini_loader_text,
  }
}

export default connect(
  mapStateToProps,
  { processEditedData }
)(LogScreen)
