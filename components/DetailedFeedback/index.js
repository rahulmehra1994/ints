import React, { Component } from 'react'
import { connect } from 'react-redux'
import Loader from '../Loader'
import LeftNav from '../LeftNav'
import PersonalInformation from '../PersonalInformation'
import ProfilePicture from '../ProfilePicture'
import Sections from '../Sections'
import ProfileData from '../ProfileData'
import _ from 'underscore'
import Tour from '../../tour/Tour'
import { markSectionVisited } from '../../actions/AspireFeedback'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import {
  sectionUnderscoreName,
  sectioNameToBackendVisitedSectioNameMapping,
  staticFeedback,
} from '../Constants/DetailedFeedbackText'

const sectionComponents = {
  'Personal Information': PersonalInformation,
  'Profile Picture': ProfilePicture,
  Headline: Sections,
  Summary: Sections,
  Experience: Sections,
  Education: Sections,
}

class DetailedFeedback extends Component {
  constructor(props) {
    super(props)
    this.timeScreenStart = 0
    this.checkVisitedSection = this.checkVisitedSection.bind(this)
    this.checkVisitedSectionDebounce = _.debounce(
      this.checkVisitedSection,
      1000,
      true
    )
    this.sendTrackingDataDebouncePageLoad = _.debounce(
      sendTrackingData,
      2000,
      true
    )
  }

  componentDidMount() {
    let timeScreenStart = new Date()
    this.timeScreenStart = timeScreenStart.getTime()
    this.sendTrackingDataDebouncePageLoad(
      'page_level',
      'aspire_detailed_feedback_screen',
      'load',
      'page_loaded'
    )
  }

  componentDidUpdate() {
    let currentSectionName = this.props.ui.section
    this.checkVisitedSectionDebounce(currentSectionName)
  }

  componentWillUnmount() {
    let timeScreenEnd = new Date()
    let timeScreenSpent =
      (timeScreenEnd.getTime() - this.timeScreenStart) / 1000
    if (timeScreenSpent > 2) {
      let jsonObjectForTracking = {
        eventLabel: 'screen_time',
        time: timeScreenSpent,
      }
      sendTrackingData(
        'event',
        'aspire_detailed_feedback_screen',
        'time',
        JSON.stringify(jsonObjectForTracking)
      )
    }
  }

  checkVisitedSection(currentSectionName) {
    let visitedSectionModuleName =
      sectioNameToBackendVisitedSectioNameMapping[currentSectionName]
    if (this.props.visited_sections[visitedSectionModuleName] == 0) {
      this.props.markSectionVisited(visitedSectionModuleName)
    }
  }

