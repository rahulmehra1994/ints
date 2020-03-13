import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateEditDynamicDataState } from '../../../actions/AspireEditDynamicData'
import SubModule from '../HelperComponents/SubModule'
import _ from 'underscore'
import { languageContent } from '../../Constants/DetailedFeedbackText'
import { checkIfEmpty } from '../../../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { sectionUnderscore } from '../../Constants/UniversalMapping'
import { editModalAriaLabel } from '../../Constants/AriaLabelText'

class LanguageGuide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tense: false,
      narrative_voice: false,
      callApi: false,
      showDynamic: false,
    }
    this.handleGuidanceToggle = this.handleGuidanceToggle.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.getSubModules = this.getSubModules.bind(this)
    this.guidanceExamples = {
      Summary: {
        tense: {
          correct_way:
            'As Product Manager at Google, I was responsible for developing product roadmap and introducing new product feature in collaboration with international cross-functional team. I was selected from amongst 200 employees to form 10 person strategic review team responsible for software product development, driving new product sales as well as managing relations with existing product users',
          incorrect_way:
            'As Product Manager at Google, I <span class="text-red">was</span> responsible for developing product roadmap and introducing new product feature in collaboration with international cross-functional team. I <span class="text-red">am</span> selected from amongst 200 employees to form 10 person strategic review team responsible for software product development, driving new product sales as well as managing relations with existing product users',
        },
        narrative_voice: {
          correct_way:
            'I am a Management Consultant with 8 years of experience serving telecommunications and technology clients. I am presently working at KPMG and have proven expertise in financial and data analysis.',
          incorrect_way:
            'Management Consultant with 8 years experience serving telecommunications and technology clients. I am working at KPMG and have gained expertise in financial analysis and data analysis.',
        },
      },
      Experience: {
        tense: {
          correct_way:
            '▪ Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15% <br/>▪ Selected from amongst 200 employees to form 10 person strategic review team responsible for software product development; spearheaded new product sales and managed relations with existing product users',
          incorrect_way:
            '▪ <span class="text-red">Develop</span> product roadmap and introducing new product feature in collaboration with international cross-functional team; generate ideas to redesign product promotion strategies, leading to revenue growth of 15%<br/>▪ <span class="text-red">Selected</span> from amongst 200 employees to form 10 person strategic review team responsible for software product development, driving new product sales as well as managing relations with existing product users',
        },
        narrative_voice: {
          correct_way:
            '▪ Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
          incorrect_way:
            '▪ Responsible for developing product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
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
      fetchingLanguage,
      fetchedLanguage,
      errorLanguage,
      dataLanguage,
      loaderInput,
      sectionWiseTextIntermediateLanguage,
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
      if (sectionWiseTextIntermediateLanguage == null) {
        // first call to dynamic data
        callApi = true
        showDynamic = true
      } else if (
        JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
        JSON.stringify(sectionWiseTextIntermediateLanguage[currentIndex])
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
        if (sectionWiseTextIntermediateLanguage == null) {
          // first call to dynamic data
          callApi = true
          showDynamic = true
        } else if (
          JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
          JSON.stringify(sectionWiseTextIntermediateLanguage[currentIndex])
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
        !(fetchingLanguage && !fetchedLanguage) &&
        callApi &&
        _.isEmpty(loaderInput)
      ) {
        getDynamicEditFeedbackForModule('language')
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
      dataLanguage,
      checkbox,
      data,
      currentSection,
      currentIndex,
      sectionWiseTextEditable,
      sectionsEntitiesToHighlight,
    } = this.props
    let tenseSubModule = null
    let narrativeVoiceSubModule = null

    if (!this.state.showDynamic) {
      if (this.emptyDescription) {
        let score = { language: { narrative_voice: 'green', tense: 'green' } }
        let checkboxDisabled = true
        let checkboxState = false
        tenseSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataLanguage}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="tense"
            heading="Tense Consistency"
            color={score['language']['tense']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['tense']
              ]['tense'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['tense']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['tense']['correct_way']
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['tense']['incorrect_way']
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['tense']['correct_way']
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['tense']['incorrect_way']
            }
          />
        )
        narrativeVoiceSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataLanguage}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="narrative_voice"
            heading="Voice Consistency"
            color={score['language']['narrative_voice']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['narrative_voice']
              ]['narrative_voice'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['narrative_voice']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['narrative_voice'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['narrative_voice'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['narrative_voice'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['narrative_voice'][
                'incorrect_way'
              ]
            }
          />
        )
      } else {
        let score = { language: { narrative_voice: 'green', tense: 'green' } }
        for (let submodule in score['language']) {
          if (
            data.hasOwnProperty('language') &&
            !_.isUndefined(data['language']) &&
            data['language'].hasOwnProperty(submodule) &&
            data['language'][submodule].hasOwnProperty(currentIndex) &&
            data['language'][submodule][currentIndex].hasOwnProperty('color')
          ) {
            score['language'][submodule] =
              data['language'][submodule][currentIndex]['color']
          }
        }
        let checkboxDisabled = false
        if (
          !(
            data.hasOwnProperty('language') &&
            !_.isUndefined(data['language']) &&
            data['language'].hasOwnProperty('tense') &&
            data['language']['tense'].hasOwnProperty(currentIndex) &&
            data['language']['tense'][currentIndex].hasOwnProperty('ids') &&
            !_.isEmpty(data['language']['tense'][currentIndex]['ids'])
          )
        ) {
          checkboxDisabled = true
        }
        let checkboxState = checkbox['tense']
        tenseSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataLanguage}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="tense"
            heading="Tense Consistency"
            color={score['language']['tense']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['tense']
              ]['tense'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['tense']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['tense']['correct_way']
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['tense']['incorrect_way']
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['tense']['correct_way']
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['tense']['incorrect_way']
            }
          />
        )

        checkboxDisabled = false
        if (
          !(
            data.hasOwnProperty('language') &&
            !_.isUndefined(data['language']) &&
            data['language'].hasOwnProperty('narrative_voice') &&
            data['language']['narrative_voice'].hasOwnProperty(currentIndex) &&
            data['language']['narrative_voice'][currentIndex].hasOwnProperty(
              'ids'
            ) &&
            !_.isEmpty(data['language']['narrative_voice'][currentIndex]['ids'])
          )
        ) {
          checkboxDisabled = true
        }
        checkboxState = checkbox['narrative_voice']
        narrativeVoiceSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataLanguage}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="narrative_voice"
            heading="Voice Consistency"
            color={score['language']['narrative_voice']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['narrative_voice']
              ]['narrative_voice'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['narrative_voice']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['narrative_voice'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['narrative_voice'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['narrative_voice'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['narrative_voice'][
                'incorrect_way'
              ]
            }
          />
        )
      }
    } else {
      if (this.emptyDescription) {
        let score = { language: { narrative_voice: 'green', tense: 'green' } }
        let checkboxDisabled = true
        let checkboxState = false
        tenseSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataLanguage}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="tense"
            heading="Tense Consistency"
            color={score['language']['tense']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['tense']
              ]['tense'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['tense']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['tense']['correct_way']
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['tense']['incorrect_way']
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['tense']['correct_way']
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['tense']['incorrect_way']
            }
          />
        )
        narrativeVoiceSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataLanguage}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="narrative_voice"
            heading="Voice Consistency"
            color={score['language']['narrative_voice']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['narrative_voice']
              ]['narrative_voice'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['narrative_voice']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['narrative_voice'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['narrative_voice'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['narrative_voice'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['narrative_voice'][
                'incorrect_way'
              ]
            }
          />
        )
      } else {
        if (dataLanguage.hasOwnProperty('tense')) {
          let checkboxDisabled = false
          if (_.size(dataLanguage['tense']['highlightValues']) == 0) {
            checkboxDisabled = true
          }
          let checkboxState = checkbox['tense']
          tenseSubModule = (
            <SubModule
              dynamicEntitiesToHighlight={dataLanguage}
              currentIndex={currentIndex}
              sectionsEntitiesToHighlight={
                sectionsEntitiesToHighlight[currentSection]
              }
              module="language"
              subModule="tense"
              heading="Tense Consistency"
              color={dataLanguage['tense']['color']}
              staticText={dataLanguage['tense']['static_text']}
              feedbackText={dataLanguage['tense']['feedback_text']}
              checkboxDisabled={checkboxDisabled}
              checkboxState={checkboxState}
              handleClick={this.handleClick}
              type="dynamic"
              handleGuidanceToggle={this.handleGuidanceToggle}
              isGuidanceOpen={this.state['tense']}
              guidanceCorrectWayText={
                this.guidanceExamples[currentSection]['tense']['correct_way']
              }
              guidanceIncorrectWayText={
                this.guidanceExamples[currentSection]['tense']['incorrect_way']
              }
              guidanceCorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['tense']['correct_way']
              }
              guidanceIncorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['tense']['incorrect_way']
              }
            />
          )
        }

        if (dataLanguage.hasOwnProperty('narrative_voice')) {
          let checkboxDisabled = false
          if (_.size(dataLanguage['narrative_voice']['highlightValues']) == 0) {
            checkboxDisabled = true
          }
          let checkboxState = checkbox['narrative_voice']
          narrativeVoiceSubModule = (
            <SubModule
              dynamicEntitiesToHighlight={dataLanguage}
              currentIndex={currentIndex}
              sectionsEntitiesToHighlight={
                sectionsEntitiesToHighlight[currentSection]
              }
              module="language"
              subModule="narrative_voice"
              heading="Voice Consistency"
              color={dataLanguage['narrative_voice']['color']}
              staticText={dataLanguage['narrative_voice']['static_text']}
              feedbackText={dataLanguage['narrative_voice']['feedback_text']}
              checkboxDisabled={checkboxDisabled}
              checkboxState={checkboxState}
              handleClick={this.handleClick}
              type="dynamic"
              handleGuidanceToggle={this.handleGuidanceToggle}
              isGuidanceOpen={this.state['narrative_voice']}
              guidanceCorrectWayText={
                this.guidanceExamples[currentSection]['narrative_voice'][
                  'correct_way'
                ]
              }
              guidanceIncorrectWayText={
                this.guidanceExamples[currentSection]['narrative_voice'][
                  'incorrect_way'
                ]
              }
              guidanceCorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['narrative_voice'][
                  'correct_way'
                ]
              }
              guidanceIncorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['narrative_voice'][
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
        {tenseSubModule}
        {narrativeVoiceSubModule}
      </div>
    )
  }

  handleGuidanceToggle(segment, type) {
    const { currentSection, currentIndex } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'guidance_toggle',
      currentSection: currentSection,
      currentIndex: currentIndex,
      module: 'language',
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
      eventLabel: 'language_guide_switch_click',
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
          <div className="text">
            <span
              tabIndex={0}
              aria-label={editModalAriaLabel['loading_sample']}>
              Loading language feedback
            </span>
          </div>
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
            <span
              tabIndex={0}
              aria-label={editModalAriaLabel['loading_sample_error']}>
              Some error occurred. Please try again later!
            </span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      currentSection,
      fetchingLanguage,
      fetchedLanguage,
      errorLanguage,
      dataLanguage,
    } = this.props
    let data = null

    if (!this.state.showDynamic) {
      data = (
        <div>
          <div className="as-guide-heading">Language Guide</div>
          <div className="as-sample-wrapper">{this.getSubModules()}</div>
        </div>
      )
    } else if (fetchedLanguage && !fetchingLanguage && !errorLanguage) {
      data = (
        <div>
          <div className="as-guide-heading">Language Guide</div>
          <div className="as-sample-wrapper">{this.getSubModules()}</div>
        </div>
      )
    } else if (fetchedLanguage && !fetchingLanguage && errorLanguage) {
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
    fetchingLanguage: state.aspireEditDynamicData.fetchingLanguage,
    fetchedLanguage: state.aspireEditDynamicData.fetchedLanguage,
    errorLanguage: state.aspireEditDynamicData.errorLanguage,
    dataLanguage: state.aspireEditDynamicData.dataLanguage,
    sectionWiseTextIntermediateLanguage:
      state.aspireEditDynamicData.sectionWiseTextIntermediateLanguage,
    loaderInput: state.aspireFeedbackData.mini_loader_text,
  }
}

export default connect(
  mapStateToProps,
  { updateEditDynamicDataState }
)(LanguageGuide)
