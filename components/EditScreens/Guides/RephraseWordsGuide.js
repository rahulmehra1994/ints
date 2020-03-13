import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchEditDynamicData,
  updateEditDynamicDataState,
} from '../../../actions/AspireEditDynamicData'
import SubModule from '../HelperComponents/SubModule'
import _ from 'underscore'
import { languageContent } from '../../Constants/DetailedFeedbackText'
import { checkIfEmpty } from '../../../services/helpers'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import { sectionUnderscore } from '../../Constants/UniversalMapping'
import { editModalAriaLabel } from '../../Constants/AriaLabelText'

class RephraseWordsGuide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      verb_overusage: false,
      buzzwords: false,
      callApi: false,
      showDynamic: false,
    }
    this.handleGuidanceToggle = this.handleGuidanceToggle.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.getSubModules = this.getSubModules.bind(this)
    this.guidanceExamples = {
      Summary: {
        verb_overusage: {
          correct_way:
            'I developed product roadmap in collaboration with international cross-functional team, generating ideas to redesign product promotion strategies. I also established and trained 10 person strategic review team responsible for product development.',
          incorrect_way:
            'I <span class="text-red">developed</span> product roadmap in collaboration with international cross-functional team, generating ideas to redesign product promotion strategies. I also <span class="text-red">developed</span> and trained 10 person strategic review team responsible for product development.',
        },
        buzzwords: {
          correct_way:
            'I am a committed and competent professional with expertise in Financial Analysis and Valuation',
          incorrect_way:
            'I am a <span class="text-red">dedicated</span> individual and am an expert in Financial Analysis and Valuation',
        },
      },
      Experience: {
        verb_overusage: {
          correct_way:
            '▪ Developed product roadmap and introduced new product feature in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15% <br/>▪ Selected from amongst 200 employees to form 10 person strategic review team responsible for software product development; drove new product sales and managed relations with existing product users',
          incorrect_way:
            '▪ <span class="text-red">Analysed</span> past marketing data and prepared digital marketing strategies; implemented strategies to drive 25% increase in new customers<br/>▪ Compared and <span class="text-red">analysed</span> results from campaign and took corrective actions; provided sales data and marketing training material to new analysts, improving efficiency by 28%',
        },
        buzzwords: {
          correct_way:
            '▪ Developed product roadmap in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies, leading to revenue growth of 15%',
          incorrect_way:
            '▪ Developed <span class="text-red">the</span> product roadmap in collaboration with international cross-functional team; generated ideas to redesign product promotion strategies <span class="text-red">that</span> led to revenue growth of 15%',
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
      fetchingRephraseWords,
      fetchedRephraseWords,
      errorRephraseWords,
      dataRephraseWords,
      loaderInput,
      sectionWiseTextIntermediateRephraseWords,
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
      if (sectionWiseTextIntermediateRephraseWords == null) {
        // first call to dynamic data
        callApi = true
        showDynamic = true
      } else if (
        JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
        JSON.stringify(sectionWiseTextIntermediateRephraseWords[currentIndex])
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
        if (sectionWiseTextIntermediateRephraseWords == null) {
          // first call to dynamic data
          callApi = true
          showDynamic = true
        } else if (
          JSON.stringify(sectionWiseTextEditable[currentIndex]) ==
          JSON.stringify(sectionWiseTextIntermediateRephraseWords[currentIndex])
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
        !(fetchingRephraseWords && !fetchedRephraseWords) &&
        callApi &&
        _.isEmpty(loaderInput)
      ) {
        getDynamicEditFeedbackForModule('rephrase_words')
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
      dataRephraseWords,
      checkbox,
      data,
      currentSection,
      currentIndex,
      sectionsEntitiesToHighlight,
      sectionWiseTextEditable,
    } = this.props

    let verbOverusageSubModule = null
    let buzzwordsSubModule = null
    if (!this.state.showDynamic) {
      if (this.emptyDescription) {
        let score = {
          language: { buzzwords: 'green', verb_overusage: 'green' },
        }
        let checkboxDisabled = true
        let checkboxState = false
        verbOverusageSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataRephraseWords}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="verb_overusage"
            heading="Overusage"
            color={score['language']['verb_overusage']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['verb_overusage']
              ]['verb_overusage'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            overusageWordsList={[]}
            suggestionsList={[]}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['verb_overusage']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['verb_overusage'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['verb_overusage'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['verb_overusage'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['verb_overusage'][
                'incorrect_way'
              ]
            }
          />
        )
        buzzwordsSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataRephraseWords}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="buzzwords"
            heading="Avoided Words"
            color={score['language']['buzzwords']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['buzzwords']
              ]['buzzwords'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            buzzwordsList={[]}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['buzzwords']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['buzzwords']['correct_way']
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['buzzwords'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['buzzwords']['correct_way']
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['buzzwords']['incorrect_way']
            }
          />
        )
      } else {
        let score = {
          language: { buzzwords: 'green', verb_overusage: 'green' },
        }
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

        let texts = {}
        let overusageWordsList = []
        let suggestionsList = []
        let checkboxDisabled = false
        if (
          !(
            data.hasOwnProperty('language') &&
            !_.isUndefined(data['language']) &&
            data['language'].hasOwnProperty('verb_overusage') &&
            data['language']['verb_overusage'].hasOwnProperty(currentIndex) &&
            data['language']['verb_overusage'][currentIndex].hasOwnProperty(
              'ids'
            ) &&
            !_.isEmpty(data['language']['verb_overusage'][currentIndex]['ids'])
          )
        ) {
          checkboxDisabled = true
        } else {
          texts =
            sectionsEntitiesToHighlight[currentSection]['language'][
              'verb_overusage'
            ][currentIndex].text
          let overusageWordsListTemp = _.map(texts, function(highlight) {
            return highlight.text
          })

          overusageWordsListTemp = _.filter(overusageWordsListTemp, function(
            obj
          ) {
            if (_.isUndefined(obj) || obj == '') {
              return false
            }
            return true
          })

          overusageWordsList = _.uniq(overusageWordsListTemp)

          let suggestionsListTemp = []

          if (
            data['language']['verb_overusage'][currentIndex].hasOwnProperty(
              'ids'
            ) &&
            !_.isEmpty(data['language']['verb_overusage'][currentIndex]['ids'])
          ) {
            let idsArray =
              data['language']['verb_overusage'][currentIndex]['ids']

            for (let index in idsArray) {
              let wordsObjectsArray = idsArray[index]
              for (let anotherIndex in wordsObjectsArray) {
                let word = wordsObjectsArray[anotherIndex]['word']
                if (_.indexOf(overusageWordsList, word) != -1) {
                  let suggestions =
                    wordsObjectsArray[anotherIndex]['suggestions']
                  for (let suggestionsIndex in suggestions) {
                    suggestionsListTemp.push(suggestions[suggestionsIndex])
                  }
                }
              }
            }

            suggestionsListTemp = _.filter(suggestionsListTemp, function(obj) {
              if (_.isUndefined(obj) || obj == '') {
                return false
              }
              return true
            })
          }

          suggestionsList = _.uniq(suggestionsListTemp)
        }

        let checkboxState = checkbox['verb_overusage']
        verbOverusageSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataRephraseWords}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="verb_overusage"
            heading="Overusage"
            color={score['language']['verb_overusage']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['verb_overusage']
              ]['verb_overusage'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            overusageWordsList={overusageWordsList}
            suggestionsList={suggestionsList}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['verb_overusage']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['verb_overusage'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['verb_overusage'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['verb_overusage'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['verb_overusage'][
                'incorrect_way'
              ]
            }
          />
        )

        let buzzwordsList = []
        checkboxDisabled = false
        if (
          !(
            data.hasOwnProperty('language') &&
            !_.isUndefined(data['language']) &&
            data['language'].hasOwnProperty('buzzwords') &&
            data['language']['buzzwords'].hasOwnProperty(currentIndex) &&
            data['language']['buzzwords'][currentIndex].hasOwnProperty('ids') &&
            !_.isEmpty(data['language']['buzzwords'][currentIndex]['ids'])
          )
        ) {
          checkboxDisabled = true
        } else {
          texts =
            sectionsEntitiesToHighlight[currentSection]['language'][
              'buzzwords'
            ][currentIndex].text
          let buzzwordsListTemp = _.map(texts, function(highlight) {
            return highlight.text
          })

          buzzwordsListTemp = _.filter(buzzwordsListTemp, function(obj) {
            if (_.isUndefined(obj) || obj == '') {
              return false
            }
            return true
          })

          buzzwordsList = _.uniq(buzzwordsListTemp)
        }
        checkboxState = checkbox['buzzwords']
        buzzwordsSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataRephraseWords}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="buzzwords"
            heading="Avoided Words"
            color={score['language']['buzzwords']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['buzzwords']
              ]['buzzwords'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            buzzwordsList={buzzwordsList}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['buzzwords']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['buzzwords']['correct_way']
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['buzzwords'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['buzzwords']['correct_way']
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['buzzwords']['incorrect_way']
            }
          />
        )
      }
    } else {
      if (this.emptyDescription) {
        let score = {
          language: { buzzwords: 'green', verb_overusage: 'green' },
        }
        let checkboxDisabled = true
        let checkboxState = false
        verbOverusageSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataRephraseWords}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="verb_overusage"
            heading="Overusage"
            color={score['language']['verb_overusage']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['verb_overusage']
              ]['verb_overusage'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            overusageWordsList={[]}
            suggestionsList={[]}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['verb_overusage']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['verb_overusage'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['verb_overusage'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['verb_overusage'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['verb_overusage'][
                'incorrect_way'
              ]
            }
          />
        )
        buzzwordsSubModule = (
          <SubModule
            dynamicEntitiesToHighlight={dataRephraseWords}
            currentIndex={currentIndex}
            sectionsEntitiesToHighlight={
              sectionsEntitiesToHighlight[currentSection]
            }
            module="language"
            subModule="buzzwords"
            heading="Avoided Words"
            color={score['language']['buzzwords']}
            staticText={''}
            feedbackText={
              languageContent.content_section_score[currentSection][
                score['language']['buzzwords']
              ]['buzzwords'].text
            }
            checkboxDisabled={checkboxDisabled}
            checkboxState={checkboxState}
            buzzwordsList={[]}
            handleClick={this.handleClick}
            type="static"
            handleGuidanceToggle={this.handleGuidanceToggle}
            isGuidanceOpen={this.state['buzzwords']}
            guidanceCorrectWayText={
              this.guidanceExamples[currentSection]['buzzwords']['correct_way']
            }
            guidanceIncorrectWayText={
              this.guidanceExamples[currentSection]['buzzwords'][
                'incorrect_way'
              ]
            }
            guidanceCorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['verb_overusage'][
                'correct_way'
              ]
            }
            guidanceIncorrectWayAriaLabel={
              editModalAriaLabel[currentSection]['verb_overusage'][
                'incorrect_way'
              ]
            }
          />
        )
      } else {
        if (dataRephraseWords.hasOwnProperty('verb_overusage')) {
          let overusageWordsList = []
          let suggestionsList = []
          let checkboxDisabled = false
          if (
            _.size(dataRephraseWords['verb_overusage']['highlightValues']) == 0
          ) {
            checkboxDisabled = true
          } else {
            let overusageWordsListTemp = _.keys(
              dataRephraseWords['verb_overusage']['suggestions_mapping']
            )
            overusageWordsListTemp = _.filter(overusageWordsListTemp, function(
              obj
            ) {
              if (_.isUndefined(obj) || obj == '') {
                return false
              }
              return true
            })

            overusageWordsList = _.uniq(overusageWordsListTemp)

            let suggestionsListTemp = _.values(
              dataRephraseWords['verb_overusage']['suggestions_mapping']
            )

            suggestionsListTemp = _.filter(suggestionsListTemp, function(obj) {
              if (_.isUndefined(obj) || obj == '') {
                return false
              }
              return true
            })

            suggestionsList = _.uniq(suggestionsListTemp)
          }
          let checkboxState = checkbox['verb_overusage']
          verbOverusageSubModule = (
            <SubModule
              dynamicEntitiesToHighlight={dataRephraseWords}
              currentIndex={currentIndex}
              sectionsEntitiesToHighlight={
                sectionsEntitiesToHighlight[currentSection]
              }
              module="rephrase_words"
              subModule="verb_overusage"
              heading="Overusage"
              color={dataRephraseWords['verb_overusage']['color']}
              staticText={dataRephraseWords['verb_overusage']['static_text']}
              feedbackText={
                dataRephraseWords['verb_overusage']['feedback_text']
              }
              checkboxDisabled={checkboxDisabled}
              checkboxState={checkboxState}
              overusageWordsList={overusageWordsList}
              suggestionsList={suggestionsList}
              handleClick={this.handleClick}
              type="dynamic"
              handleGuidanceToggle={this.handleGuidanceToggle}
              isGuidanceOpen={this.state['verb_overusage']}
              guidanceCorrectWayText={
                this.guidanceExamples[currentSection]['verb_overusage'][
                  'correct_way'
                ]
              }
              guidanceIncorrectWayText={
                this.guidanceExamples[currentSection]['verb_overusage'][
                  'incorrect_way'
                ]
              }
              guidanceCorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['verb_overusage'][
                  'correct_way'
                ]
              }
              guidanceIncorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['verb_overusage'][
                  'incorrect_way'
                ]
              }
            />
          )
        }

        if (dataRephraseWords.hasOwnProperty('buzzwords')) {
          let buzzwordsList = []
          let checkboxDisabled = false
          if (_.size(dataRephraseWords['buzzwords']['highlightValues']) == 0) {
            checkboxDisabled = true
          } else {
            // get buzzwords list out of highlight values
            let buzzwordsListTemp = _.map(
              dataRephraseWords['buzzwords']['highlightValues'],
              function(buzzwordsObj) {
                return buzzwordsObj.text
              }
            )

            buzzwordsListTemp = _.filter(buzzwordsListTemp, function(obj) {
              if (_.isUndefined(obj) || obj == '') {
                return false
              }
              return true
            })

            buzzwordsList = _.uniq(buzzwordsListTemp)
          }

          let checkboxState = checkbox['buzzwords']
          buzzwordsSubModule = (
            <SubModule
              dynamicEntitiesToHighlight={dataRephraseWords}
              currentIndex={currentIndex}
              sectionsEntitiesToHighlight={
                sectionsEntitiesToHighlight[currentSection]
              }
              module="rephrase_words"
              subModule="buzzwords"
              heading="Avoided Words"
              color={dataRephraseWords['buzzwords']['color']}
              staticText={dataRephraseWords['buzzwords']['static_text']}
              feedbackText={dataRephraseWords['buzzwords']['feedback_text']}
              checkboxDisabled={checkboxDisabled}
              checkboxState={checkboxState}
              buzzwordsList={buzzwordsList}
              handleClick={this.handleClick}
              type="dynamic"
              handleGuidanceToggle={this.handleGuidanceToggle}
              isGuidanceOpen={this.state['buzzwords']}
              guidanceCorrectWayText={
                this.guidanceExamples[currentSection]['buzzwords'][
                  'correct_way'
                ]
              }
              guidanceIncorrectWayText={
                this.guidanceExamples[currentSection]['buzzwords'][
                  'incorrect_way'
                ]
              }
              guidanceCorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['buzzwords']['correct_way']
              }
              guidanceIncorrectWayAriaLabel={
                editModalAriaLabel[currentSection]['buzzwords']['incorrect_way']
              }
            />
          )
        }
      }
    }

    return (
      <div className="as-guide-submodules-wrapper">
        {verbOverusageSubModule}
        {buzzwordsSubModule}
      </div>
    )
  }

  handleGuidanceToggle(segment, type) {
    const { currentSection, currentIndex } = this.props
    let jsonObjectForTracking = {
      eventLabel: 'guidance_toggle',
      currentSection: currentSection,
      currentIndex: currentIndex,
      module: 'rephrase_words',
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
      eventLabel: 'rephrase_words_guide_switch_click',
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
              aria-label={editModalAriaLabel['loading_samples']}>
              Loading word usage feedback
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
              aria-label={editModalAriaLabel['loading_samples_error']}>
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
      fetchingRephraseWords,
      fetchedRephraseWords,
      errorRephraseWords,
      dataRephraseWords,
    } = this.props
    let data = null

    if (!this.state.showDynamic) {
      data = (
        <div>
          <div className="as-guide-heading">Word Usage Guide</div>
          <div className="as-sample-wrapper">{this.getSubModules()}</div>
        </div>
      )
    } else if (
      fetchedRephraseWords &&
      !fetchingRephraseWords &&
      !errorRephraseWords
    ) {
      data = (
        <div>
          <div className="as-guide-heading">Word Usage Guide</div>
          <div className="as-sample-wrapper">{this.getSubModules()}</div>
        </div>
      )
    } else if (
      fetchedRephraseWords &&
      !fetchingRephraseWords &&
      errorRephraseWords
    ) {
      data = this.renderLoadingError()
    } else {
      data = this.renderLoading()
    }

    return <div className="as-guide-container">{data}</div>
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
    fetchingRephraseWords: state.aspireEditDynamicData.fetchingRephraseWords,
    fetchedRephraseWords: state.aspireEditDynamicData.fetchedRephraseWords,
    errorRephraseWords: state.aspireEditDynamicData.errorRephraseWords,
    dataRephraseWords: state.aspireEditDynamicData.dataRephraseWords,
    sectionWiseTextIntermediateRephraseWords:
      state.aspireEditDynamicData.sectionWiseTextIntermediateRephraseWords,
    loaderInput: state.aspireFeedbackData.mini_loader_text,
  }
}

export default connect(
  mapStateToProps,
  { updateEditDynamicDataState }
)(RephraseWordsGuide)
