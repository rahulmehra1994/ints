import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { log, mutuals } from './../../actions/commonActions'
import { updateUserInfo, getUserInfo } from './../../actions/apiActions'
import { createInterview2 } from './../../actions/interviewActions'
import CenterLoading from './../CenterLoading/index'
import $ from 'jquery'
const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)

var classNames = require('classnames')

class InterviewQuestions extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      isConfirmActive: false,
      selectedQues: null,
      sectionIndexes: [],
      data: [],
      selectedDomain: [],
      selectedQuesArr: [],
      disabler: false,
    }

    this.onSuccess = this.onSuccess.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentDidMount() {
    let { customizations } = this.props

    mutuals.socketTracking({
      curr_page: '/interview-question-popup',
      event_type: 'mount',
      event_description: 'interview question popup opened',
      interview_id: -1,
    })
    this.modifyData()
  }

  submit() {
    let { selectedQues } = this.state

    // mutuals.socketTracking({
    //   event_type: 'click',
    //   event_description: `confirm_button_results_gender_${genderSelected}_accent_${langCode}`,
    //   interview_id: -1,
    // })

    if (selectedQues === null) {
      alert('Please select the question')
      return
    }
    this.setState({ isConfirmActive: false, disabler: true })

    let fd = new FormData()
    fd.append('question_id', selectedQues.question_id)
    createInterview2(this.onSuccess, fd)
  }

  onSuccess(data) {
    this.props.onSuccessOfCreateInt(data)
    getUserInfo()
    this.setState({ isConfirmActive: true, disabler: false })
    this.props.changeFirstTimeUserStatusAndClosePopup()

    trackingDebounceSmall({
      event_type: 'app flow',
      event_description: 'interview question popup closed',
    })
  }

  modifyData() {
    let { customizations, userInfoEP } = this.props
    let { questionData } = userInfoEP
    let get = obj => {
      return obj.map((item, index) => {
        let keys = Object.keys(item)
        item.label = keys[0]
        item.isOpen = false
        item.isSelected = false
        return item
      })
    }

    let changedData = customizations.questions.map((item, index) => {
      let keys = Object.keys(item)
      item[keys[0]] = get(item[keys[0]])
      item.label = keys[0]
      item.isSelected = false
      if (index === 0) item.isOpen = true
      else item.isOpen = false
      return item
    })

    this.lastTimeFullSelection(changedData)
  }

  lastTimeFullSelection(data) {
    let { customizations, userInfoEP } = this.props
    let { questionData } = userInfoEP
    if (questionData && questionData.question_content !== '') {
      let final = data.map((item, index) => {
        if (questionData.question_domain === item.label) {
          item.isSelected = true
          item.isOpen = true
          this.setState({
            selectedDomain: item[item.label],
          })
          item[item.label] = this.selectLastTimeCat(
            item[item.label],
            questionData
          )
        } else {
          item.isSelected = false
          item.isOpen = false
        }
        return item
      })

      this.setState({
        data: final,
      })
    } else {
      this.setState({
        data: data,
        selectedDomain: data[0][data[0]['label']],
      })
    }
  }

  selectLastTimeCat(obj, questionData) {
    return obj.map((item, index) => {
      if (questionData.question_section === item.label) {
        item.isSelected = true
        item.isOpen = true
        this.setState({
          selectedQuesArr: item[item.label],
        })
        this.selectLastTimeQues(item[item.label], questionData)
      } else {
        item.isSelected = false
        item.isOpen = false
      }
      return item
    })
  }

  selectLastTimeQues(obj, questionData) {
    obj.map((item, index) => {
      if (questionData.question_id === item.question_id) {
        this.setState({
          selectedQues: {
            question_content: item.question_content,
            question_id: item.question_id,
          },
        })
      }
      return item
    })
  }

  handleDomainClick(item, key) {
    let selectedDomainFound = []
    let arr = this.state.data.map((item, index) => {
      let tempKey = Object.keys(item)[0]
      if (tempKey === key) {
        item.isOpen = true
        selectedDomainFound = item[key]
      } else {
        item.isOpen = false
      }

      return item
    })

    this.setState({
      data: arr,
      selectedDomain: selectedDomainFound,
      selectedQuesArr: [],
    })
  }

  handleCategoryEvent(key) {
    this.scrollCompToTop()
    let selectedCategoryFound = []
    let arr = this.state.selectedDomain.map((item, index) => {
      let tempKey = Object.keys(item)[0]
      if (tempKey === key) {
        item.isOpen = !item.isOpen
        selectedCategoryFound = item[key]
      } else {
        item.isOpen = false
      }

      return item
    })

    let data = []

    data = this.state.data.map((item, index) => {
      let tempKey = Object.keys(item)[0]
      if (tempKey === key) {
        return arr
      } else {
        return item
      }
    })

    this.setState({
      data: data,
      selectedDomain: arr,
      selectedQuesArr: selectedCategoryFound,
    })
  }

  scrollCompToTop() {
    $('#categories').scrollTop(0)
  }

  allCategoriesUnSelection() {
    let unSelect = arg => {
      return arg.map((item, index) => {
        item.isSelected = false
        return item
      })
    }

    let res = this.state.data.map((item, index) => {
      let d = unSelect(item[item.label])
      item[item.label] = d
      return item
    })

    return res
  }

  handleSelectedQues(item, parentKey) {
    let key = parentKey
    let selectedDomainKey, selectedDomainIndex
    let selectedCategoryKey, selectedCategoryIndex
    let selectedCategoryFound = []

    let cleanData = this.allCategoriesUnSelection()

    let myData = cleanData.map((item, index) => {
      if (item.isOpen) {
        item.isSelected = true
        selectedDomainKey = item.label
        selectedDomainIndex = index
      } else {
        item.isSelected = false
      }
      return item
    })

    let selectedDomainArr = this.state.selectedDomain.map((item, index) => {
      if (item.isOpen) {
        item.isSelected = true
        selectedCategoryKey = item.label
        selectedCategoryIndex = index
      } else {
        item.isSelected = false
      }

      return item
    })

    myData[selectedDomainIndex][selectedDomainKey] = selectedDomainArr

    this.setState(
      {
        data: myData,
        selectedDomain: selectedDomainArr,
        selectedQues: {
          question_content: item.question_content,
          question_id: item.question_id,
        },
      },
      () => {
        this.checkInputs()
      }
    )
  }

  checkInputs() {
    if (this.state.selectedQues !== null) {
      this.setState({ isConfirmActive: true })
    } else {
      this.setState({ isConfirmActive: false })
    }
  }

  isQuesSelected(item) {
    let { selectedQues } = this.state
    if (selectedQues && selectedQues.question_id === item.question_id) {
      return '#cbe3f5'
    } else {
      return null
    }
  }

  render() {
    let { data, selectedDomain, selectedQues, selectedQuesArr } = this.state

    return (
      <div className="">
        {this.state.disabler ? (
          <div className="epModalCover">
            <CenterLoading />
          </div>
        ) : null}

        <div className="grid" style={{ gridTemplateColumns: '264px 1fr' }}>
          <div className="domain-wrap">
            {this.state.data.map((item, index) => {
              return (
                <div
                  key={index}
                  className={classNames('each-domain cursor-pointer', {
                    domainActive: item.isOpen,
                  })}
                  onClick={() => {
                    this.handleDomainClick(item, item.label)
                  }}>
                  {item.label}

                  {item.isSelected ? (
                    <span className="ep-icon-right-rounded ml-6"></span>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div id="categories" className="questions-cat-wrap">
            <div className="text-left clearfix">
              {selectedDomain.map((item, index) => {
                return (
                  <div key={index} className="int-ques">
                    <label
                      className={classNames(
                        'paraHead px-8 py-4 cursor-pointer',
                        { 'cat-active': item.isSelected }
                      )}>
                      {item.label}
                      {item.isSelected ? (
                        <span className="ep-icon-right-rounded ml-6"></span>
                      ) : null}
                      <button
                        className="float-right"
                        style={{ fontSize: 25 }}
                        onClick={() => {
                          this.handleCategoryEvent(item.label)
                        }}
                        tabIndex="20"
                        aria-label={`question selection button`}>
                        {item.isOpen ? (
                          <span className="ep-icon-expand-up"></span>
                        ) : (
                          <span className="ep-icon-expand-down"></span>
                        )}
                      </button>
                    </label>

                    {item.isOpen ? (
                      <div className="fadeInUp ques-comp">
                        {selectedQuesArr.map((item2, index2) => {
                          return (
                            <button
                              key={index2}
                              style={{
                                background: this.isQuesSelected(item2),
                              }}
                              className="cursor-pointer py-4 pr-4 pl-12 w-full text-left relative"
                              onClick={() => {
                                this.handleSelectedQues(item2, item.label)
                              }}>
                              {this.isQuesSelected(item2) ? (
                                <span
                                  className="ep-icon-right absolute"
                                  style={{ left: 10, top: 10 }}>
                                  {' '}
                                </span>
                              ) : null}
                              {index2 + 1}. {item2.question_content}
                            </button>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="questions-footer">
          <button
            className="bluePrimaryTxt mr-12 subHead"
            onClick={() => {
              this.props.gotoBasicDetails()
            }}
            tabIndex="20"
            aria-label={`confirm your options`}>
            <span
              className="ep-icon-expand-left"
              style={{
                '-webkit-text-stroke': '1px',
                'vertical-align': -2,
              }}
            />

            <span className="ml-2">Back</span>
          </button>

          <button
            type="button"
            onClick={() => {
              this.submit()
            }}
            className={classNames('button blueButton', {
              'opacity-50': !this.state.isConfirmActive,
            })}
            style={{ paddingTop: 12, paddingBottom: 12 }}
            disabled={!this.state.isConfirmActive}
            tabIndex="20"
            aria-label={`confirm your options`}>
            Save And Exit
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    common: state.commonStuff,
    customizations: state.epCustomizations,
    userInfoEP: state.userInfoEP,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterviewQuestions)
