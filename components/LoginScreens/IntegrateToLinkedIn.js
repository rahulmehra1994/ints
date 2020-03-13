import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import { sectionUnderscoreFeedbackMapping } from '../Constants/UniversalMapping'
import { dataIntegrationAriaLabel } from '../Constants/AriaLabelText'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'

class IntegrateToLinkedIn extends Component {
  constructor(props) {
    super(props)
    this.trackClickDebounce = _.debounce(this.trackClick, 3000, true)
    this.trackGoToDebounce = _.debounce(this.trackClick, 5000, true)
  }

  trackClick(tag) {
    sendTrackingData('event', 'aspire_integration_modal', 'click', tag)
  }

  copyToClipboard(element) {
    var text = $(element).get(0) // Grab the node of the element
    var selection = window.getSelection() // Get the Selection object
    var range = document.createRange() // Create a new range
    range.selectNodeContents(text) // Select the content of the node from line 1
    selection.removeAllRanges() // Delete any old ranges
    selection.addRange(range) // Add the range to selection
    document.execCommand('copy') // Execute the command
    this.trackClickDebounce(`${element}-copy_btn`)
  }

  getTextFromFeedback() {
    const { feedbackData, sectionToSuggestCopy } = this.props
    var output = []
    _.map(sectionToSuggestCopy, (value, key) => {
      if (value['section_name'] == 'Profile Picture') {
        output.push({
          title: 'Profile Picture',
          content:
            feedbackData['profile_picture_feedback']['profile_picture_url'],
          scoreChange: value['score_improve'],
          id: key,
        })
      } else if (value['section_name'] == 'LinkedIn URL') {
        output.push({
          title: value['section_name'],
          content:
            feedbackData['personal_information_feedback']['url_score_class'][
              'url'
            ],
          scoreChange: value['score_improve'],
          id: key,
        })
      } else if (value['section_name'] == 'Profile Name') {
        output.push({
          title: value['section_name'],
          content:
            feedbackData['personal_information_feedback'][
              'profile_name_score_class'
            ]['name'],
          scoreChange: value['score_improve'],
          id: key,
        })
      } else {
        let sectionKey = sectionUnderscoreFeedbackMapping[value['section_name']]
        if (
          _.isUndefined(feedbackData[sectionKey]) ||
          _.isUndefined(feedbackData[sectionKey]['text_array']) ||
          _.isEmpty(feedbackData[sectionKey]['text_array'])
        ) {
        } else {
          if (sectionKey == 'headline_feedback') {
            output.push({
              title: 'Headline',
              content: this.getTextForHeadline(
                feedbackData[sectionKey]['text_array']
              ),
              scoreChange: value['score_improve'],
              id: key,
            })
          } else if (sectionKey == 'summary_feedback') {
            output.push({
              title: 'Summary',
              content: this.getTextForContent(
                feedbackData[sectionKey]['text_array']
              ),
              scoreChange: value['score_improve'],
              id: key,
            })
          } else {
            output.push({
              title: this.getEdExTitle(
                feedbackData[sectionKey]['categories_present'][
                  value['sub_section_id']
                ],
                value['section_name']
              ),
              content: this.getTextForContent(
                feedbackData[sectionKey]['text_array'][value['sub_section_id']]
              ),
              scoreChange: value['score_improve'],
              id: key,
            })
          }
        }
      }
    })

    var result = output.filter(function(value) {
      return !_.isEmpty(value['content'])
    })

    return result
  }

  getTextForHeadline(textArray) {
    for (let divId in textArray) {
      if (textArray[divId].hasOwnProperty('text')) {
        return textArray[divId]['text']
      }
    }
  }

  getTextForContent(textArray) {
    let content = []
    let currentLineId = null
    for (let divId in textArray) {
      if (
        textArray[divId]['is_title'] ||
        textArray[divId]['is_sub_title'] ||
        textArray[divId]['is_time_duration']
      ) {
        continue
      }
      if (_.isNull(currentLineId)) {
        currentLineId = textArray[divId]['new_line_id']
      }
      if (currentLineId == textArray[divId]['new_line_id']) {
        content.push(textArray[divId]['text'])
      } else {
        currentLineId = textArray[divId]['new_line_id']
        content.push(<br />)
        if (textArray[divId]['has_real_bullet_symbol']) {
          var bulletSymbol = String.fromCharCode(
            textArray[divId]['bullet_ascii_value']
          )
          content.push(`${bulletSymbol} ${textArray[divId]['text']}`)
        } else {
          content.push(`${textArray[divId]['text']}`)
        }
      }
    }
    if (content.indexOf('Activities and Societies:') != -1) {
      content[content.indexOf('Activities and Societies: ')] = ''
    }

    return content
  }

  getEdExTitle(categories, sectionName) {
    let sectionTitle = sectionName
    let toCheckFor = 'company_name'
    if (sectionName === 'Education') {
      toCheckFor = 'schools'
    }
    for (let divId in categories) {
      if (categories[divId].hasOwnProperty(toCheckFor)) {
        let place = categories[divId][toCheckFor][0]['keyword']
        sectionTitle += ` at ${place}`
        break
      }
    }

    return sectionTitle
  }