  render() {
    const {
      location,
      fetchId,
      ui,
      has_api,
      has_pdf,
      has_resume,
      status,
      resumeSkillsInLinkedin,
      resumeSkillsNotInLinkedin,
      feedback,
      onSelectSection,
      onSelectPrev,
      onSelectNext,
      underlineSpellError,
      onUpdateText,
      unhighlightAll,
      activeNavIndex,
      resetSectionNavs,
      updateEditSection,
      editSectionUpdated,
      newSubSection,
      changeNewSubSectionValue,
      logModalMounted,
      editModalMounted,
      changeModalState,
      update_detailed_state,
      tourStatus,
      selectedPanelPersonalInfo,
      setSelectedPanelPersonalInfo,
      allCapsResume,
      allSmallResume,
      normalResume,
      tabIndex,
    } = this.props

    const currentSectionName = ui.section
    const CurrentComponent = sectionComponents[currentSectionName]
    const {
      totalScore,
      totalScoreColor,
      sectionWiseText,
      sectionWiseTextPdf,
    } = ui

    let emptySections = []
    let sectionTextKey = {}

    if (has_pdf == '1') {
      sectionTextKey = {
        name: 'Personal Information',
        imageUrl: 'Profile Picture',
        headline: 'Headline',
        summary: 'Summary',
        experience: 'Experience',
        education: 'Education',
      }
    } else {
      sectionTextKey = {
        name: 'Personal Information',
        imageUrl: 'Profile Picture',
        headline: 'Headline',
        summary: 'Summary',
      }
    }

    for (let i in sectionTextKey) {
      if (sectionWiseText.hasOwnProperty(i) && _.isEmpty(sectionWiseText[i])) {
        emptySections.push(sectionTextKey[i])
      }
    }

    let summaryEmpty =
      _.isEmpty(ui['sectionWiseTextEditable']['summary']) ||
      ui['sectionWiseTextEditable']['summary']['0']['text'] == 'N/A'
    let loader = null

    if (logModalMounted == false && editModalMounted == false) {
      loader = <Loader padding={10} />
    } else {
      loader = null
    }

    return (
      <div id="detailed-feedback">
        <div className="body-container">
          <div className="container-fluid tall">
            <Tour tourelement="detailed" />
            {loader}
            <div className="row tall">
              <div className="col-sm-6 padding-right0 tall">
                <div className="col-sm-4 left-nav-container outer-border tall tour-scroll scroll-hidden vertical-scroll">
                  <LeftNav
                    tabIndex={tabIndex + 1}
                    location={location}
                    emptySections={emptySections}
                    has_api={has_api}
                    has_pdf={has_pdf}
                    has_resume={has_resume}
                    status={status}
                    currentSectionName={currentSectionName}
                    summaryEmpty={summaryEmpty}
                    onSelectSection={onSelectSection}
                    sectionWiseText={sectionWiseText}
                    totalScore={totalScore}
                    totalScoreColor={totalScoreColor}
                  />
                </div>
                <div className="col-sm-8 bg-white outer-border tour-scroll js-detailed-feedback tall scroll-hidden vertical-scroll">
                  <CurrentComponent
                    tabIndex={tabIndex + 1}
                    location={location}
                    ui={ui[currentSectionName]}
                    resumeSkillsInLinkedin={ui['resumeSkillsInLinkedin']}
                    resumeSkillsNotInLinkedin={ui['resumeSkillsNotInLinkedin']}
                    derivedSkills={ui['derivedSkills']}
                    sectionWiseTextEditable={
                      ui['sectionWiseTextEditable'][
                        sectionUnderscoreName[currentSectionName]
                      ]
                    }
                    sectionWiseTextStatic={
                      ui['sectionWiseTextStatic'][
                        sectionUnderscoreName[currentSectionName]
                      ]
                    }
                    sectionWiseText={sectionWiseText}
                    sectionsPerSkill={ui['sectionsPerSkill']}
                    currentIndex={ui[currentSectionName]['currentIndex']}
                    currentSection={currentSectionName}
                    has_api={has_api}
                    has_pdf={has_pdf}
                    feedback={ui['sections'][currentSectionName]}
                    staticFeedback={staticFeedback[currentSectionName]}
                    onUpdateText={onUpdateText}
                    unhighlightAll={unhighlightAll}
                    activeNavIndex={activeNavIndex}
                    resetSectionNavs={resetSectionNavs}
                    update_detailed_state={update_detailed_state}
                    selectedPanelPersonalInfo={selectedPanelPersonalInfo}
                    setSelectedPanelPersonalInfo={setSelectedPanelPersonalInfo}
                    allCapsResume={allCapsResume}
                    allSmallResume={allSmallResume}
                    normalResume={normalResume}
                  />
                </div>
              </div>
              <div className="col-sm-6 tall">
                <ProfileData
                  tabIndex={tabIndex + 10}
                  fetchId={fetchId}
                  totalScore={totalScore}
                  totalScoreColor={totalScoreColor}
                  sectionWiseText={sectionWiseText}
                  sectionWiseTextPdf={sectionWiseTextPdf}
                  currentSection={currentSectionName}
                  resumeSkillsInLinkedin={resumeSkillsInLinkedin}
                  resumeSkillsNotInLinkedin={resumeSkillsNotInLinkedin}
                  onSelectSection={onSelectSection}
                  onSelectPrev={onSelectPrev}
                  onSelectNext={onSelectNext}
                  underlineSpellError={underlineSpellError}
                  ui={ui}
                  updateEditSection={updateEditSection}
                  editSectionUpdated={editSectionUpdated}
                  newSubSection={newSubSection}
                  changeNewSubSectionValue={changeNewSubSectionValue}
                  changeModalState={changeModalState}
                  selectedPanelPersonalInfo={selectedPanelPersonalInfo}
                  setSelectedPanelPersonalInfo={setSelectedPanelPersonalInfo}
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
    visited_sections: state.aspireFeedbackData.visited_sections,
  }
}

export default connect(mapStateToProps, { markSectionVisited })(
  DetailedFeedback
)
