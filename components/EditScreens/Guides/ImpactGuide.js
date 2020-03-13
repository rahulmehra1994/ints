import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateEditDynamicDataState } from '../../../actions/AspireEditDynamicData'
import SubModule from '../HelperComponents/SubModule'
import _ from 'underscore'
import { impactContent } from '../../Constants/DetailedFeedbackText'
import { checkIfEmpty } from '../../../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { sectionUnderscore } from '../../Constants/UniversalMapping'
import { editModalAriaLabel } from '../../Constants/AriaLabelText'

class ImpactGuide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      specifics: false,
      action_oriented: false,
      callApi: false,
      showDynamic: false,
    }
    this.handleGuidanceToggle = this.handleGuidanceToggle.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.getSubModules = this.getSubModules.bind(this)
    this.guidanceExamples = {
      Summary: {
        specifics: {
          correct_way:
            '▪ Developed product roadmap and introduced new product features in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
          incorrect_way:
            '▪ Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth',
        },
        action_oriented: {
          correct_way:
            '▪ Developed product roadmap and introduced new product features in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
          incorrect_way:
            '▪ Responsible for developing product roadmap and introducing new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
        },
      },
      Experience: {
        specifics: {
          correct_way:
            '▪ Developed product roadmap and introduced new product features in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
          incorrect_way:
            '▪ Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth',
        },
        action_oriented: {
          correct_way:
            '▪ Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
          incorrect_way:
            '▪ Responsible for developing product roadmap and introducing new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
        },
      },
    }
    this.emptyDescription = false
    this.sendTrackingDataDebouncePresent = _.debounce(
      sendTrackingData,
      1000,
      true
    )
  }

  UNSAFE_componentWillMount() {
    const {
      fetchEditDynamicData,
      currentSection,
      currentIndex,
      fetchId,
      newSubSection,
      getDynamicEditFeedbackForModule,
      fetchingImpact,
      fetchedImpact,
      errorImpact,
      dataImpact,
      loaderInput,
      sectionWiseTextIntermediateImpact,
      sectionWiseTextEditable,
      sectionWiseTextStatic,
      updateEditDynamicDataState,
    } = this.props

    let callApi = false
    let showDynamic = false
    let emptySection = false

    if (
      checkIfEmpty(
        sectionWiseTextEditable[currentIndex],
        sectionUnderscore[currentSection]
      )
    ) {
      // if empty section then show static data
      callApi = false
      showDynamic = false
      emptySection = true
    } else if (_.isString(currentIndex) && currentIndex.substr(-4) === '_new') {
      // if new section
      // some data is present in new section feedback for which is yet to be decided
      if (sectionWiseTextIntermediateImpact == null) {
        // first call to dynamic data
        callApi = true
        showDynamic = true
      } else if (
        JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
        JSON.stringify(sectionWiseTextIntermediateImpact[currentIndex])
      ) {
        // dynamic called earlier for same value
        callApi = false
        showDynamic = true
      } else {
        // call dynamic
        callApi = true
        showDynamic = true
      }
    } else {
      // edit section
      if (
        JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
        JSON.stringify(sectionWiseTextStatic[currentIndex])
      ) {
        // it is as it is .. show static content
        callApi = false
        showDynamic = false
      } else {
        if (sectionWiseTextIntermediateImpact == null) {
          // first call to dynamic data
          callApi = true
          showDynamic = true
        } else if (
          JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
          JSON.stringify(sectionWiseTextIntermediateImpact[currentIndex])
        ) {
          // dynamic called earlier for same value
          callApi = false
          showDynamic = true
        } else {
          // call dynamic
          callApi = true
          showDynamic = true
        }
      }
    }

    this.emptyDescription = this.checkEmptyDescription(
      sectionWiseTextEditable,
      currentIndex
    )

    if (this.emptyDescription) {
      callApi = false
      showDynamic = false
    }

    this.setState({ callApi: callApi })
    this.setState({ showDynamic: showDynamic })

    if (currentSection == 'Summary' || currentSection == 'Experience') {
      if (
        !(fetchingImpact && !fetchedImpact) &&
        callApi &&
        _.isEmpty(loaderInput)
      ) {
        getDynamicEditFeedbackForModule('impact')
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      updateEditSection,
      sectionWiseTextEditable,
      sectionWiseTextStatic,
      currentIndex,
      currentSection,
    } = nextProps
    if (updateEditSection == true) {
      this.setState({ showDynamic: false })
      this.emptyDescription = this.checkEmptyDescription(
        sectionWiseTextEditable,
        currentIndex
      )
    } else if (
      JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
      JSON.stringify(sectionWiseTextStatic[currentIndex])
    ) {
      this.setState({ showDynamic: false })
      this.emptyDescription = this.checkEmptyDescription(
        sectionWiseTextEditable,
        currentIndex
      )
    } else if (_.isString(currentIndex) && currentIndex.substr(-4) === '_new') {
      this.setState({ showDynamic: false })
      this.emptyDescription = this.checkEmptyDescription(
        sectionWiseTextEditable,
        currentIndex
      )
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  checkEmptyDescription(sectionWiseTextEditable, currentIndex) {
    return (
      sectionWiseTextEditable.hasOwnProperty(currentIndex) &&
      sectionWiseTextEditable[currentIndex].hasOwnProperty('text') &&
      _.isEmpty(sectionWiseTextEditable[currentIndex]['text'])
    )
  }

  getSubModules() {
    const {
      dataImpact,
      checkbox,
      data,
      currentSection,
      currentIndex,
      sectionWiseTextEditable,
      sectionsEntitiesToHighlight,
    } = this.props
    let specificsSubModule = null
    let actionOrientedSubModule = null

    if (!this.state.showDynamic) {
      if (this.emptyDescription) {
        let score = { impact: { specifics: 'green', action_oriented: 'green' } }
        let checkboxDisabled = true
        let checkboxState = false
        specificsSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataImpact}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="impact"
            subModule="specifics"
            heading="Specifics"
            color={score['impact']['specifics']}
            staticText={''}
            feedbackText={
              impactContent.content_section_score[currentSection][
                score['impact']['specifics']
              ]['specifics'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['specifics']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['specifics']['correct_way']
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['specifics'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['specifics']['correct_way']
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['specifics']['incorrect_way']
            }
          />
        )
        actionOrientedSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataImpact}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="impact"
            subModule="action_oriented"
            heading="Action Oriented"
            color={score['impact']['action_oriented']}
            staticText={''}
            feedbackText={
              impactContent.content_section_score[currentSection][
                score['impact']['action_oriented']
              ]['action_oriented'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['action_oriented']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['action_oriented'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['action_oriented'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['action_oriented'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['action_oriented'][
                'incorrect_way'
              ]
            }
          />
        )
      } else {
        let score = { impact: { specifics: 'green', action_oriented: 'green' } }

        for (let submodule in score['impact']) {
          if (
            data.hasOwnProperty('impact') &&
            !_.isUndefined(data['impact']) &&
            data['impact'].hasOwnProperty(submodule + '_color') &&
            data['impact'][submodule + '_color'].hasOwnProperty(currentIndex) &&
            data['impact'][submodule + '_color'][currentIndex].hasOwnProperty(
              'color'
            )
          ) {
            score['impact'][submodule] =
              data['impact'][submodule + '_color'][currentIndex]['color']
          }
        }

        let checkboxDisabled = false
        if (
          !(
            data.hasOwnProperty('impact') &&
            !_.isUndefined(data['impact']) &&
            data['impact'].hasOwnProperty('specifics') &&
            data['impact']['specifics'].hasOwnProperty(currentIndex) &&
            data['impact']['specifics'][currentIndex].hasOwnProperty('ids') &&
            !_.isEmpty(data['impact']['specifics'][currentIndex]['ids'])
          )
        ) {
          checkboxDisabled = true
        }
        let checkboxState = checkbox['specifics']
        specificsSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataImpact}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="impact"
            subModule="specifics"
            heading="Specifics"
            color={score['impact']['specifics']}
            staticText={''}
            feedbackText={
              impactContent.content_section_score[currentSection][
                score['impact']['specifics']
              ]['specifics'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['specifics']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['specifics']['correct_way']
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['specifics'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['specifics']['correct_way']
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['specifics']['incorrect_way']
            }
          />
        )

        checkboxDisabled = false
        if (
          !(
            data.hasOwnProperty('impact') &&
            !_.isUndefined(data['impact']) &&
            data['impact'].hasOwnProperty('action_oriented') &&
            data['impact']['action_oriented'].hasOwnProperty(currentIndex) &&
            data['impact']['action_oriented'][currentIndex].hasOwnProperty(
              'ids'
            ) &&
            !_.isEmpty(data['impact']['action_oriented'][currentIndex]['ids'])
          )
        ) {
          checkboxDisabled = true
        }
        checkboxState = checkbox['action_oriented']
        actionOrientedSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataImpact}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="impact"
            subModule="action_oriented"
            heading="Action Oriented"
            color={score['impact']['action_oriented']}
            staticText={''}
            feedbackText={
              impactContent.content_section_score[currentSection][
                score['impact']['action_oriented']
              ]['action_oriented'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['action_oriented']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['action_oriented'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['action_oriented'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['action_oriented'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['action_oriented'][
                'incorrect_way'
              ]
            }
          />
        )
      }
    } else {
      if (this.emptyDescription) {
        let score = { impact: { specifics: 'green', action_oriented: 'green' } }
        let checkboxDisabled = true
        let checkboxState = false
        specificsSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataImpact}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="impact"
            subModule="specifics"
            heading="Specifics"
            color={score['impact']['specifics']}
            staticText={''}
            feedbackText={
              impactContent.content_section_score[currentSection][
                score['impact']['specifics']
              ]['specifics'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['specifics']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['specifics']['correct_way']
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['specifics'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['specifics']['correct_way']
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['specifics']['incorrect_way']
            }
          />
        )
        actionOrientedSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataImpact}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="impact"
            subModule="action_oriented"
            heading="Action Oriented"
            color={score['impact']['action_oriented']}
            staticText={''}
            feedbackText={
              impactContent.content_section_score[currentSection][
                score['impact']['action_oriented']
              ]['action_oriented'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['action_oriented']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['action_oriented'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['action_oriented'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['action_oriented'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['action_oriented'][
                'incorrect_way'
              ]
            }
          />
        )
      } else {
        if (dataImpact.hasOwnProperty('specifics')) {
          let checkboxDisabled = false
          if (_.size(dataImpact['specifics']['highlightValues']) == 0) {
            checkboxDisabled = true
          }
          let checkboxState = checkbox['specifics']
          specificsSubModule = (
            <SubModule
              dynamicEntitiesToHighlight={dataImpact}
              currentIndex={currentIndex}
              sectionsEntitiesToHighlight={
                sectionsEntitiesToHighlight[currentSection]
              }
              module="impact"
              subModule="specifics"
              heading="Specifics"
              color={dataImpact['specifics']['color']}
              staticText={dataImpact['specifics']['static_text']}
              feedbackText={dataImpact['specifics']['feedback_text']}
              checkboxDisabled={checkboxDisabled}
              checkboxState={checkboxState}
              handleClick={this.handleClick}
              type="dynamic"
              handleGuidanceToggle={this.handleGuidanceToggle}
              isGuidanceOpen={this.state['specifics']}
              guidanceCorrectWayText={
                this.guidanceExamples[currentSection]['specifics'][
                  'correct_way'
                ]
              }
              guidanceIncorrectWayText={
                this.guidanceExamples[currentSection]['specifics'][
                  'incorrect_way'
                ]
              }
              guidanceCorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['specifics']['correct_way']
              }
              guidanceIncorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['specifics']['incorrect_way']
              }
            />
          )
        }

        if (dataImpact.hasOwnProperty('action_oriented')) {
          let checkboxDisabled = false
          if (_.size(dataImpact['action_oriented']['highlightValues']) == 0) {
            checkboxDisabled = true
          }
          let checkboxState = checkbox['action_oriented']
          actionOrientedSubModule = (
            <SubModule
              dynamicEntitiesToHighlight={dataImpact}
              currentIndex={currentIndex}
              sectionsEntitiesToHighlight={
                sectionsEntitiesToHighlight[currentSection]
              }
              module="impact"
              subModule="action_oriented"
              heading="Action Oriented"
              color={dataImpact['action_oriented']['color']}
              staticText={dataImpact['action_oriented']['static_text']}
              feedbackText={dataImpact['action_oriented']['feedback_text']}
              checkboxDisabled={checkboxDisabled}
              checkboxState={checkboxState}
              handleClick={this.handleClick}
              type="dynamic"
              handleGuidanceToggle={this.handleGuidanceToggle}
              isGuidanceOpen={this.state['action_oriented']}
              guidanceCorrectWayText={
                this.guidanceExamples[currentSection]['action_oriented'][
                  'correct_way'
                ]
              }
              guidanceIncorrectWayText={
                this.guidanceExamples[currentSection]['action_oriented'][
                  'incorrect_way'
                ]
              }
              guidanceCorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['action_oriented'][
                  'correct_way'
                ]
              }
              guidanceIncorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['action_oriented'][
                  'incorrect_way'
                ]
              }
            />
          )
        }
      }
    }

    return (
      <div className="as-guide-submodules-wrapper">
        {actionOrientedSubModule}
        {specificsSubModule}
      </div>
    )
  }

  handleGuidanceToggle(segment, type) {
    const { currentSection, currentIndex } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'guidance_toggle',
      currentSection: currentSection,
      currentIndex: currentIndex,
      module: 'impact',
      submodule: segment,
      type: type,
    }

    this.sendTrackingDataDebouncePresent(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )
    this.setState({ [segment]: !this.state[segment] })
  }

  handleClick(mod, submodule, type) {
    const {
      updateCheckboxState,
      checkbox,
      highlightEntityText,
      unhighlightAll,
      currentSection,
      currentIndex,
    } = this.props

    let jsonObjectForTracking = {
      eventLabel: 'impact_guide_switch_click',
      currentSection: currentSection,
      currentIndex: currentIndex,
      module: mod,
      submodule: submodule,
      type: type,
    }

    this.sendTrackingDataDebouncePresent(
      'event',
      'aspire_edit_screen',
      'click',
      JSON.stringify(jsonObjectForTracking)
    )

    let tempCheckbox = $.extend(true, {}, checkbox)
    if (checkbox[submodule] == true) {
      tempCheckbox[submodule] = false
      unhighlightAll()
    } else {
      for (let i in tempCheckbox) {
        if (i == submodule) {
          tempCheckbox[i] = true
          unhighlightAll()
          highlightEntityText(mod, i, type)
        } else {
          tempCheckbox[i] = false
        }
      }
    }
    updateCheckboxState(tempCheckbox)
  }

  renderLoading() {
    return (
      <div className="as-samples-loader-wrapper">
        <div className="mikepad-loading">
          <div className="binding" />
          <div className="pad">
            <div className="line line1" />
            <div className="line line2" />
            <div className="line line3" />
            <div className="line line4" />
            <div className="line line5" />
          </div>
          <div className="text">Loading impact feedback</div>
        </div>
      </div>
    )
  }

  renderLoadingError() {
    return (
      <div className="as-samples-loader-wrapper">
        <div className="mikepad-loading">
          <div className="as-api-error-img">
            <img
              src={`${process.env.APP_BASE_URL}dist/images/edit-screens/alert-icon.svg`}
              width="70px"
            />
          </div>
          <div className="text">
            Some error occurred. Please try again later!
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      currentSection,
      fetchingImpact,
      fetchedImpact,
      errorImpact,
      dataImpact,
    } = this.props
    let data = null

    if (!this.state.showDynamic) {
      data = (
        <div>
          <div className="as-guide-heading">Impact Guide</div>
          <div className="as-sample-wrapper">{this.getSubModules()}</div>
        </div>
      )
    } else if (fetchedImpact && !fetchingImpact && !errorImpact) {
      data = (
        <div>
          <div className="as-guide-heading">Impact Guide</div>
          <div className="as-sample-wrapper">{this.getSubModules()}</div>
        </div>
      )
    } else if (fetchedImpact && !fetchingImpact && errorImpact) {
      data = this.renderLoadingError()
    } else {
      data = this.renderLoading()
    }

    return <div className="as-guide-container">{data}</div>
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.constructor.name,"componentDidUpdate called")
  }

  componentDidMount() {
    // console.log(this.constructor.name,"componentDidMount called")
  }

  componentWillUnmount() {
    const { updateCheckboxState, unhighlightAll } = this.props
    unhighlightAll()
    let checkbox = {
      tense: false,
      narrative_voice: false,
      buzzwords: false,
      verb_overusage: false,
      action_oriented: false,
      specifics: false,
    }
    updateCheckboxState(checkbox)
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fetchingImpact: state.aspireEditDynamicData.fetchingImpact,
    fetchedImpact: state.aspireEditDynamicData.fetchedImpact,
    errorImpact: state.aspireEditDynamicData.errorImpact,
    dataImpact: state.aspireEditDynamicData.dataImpact,
    sectionWiseTextIntermediateImpact:
      state.aspireEditDynamicData.sectionWiseTextIntermediateImpact,
    loaderInput: state.aspireFeedbackData.mini_loader_text,
  }
}

export default connect(
  mapStateToProps,
  { updateEditDynamicDataState }
)(ImpactGuide)