  render() {
    const {
      hideModal,
      downloadImage,
      sectionToSuggestCopy,
      linkedInUrl,
      imageData,
    } = this.props

    let sectionTiles = []
    let textArray = this.getTextFromFeedback()
    if (_.isEmpty(sectionToSuggestCopy) || _.isEmpty(textArray)) {
      sectionTiles.push(<EmptyComponent />)
    } else {
      _.map(textArray, (value, key) => {
        if (value['title'] == 'Profile Picture') {
          let imageUrl = value['content']
          if (imageData.refresh_url) {
            imageUrl = imageData.url
          }
          sectionTiles.push(
            <ProfilePictureTile
              imageUrl={imageUrl}
              scoreChange={value['scoreChange']}
              id={value['id']}
              downloadImage={downloadImage}
            />
          )
        } else {
          sectionTiles.push(
            <SectionTile
              sectionTitle={value['title']}
              sectionContent={value['content']}
              scoreChange={value['scoreChange']}
              copyFunction={this.copyToClipboard.bind(this)}
              id={value['id']}
            />
          )
        }
        if (
          value['title'].indexOf('Experience') +
            value['title'].indexOf('Education') !=
          -2
        ) {
          sectionTiles.push(
            <div
              className="copy-note"
              tabIndex={0}
              aria-label={dataIntegrationAriaLabel['copy_note']}>
              Note - Only description will be copied
            </div>
          )
        }
      })
    }
    return (
      <div className="linkedin-integration-modal-container">
        <div className="ITL-modal-header">
          <button
            className="btn ITL-close-btn"
            onClick={hideModal}
            aria-label={dataIntegrationAriaLabel['close']}>
            <span className="icon-cross" />
          </button>
          <div className="main-heading">
            <span className="main-heading-text">
              Integrate changes with LinkedIn
            </span>
          </div>
          <div className="sub-heading">
            {_.isEmpty(sectionToSuggestCopy) ? null : (
              <span className="sub-heading-text">
                Paste below sections on your&nbsp;
                <a
                  className="link-to-linkedin"
                  href={linkedInUrl}
                  onClick={() => {
                    this.trackGoToDebounce('go_to_linkedin')
                  }}
                  target="_blank"
                  aria-label={dataIntegrationAriaLabel['go_to_linkedin']}>
                  LinkedIn&nbsp;
                  <img
                    src={`${
                      process.env.APP_BASE_URL
                    }dist/images/open-in-new-tab.svg`}
                    alt="open linkedin icon"
                  />
                </a>
              </span>
            )}
          </div>
        </div>
        <div className="clearfix" />
        <div className="ITL-modal-content">{sectionTiles}</div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    imageData: state.imageData,
  }
}

export default connect(
  mapStateToProps,
  {}
)(IntegrateToLinkedIn)

function SectionTile({
  sectionTitle,
  sectionContent,
  scoreChange,
  copyFunction,
  id,
}) {
  return (
    <div className="row">
      <SectionTitleImprovement
        scoreChange={scoreChange}
        sectionTitle={sectionTitle}
      />
      <div className="col col-sm-2">
        <button
          className="btn copy-btn"
          onClick={() => {
            copyFunction(`#${id}`)
          }}
          aria-label={dataIntegrationAriaLabel['copy']}>
          <span className="ITL-copy-icon">
            <img
              src={`${process.env.APP_BASE_URL}dist/images/copy-icon.svg`}
              alt="copy icon"
            />
          </span>{' '}
          Copy
        </button>
      </div>
      <div className="col-sm-12 ITL-section-content">
        <div className="ITL-section-content-text" id={id}>
          {sectionContent}
        </div>
      </div>
    </div>
  )
}

function ProfilePictureTile({ scoreChange, id, imageUrl, downloadImage }) {
  return (
    <div className="row">
      <SectionTitleImprovement
        scoreChange={scoreChange}
        sectionTitle={'Profile Picture'}
      />
      <div className="col col-sm-2">
        <button
          className="btn download-btn"
          onClick={() => {
            downloadImage(imageUrl)
          }}
          aria-label={dataIntegrationAriaLabel['download']}>
          <span className="ITL-download-icon">
            <img
              src={`${process.env.APP_BASE_URL}dist/images/download-icon.svg`}
              alt="download icon"
            />
          </span>{' '}
          Download
        </button>
      </div>
      <div className="col-sm-12 ITL-section-content picture">
        <div className="ITL-section-content-picture">
          <img src={imageUrl} alt="profile picture" />
        </div>
        <div className="ITL-section-content-picture-text">
          This picture is fit to be directly uploaded on your linkedIn profile
        </div>
      </div>
    </div>
  )
}

function SectionTitleImprovement({ sectionTitle, scoreChange }) {
  return (
    <div
      className="col col-sm-10"
      tabIndex={0}
      aria-label={`${sectionTitle} ${
        scoreChange == 0 ? 'Score Unchanged' : 'Score Improved'
      }`}>
      <span className="ITL-section-heading">{sectionTitle}</span>
      {scoreChange == 0 ? (
        <span className="score-status-text">Score Unchanged</span>
      ) : (
        <span>
          <span className="up-arrow-icon">
            {' '}
            <img
              src={`${process.env.APP_BASE_URL}dist/images/up-arrow.svg`}
              alt="improvement arrow"
            />
          </span>
          <span className="score-status-text green">Score Improved</span>
        </span>
      )}
    </div>
  )
}

function EmptyComponent({}) {
  return (
    <div className="empty-image-icon-row">
      <img
        src={`${process.env.APP_BASE_URL}dist/images/no-edits-made.svg`}
        alt="no edit made"
      />
      <div className="empty-sub-text">
        <span tabIndex={0} aria-label={dataIntegrationAriaLabel['no_changes']}>
          You haven’t made any changes yet
        </span>
      </div>
      <div className="empty-main-text">
        <span
          tabIndex={0}
          aria-label={dataIntegrationAriaLabel['start_editing']}>
          Start editing to see improvements
        </span>
      </div>
    </div>
  )
}
