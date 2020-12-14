import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'underscore'
import InsightsWrap from './InsightsWrap'
import ContentLoader from 'react-content-loader'
import { mutuals, common, IDEAL_WPM } from '../../actions/commonActions'
import { mutualLogics } from '../../actions/mutualLogics'

const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)

var Loader = require('react-loaders').Loader

const insightsSection =
  process.env.APP_PRODUCT_BASE_URL + '/dist/images/new/insight-section.svg'

class InsightsAllSection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIndexesMain: {
        [this.props.appUrls.eyeGaze]: common.tabIndexes.insights,
        [this.props.appUrls.smile]: common.tabIndexes.insights + 10,
        [this.props.appUrls.gesture]: common.tabIndexes.insights + 20,
        [this.props.appUrls.body]: common.tabIndexes.insights + 30,
        [this.props.appUrls.appearance]: common.tabIndexes.insights + 40,
        [this.props.appUrls.word]: common.tabIndexes.insights + 50,
        [this.props.appUrls.sentence]: common.tabIndexes.insights + 60,
        [this.props.appUrls.competency]: common.tabIndexes.insights + 70,
        [this.props.appUrls.vocal]: common.tabIndexes.insights + 80,
        [this.props.appUrls.pauses]: common.tabIndexes.insights + 90,
        [this.props.appUrls.disfluencies]: common.tabIndexes.insights + 100,
        [this.props.appUrls.modulation]: common.tabIndexes.insights + 110,
        [this.props.appUrls.videosummary]: common.tabIndexes.insights + 120,
      },
    }
  }

  trackOnScroll() {
    trackingDebounceSmall({
      event_type: 'scroll ',
      event_description: 'insights section scrolled',
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.tabIndexDeactivate()
    }
  }

  tabIndexActivate() {
    this.setState({
      tabIndex: this.state.tabIndexesMain[this.props.location.pathname],
    })
    try {
      document.querySelector('.insights-section .onEnterFocusAda').focus()
    } catch (e) {
      console.error(e)
    }
  }

  tabIndexDeactivate() {
    this.setState({
      tabIndex: -1,
    })
  }

  render() {
    let { tabIndexesMain } = this.state
    let compLoader = this.props.common.compLoader
    let { appUrls, additionalSection, essentialSection } = this.props

    let stringChart = { hideYAxisPoints: true }

    return this.props.interviewRows !== -1 ? (
      this.props.interviewRows.length > 2 ? (
        <div
          className="cardStyle bg-white p-6 insightsWrap"
          style={{ paddingBottom: 40 }}
          onScroll={() => {
            this.trackOnScroll()
          }}
          onKeyPress={e => {
            if (e.key === 'Enter' && this.state.tabIndex === -1) {
              this.tabIndexActivate()
            }
          }}
          tabIndex={tabIndexesMain[this.props.location.pathname]}
          role="complementary"
          aria-label={
            'Insights section. This section provides access to your historical performances. Select to continue further.'
          }>
          {this.props.location.pathname !== appUrls.videosummary ? (
            <div className="mb-10">
              <div className="subHead">
                <img src={insightsSection} alt="Insights" />
                <span className="ml-4">Insights</span>
              </div>
              <hr />
            </div>
          ) : null}

          <Route
            exact
            path={appUrls.eyeGaze}
            render={() => {
              return (
                <InsightsWrap
                  rows={this.props.interviewRows}
                  tabIndex={this.state.tabIndex}
                  customData={[
                    {
                      label: 'Eye Contact',
                      keys: {
                        shouldShowNull: 'concatenate_status',
                        yAxisKey: 'eye_contact_results.center',
                        yAxisColor: 'eye_contact_results.eye_gaze_result',
                      },
                      maxYPoint: 100,
                    },
                  ]}
                  modifyDataLabels={val => {
                    let newVal = JSON.parse(JSON.stringify(val))
                    if (newVal > 0 && newVal < 1) newVal = 1
                    else newVal = parseInt(newVal, 10)
                    return newVal + '%'
                  }}
                  config={{}}
                />
              )
            }}
          />

          <Route
            exact
            path={appUrls.smile}
            render={() => {
              return (
                <InsightsWrap
                  rows={this.props.interviewRows}
                  tabIndex={this.state.tabIndex}
                  customData={[
                    {
                      label: 'Facial Expressions',
                      keys: {
                        shouldShowNull: 'concatenate_status',
                        yAxisKey: 'facial_expression_results.smile_count',
                        yAxisColor: 'facial_expression_results.positive_result',
                      },
                    },
                  ]}
                  modifyDataLabels={val => {
                    let newVal = JSON.parse(JSON.stringify(val))
                    if (newVal > 0 && newVal < 1) newVal = 1
                    else newVal = parseInt(newVal, 10)

                    let suffix = newVal !== 1 ? 'times' : 'time'
                    return `${newVal} ${suffix}`
                  }}
                  config={{ legends: true }}
                />
              )
            }}
          />

          <Route
            exact
            path={appUrls.gesture}
            render={() => {
              return (
                <InsightsWrap
                  rows={this.props.interviewRows}
                  tabIndex={this.state.tabIndex}
                  customData={[
                    {
                      label: 'Hand Gestures',
                      keys: {
                        shouldShowNull: 'concatenate_status',
                        yAxisKey: 'hand_gesture_results.either_hand_detected',
                        yAxisColor: 'hand_gesture_results.gest_combined_val',
                      },
                      maxYPoint: 100,
                    },
                  ]}
                  modifyDataLabels={val => {
                    let newVal = JSON.parse(JSON.stringify(val))
                    if (newVal > 0 && newVal < 1) newVal = 1
                    else newVal = parseInt(newVal, 10)

                    return newVal + '%'
                  }}
                  config={{}}
                />
              )
            }}
          />

          <Route
            exact
            path={appUrls.body}
            render={() => {
              return (
                <InsightsWrap
                  rows={this.props.interviewRows}
                  tabIndex={this.state.tabIndex}
                  customData={[
                    {
                      label: 'Body Posture',
                      keys: {
                        shouldShowNull: 'concatenate_status',
                        yAxisKey:
                          'body_posture_results.straight_lean_ahead_count',
                        yAxisColor:
                          'body_posture_results.straight_lean_ahead_result',
                      },
                      maxYPoint: 100,
                    },
                  ]}
                  modifyDataLabels={val => {
                    let newVal = JSON.parse(JSON.stringify(val))
                    if (newVal > 0 && newVal < 1) newVal = 1
                    else newVal = parseInt(newVal, 10)

                    return newVal + '%'
                  }}
                  config={{}}
                />
              )
            }}
          />

          <Route
            exact
            path={appUrls.appearance}
            render={() => {
              let arr = [
                { name: 'Tie', key: 'tie' },
                { name: 'Suit', key: 'suit' },
              ]

              let modArr = arr.map((item, index) => {
                return {
                  label: item.name,
                  keys: {
                    shouldShowNull: 'concatenate_status',
                    yAxisKey: `appearance.${item.key}`,
                    yAxisColor: `appearance.${item.key}`,
                  },
                  colorValFind: val => {
                    if (val === null) {
                      return null
                    } else if (val === false) {
                      return 2
                    } else if (val === true) {
                      return 0
                    }
                  },
                  yPointsModifier: val => {
                    if (val === null) {
                      return null
                    } else if (val === false) {
                      return 0
                    } else if (val === true) {
                      return 1
                    }
                  },
                }
              })
              return (
                <InsightsWrap
                  rows={this.props.interviewRows}
                  tabIndex={this.state.tabIndex}
                  customData={modArr}
                  modifyDataLabels={val => {
                    if (val === null) {
                      return null
                    } else if (val === 0) {
                      return 'Absent'
                    } else if (val === 1) {
                      return 'Present'
                    }
                  }}
                  config={stringChart}
                />
              )
            }}
          />

          <Route
            exact
            path={appUrls.word}
            render={() => {
              let arr = [
                { heading: 'Filler words', category: 'discourse_markers' },
                { heading: 'Specifics', category: 'specific_words' },
                { heading: 'Action oriented terms', category: 'action_words' },
                { heading: 'Repetitive terms', category: 'repetitive_words' },
                { heading: 'Negative terms', category: 'negative_words' },
              ]

              let modArr = arr.map((item, index) => {
                return {
                  label: item.heading,
                  keys: {
                    shouldShowNull: 'punctuator_status',
                    yAxisKey: `content.content_results_individual`,
                    yAxisColor: `content.${item.category}_result`,
                  },
                  yPointsModifier: (...args) => {
                    let temp = mutualLogics.wordUsageCal(args[0])[item.category]
                      .length
                    return temp
                  },
                }
              })

              return (
                <InsightsWrap
                  rows={this.props.interviewRows}
                  tabIndex={this.state.tabIndex}
                  customData={modArr}
                  modifyDataLabels={val => {
                    let newVal = JSON.parse(JSON.stringify(val))

                    let suffix = newVal !== 1 ? 'entries' : 'entry'
                    return `${newVal} ${suffix}`
                  }}
                  config={{ legends: true }}
                  checkContentDisabled="true"
                />
              )
            }}
          />

          <Route
            exact
            path={appUrls.sentence}
            render={() => {
              let commonArr = [
                {
                  id: 'greeting',
                  heading: 'Greeting',
                  category: 'greeting_result',
                },
                {
                  id: 'education',
                  heading: 'Education',
                  category: 'education_result',
                },
                {
                  id: 'work_experience',
                  heading: 'Experience',
                  category: 'workexp_result',
                },
                {
                  id: 'achievements',
                  heading: 'Achievements',
                  category: 'acheivement_result',
                },
                {
                  id: 'professional_interests',
                  heading: 'Career Interests',
                  category: 'interest_result',
                },
                {
                  id: 'gratitude',
                  heading: 'Gratitude',
                  category: 'gratitude_result',
                },
                { id: 'name', heading: 'Name', category: 'name_result' },
                {
                  id: 'personal_details',
                  heading: 'Personal Details',
                  category: 'personal_result',
                },
                { id: 'hobbies', heading: 'Hobbies', category: 'hobby_result' },
                { id: 'por', heading: 'POR', category: 'por_result' },
              ]

              let common = (item, index) => {
                return {
                  label: item.heading,
                  keys: {
                    shouldShowNull: 'punctuator_status',
                    yAxisKey: `category.${item.category}_value`,
                    yAxisColor: `category.${item.category}`,
                  },
                  yPointsModifier: (val, obj) => {
                    if (val === 'ABSENT') return 0
                    else return 1
                  },
                  colorValFind: (val, obj) => {
                    if (item.group === 'additional') return null
                    else return val
                  },
                }
              }

              let modEssentialArr = [],
                modAdditionalArr = []

              commonArr.forEach((item, index) => {
                if (
                  _.has(essentialSection, item.id) &&
                  essentialSection[item.id]['is_enabled']
                ) {
                  item.group = 'essential'
                  modEssentialArr.push(common(item, index))
                }
                if (
                  _.has(additionalSection, item.id) &&
                  additionalSection[item.id]['is_enabled']
                ) {
                  item.group = 'additional'
                  modAdditionalArr.push(common(item, index))
                }
              })

              return (
                <div>
                  <InsightsWrap
                    rows={this.props.interviewRows}
                    tabIndex={this.state.tabIndex}
                    customData={modEssentialArr}
                    modifyDataLabels={val => {
                      if (val === null) {
                        return null
                      } else if (val === 0) {
                        return 'Absent'
                      } else if (val === 1) {
                        return 'Present'
                      }
                    }}
                    config={stringChart}
                    checkContentDisabled="true"
                  />

                  {modAdditionalArr.length > 0 ? (
                    <div className="mt-6">
                      <InsightsWrap
                        rows={this.props.interviewRows}
                        tabIndex={this.state.tabIndex}
                        customData={modAdditionalArr}
                        modifyDataLabels={val => {
                          if (val === null) {
                            return null
                          } else if (val === 0) {
                            return 'Absent'
                          } else if (val === 1) {
                            return 'Present'
                          }
                        }}
                        config={{ ...stringChart, legends: false }}
                        checkContentDisabled="true"
                      />
                    </div>
                  ) : null}
                </div>
              )
            }}
          />

          <Route
            exact
            path={appUrls.competency}
            render={() => {
              let commonArr = [
                {
                  id: 'Analytical',
                  heading: 'Analytical',
                  group: 'essential',
                },
                {
                  id: 'Communication',
                  heading: 'Communication',
                  group: 'essential',
                },
                {
                  id: 'Organisation & Planning',
                  heading: 'Organisation & Planning',
                  group: 'additional',
                },
                {
                  id: 'Leadership',
                  heading: 'Leadership',
                  group: 'additional',
                },
                {
                  id: 'Teamwork',
                  heading: 'Teamwork',
                  group: 'additional',
                },
              ]

              let common = (item, index) => {
                return {
                  label: item.heading,
                  keys: {
                    shouldShowNull: 'punctuator_status',
                    yAxisKey: `competency.competency_results_individual`,
                    yAxisColor: `competency.competency_results_individual.${item.id}.results`,
                  },
                  yPointsModifier: (...args) => {
                    return args[0][item.id]['categories'].length
                  },
                }
              }

              let modEssentialArr = []

              commonArr.forEach((item, index) => {
                modEssentialArr.push(common(item, index))
              })

              const dataLabelCal = val => {
                if (val === null) return null
                else if (val === 1) return `${val} entry`
                else return `${val} entries`
              }

              return (
                <div>
                  <InsightsWrap
                    rows={this.props.interviewRows}
                    tabIndex={this.state.tabIndex}
                    customData={modEssentialArr}
                    modifyDataLabels={val => {
                      return dataLabelCal(val)
                    }}
                    config={{}}
                    checkContentDisabled="true"
                  />
                </div>
              )
            }}
          />

          <Route
            exact
            path={appUrls.vocal}
            render={() => {
              return (
                <InsightsWrap
                  rows={this.props.interviewRows}
                  tabIndex={this.state.tabIndex}
                  customData={[
                    {
                      label: 'Intensity',
                      keys: {
                        shouldShowNull: 'post_gentle_praat_status',
                        yAxisKey:
                          'sound_results.sound_results_individual.intensity',
                        yAxisColor: 'sound_results.intensity_result',
                      },
                      unit: 'dB',
                      plotBands: {
                        from: 65,
                        to: 75,
                        label: '',
                        text: 'Good range',
                        textColor: 'grey',
                        color: 'rgba(68, 170, 213, 0.1)',
                      },
                      maxYPoint: 120,
                    },
                    {
                      label: 'Speech Rate',
                      keys: {
                        shouldShowNull: 'post_gentle_praat_status',
                        yAxisKey: 'sound_results.sound_results_individual.wpm',
                        yAxisColor: 'sound_results.wpm_result',
                      },
                      pointLabelLogic: val => {
                        if (val === IDEAL_WPM) return `${val}+`
                        else return val
                      },
                      yPointsModifier: val => {
                        return mutuals.modifyWPMVal(val)
                      },
                      unit: 'wpm',
                      plotBands: {
                        from: 110,
                        to: 140,
                        label: '',
                        text: 'Good range',
                        textColor: 'grey',
                        color: 'rgba(68, 170, 213, 0.1)',
                      },
                      maxYPoint: 300,
                    },
                    {
                      label: 'Pitch',
                      keys: {
                        shouldShowNull: 'post_gentle_praat_status',
                        yAxisKey:
                          'sound_results.sound_results_individual.pitch',
                        yAxisColor: 'sound_results.pitch_result',
                      },
                      unit: 'Hz',
                      plotBands: {
                        from: 85,
                        to: 255,
                        label: '',
                        text: 'Good range',
                        textColor: 'grey',
                        color: 'rgba(68, 170, 213, 0.1)',
                      },
                      maxYPoint: 300,
                    },
                  ]}
                  modifyDataLabels={val => {
                    let newVal = JSON.parse(JSON.stringify(val))
                    if (newVal > 0 && newVal < 1) newVal = 1
                    else newVal = parseInt(newVal, 10)

                    return newVal
                  }}
                  config={{ legends: true }}
                />
              )
            }}
          />

          <Route
            exact
            path={appUrls.pauses}
            render={() => {
              return (
                <div>
                  <InsightsWrap
                    rows={this.props.interviewRows}
                    tabIndex={this.state.tabIndex}
                    customData={[
                      {
                        label: 'Short Pause',
                        keys: {
                          shouldShowNull: 'post_gentle_praat_status',
                          yAxisKey: 'pause.pause_results_individual.short',
                          yAxisColor:
                            'pause.pause_results_individual.short_result',
                        },
                      },
                      {
                        label: 'Medium Pause',
                        keys: {
                          shouldShowNull: 'post_gentle_praat_status',
                          yAxisKey: 'pause.pause_results_individual.medium',
                          yAxisColor:
                            'pause.pause_results_individual.medium_result',
                        },
                      },
                      {
                        label: 'Long Pause',
                        keys: {
                          shouldShowNull: 'post_gentle_praat_status',
                          yAxisKey: 'pause.pause_results_individual.long',
                          yAxisColor:
                            'pause.pause_results_individual.long_result',
                        },
                      },
                    ]}
                    modifyDataLabels={val => {
                      let newVal = JSON.parse(JSON.stringify(val))

                      let suffix = newVal !== 1 ? 'times' : 'time'
                      return `${newVal} ${suffix}`
                    }}
                    config={{ legends: true }}
                  />
                </div>
              )
            }}
          />

          <Route
            exact
            path={appUrls.disfluencies}
            render={() => {
              return (
                <InsightsWrap
                  rows={this.props.interviewRows}
                  tabIndex={this.state.tabIndex}
                  customData={[
                    {
                      label: 'Ah-Um Counter',
                      keys: {
                        shouldShowNull: 'post_gentle_praat_status',
                        yAxisKey: 'fillers.filler_results_individual',
                        yAxisColor: 'fillers.disfluency_result',
                      },
                      yPointsModifier: val => {
                        return mutualLogics.disfluencyRes(val).counterD
                      },
                    },
                    {
                      label: 'Elongation',
                      keys: {
                        shouldShowNull: 'post_gentle_praat_status',
                        yAxisKey: 'fillers.filler_results_individual',
                        yAxisColor: 'fillers.elongation_result',
                      },
                      yPointsModifier: val => {
                        return mutualLogics.elongRes(val).counterE
                      },
                    },
                  ]}
                  config={{ legends: true }}
                />
              )
            }}
          />

          <Route
            exact
            path={appUrls.modulation}
            render={() => {
              return (
                <InsightsWrap
                  rows={this.props.interviewRows}
                  tabIndex={this.state.tabIndex}
                  customData={[
                    {
                      label: 'Modulation using pitch',
                      keys: {
                        shouldShowNull: 'post_gentle_praat_status',
                        yAxisKey:
                          'articulation.articulation_results_individual.pitch',
                        yAxisColor: 'articulation.pitch_modulation_result',
                      },
                      yPointsModifier: val => {
                        if (val === null) {
                          return null
                        } else if (val === 'Good') {
                          return 1
                        } else if (val === 'Bad') {
                          return 0
                        }
                      },
                    },
                    {
                      label: 'Modulation using pause',
                      keys: {
                        shouldShowNull: 'post_gentle_praat_status',
                        yAxisKey:
                          'articulation.articulation_results_individual.pause',
                        yAxisColor: 'articulation.pause_modulation_result',
                      },
                      yPointsModifier: val => {
                        if (val === null) {
                          return null
                        } else if (val === 'Good') {
                          return 1
                        } else if (val === 'Bad') {
                          return 0
                        }
                      },
                    },
                  ]}
                  modifyDataLabels={val => {
                    if (val === null) {
                      return null
                    } else if (val === 0) {
                      return 'Absent'
                    } else if (val === 1) {
                      return 'Present'
                    }
                  }}
                  config={stringChart}
                />
              )
            }}
          />
        </div>
      ) : (
        <div
          className="bg-white p-6 insightsWrap mt-12"
          style={{ margin: '0 auto', maxWidth: 450 }}
          onScroll={() => {
            this.trackOnScroll()
          }}
          tabIndex={this.state.tabIndex}
          aria-label={`Please note that the insights are visible once you have completed 3 interview attempts on the platform.`}>
          <div className="grid" style={{ gridTemplateColumns: '150px 1fr' }}>
            <span className="para pr-12">
              <img
                src={
                  process.env.APP_PRODUCT_BASE_URL +
                  '/dist/images/new/icons/insights.svg'
                }
                alt={`insights`}
              />
            </span>
            <span className="pt-6 para">
              <p className="subHead">Unlock Insights</p>
              <p className="mt-2">This section is currently locked. </p>
              <p>You’ll be able to access it after 4 attempts</p>
            </span>
          </div>
        </div>
      )
    ) : (
      <div className="clearfix loaderWrap p-6">
        <Loader
          type={compLoader.type}
          active
          style={{ transform: compLoader.scale }}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    common: state.commonStuff,
    interviewRows: state.interviewKeys !== -1 ? removeCurrentIntKey(state) : -1,
    additionalSection:
      state.epCustomizations['sentence_analysis_details']['additional_section'],
    essentialSection:
      state.epCustomizations['sentence_analysis_details']['essential_section'],
    customizations: _.isEmpty(state.epCustomizations)
      ? null
      : state.epCustomizations,
  }
}

function removeCurrentIntKey(state) {
  let keys = state.interviewKeys.interviewKeys
  let currkey = parseInt(state.appIntKey.key, 10)

  let newKeys = keys.filter((item, index) => {
    return item.interview_key !== currkey
  })

  //show only 5 entries in insights section
  if (newKeys.length >= 6) {
    newKeys.splice(5, 1)
  }

  return newKeys
}

export default connect(mapStateToProps, {})(InsightsAllSection)
