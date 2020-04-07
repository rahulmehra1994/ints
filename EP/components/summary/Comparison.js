import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  mutuals,
  common,
  highContrast,
  getStatusIcon,
  log,
} from './../../actions/commonActions'

import LevelInfo from './../../components/popups/LevelInfo'
import Disclaimer from './../../disclaimer-show-feature/containers/disclaimer/Disclaimer'

const level1 =
  process.env.APP_BASE_URL + '/dist/images/new/summary/non-ada/level1.svg'
const level2 =
  process.env.APP_BASE_URL + '/dist/images/new/summary/non-ada/level2.svg'
const level3 =
  process.env.APP_BASE_URL + '/dist/images/new/summary/non-ada/level3.svg'
const level4 =
  process.env.APP_BASE_URL + '/dist/images/new/summary/non-ada/level4.svg'
const level5 =
  process.env.APP_BASE_URL + '/dist/images/new/summary/non-ada/level5.svg'

const level1Ada =
  process.env.APP_BASE_URL + '/dist/images/new/summary/ada/level1.svg'
const level2Ada =
  process.env.APP_BASE_URL + '/dist/images/new/summary/ada/level2.svg'
const level3Ada =
  process.env.APP_BASE_URL + '/dist/images/new/summary/ada/level3.svg'
const level4Ada =
  process.env.APP_BASE_URL + '/dist/images/new/summary/ada/level4.svg'
const level5Ada =
  process.env.APP_BASE_URL + '/dist/images/new/summary/ada/level5.svg'

const confetti =
  process.env.APP_BASE_URL + '/dist/images/new/summary/confetti.svg'
const trophyFinalLevel =
  process.env.APP_BASE_URL + '/dist/images/new/summary/trophy-final-level.svg'

const levels = highContrast
  ? [level1Ada, level2Ada, level3Ada, level4Ada, level5Ada]
  : [level1, level2, level3, level4, level5]
var Loader = require('react-loaders').Loader
const tasksToShowCount = 3
class Comparison extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisiblity: false,
      remainingParameters: [],
      currLevelTotalTasks: 0,
      onFinalLevel: false,
    }
  }

  safeToRender() {
    return this.props.performanceInfo !== null
  }

  subLevelsOngoingBlock = _.once(() => {
    let currLevel = this.props.performanceInfo.current_level
    let levelToFind = parseInt(currLevel.split(' ')[1], 10)

    if (levelToFind < 5) {
      levelToFind = `Level ${levelToFind + 1}`
      this.findRemainingTasks()
    } else {
      this.setState({ onFinalLevel: true })
    }

    this.setState({ onGoingLevel: levelToFind })
  })

  findRemainingTasks(onGoingLevel) {
    let currLevelTotalTasks = 0
    let remainingParameters = []

    let parameterLoop = function(item) {
      let handleParameters = function(parameterVal, parameterkey) {
        if (parameterVal.status === 2) {
          let temp = Object.assign(
            {},
            { label: parameterkey },
            { parameter: parameterVal }
          )
          remainingParameters.push(temp)
        }

        if (_.has(parameterVal, 'required_value')) currLevelTotalTasks += 1
      }

      _.each(item.subSection, handleParameters)
    }

    let checkSubSectionFurtherNested = function(item) {
      let subSectionLabel = item.label
      let subSection = item.subSection

      if (_.has(subSection, 'required_value') && subSection.status === 2) {
        let temp = Object.assign(
          {},
          { label: subSectionLabel },
          { parameter: subSection }
        )
        remainingParameters.push(temp)
        currLevelTotalTasks += 1
      } else {
        //check further inside the subSection
        parameterLoop(item)
      }
    }

    let sectionIterator = function(item) {
      let handleSection = (subSectionVal, subSectionkey) => {
        let temp = Object.assign(
          {},
          { label: subSectionkey },
          { subSection: subSectionVal }
        )
        checkSubSectionFurtherNested(temp)
      }
      _.each(item.section, handleSection)
    }

    let levelsIterator = function(levels) {
      let handleLevel = (level, levelKey) => {
        if (level.status === 'next') {
          let item = Object.assign(
            {},
            { label: levelKey },
            { section: level.section }
          )
          sectionIterator(item)
        }
      }
      _.each(levels, handleLevel)
    }

    levelsIterator(this.props.performanceInfo.level_info)
    this.setState({
      remainingParameters: remainingParameters,
      currLevelTotalTasks: currLevelTotalTasks,
    })
  }

  currentLevelNumber(level) {
    let arr = level.split(' ')
    return parseInt(arr[1], 10) - 1
  }

  modalVisiblity = val => {
    this.setState({ modalVisiblity: val })
  }

  getWidthTasks() {
    let { currLevelTotalTasks, remainingParameters } = this.state
    if (currLevelTotalTasks === 0) return `0%`

    let tasksDoneCount = currLevelTotalTasks - remainingParameters.length
    let percent = (tasksDoneCount / currLevelTotalTasks) * 100

    if (percent === 0) return `5%`

    return `${percent}%`
  }

  nonFinalLevel() {
    let { performanceInfo } = this.props
    let { remainingParameters } = this.state
    return (
      <section>
        <div className="">
          <p className="text-18-demi">Up Next</p>

          <div
            className="grid mt-4"
            style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="flex items-center">
              <span className="text-14-med hintColor">
                {performanceInfo.current_level}
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="ep-icon-arrow-right text-center text-20-demi hintColor" />
            </div>
            <div className="flex items-center justify-end">
              <span className="text-center text-18-demi">
                {this.state.onGoingLevel}
              </span>
            </div>
          </div>

          <div className="progressbar-underlay">
            <div
              className="progressbar bluePrimaryBg"
              style={{
                width: this.getWidthTasks(),
              }}
            />
          </div>

          <div className="text-center mt-4">
            <span className="text-16-demi">
              {remainingParameters.length}{' '}
              {mutuals.singluarOrPlural(remainingParameters.length, 'Task')}{' '}
            </span>
            <span className="text-14-med hintColor">
              to {this.state.onGoingLevel}
            </span>
          </div>
        </div>

        <div className="hr my-6" />

        <div className="">
          <div>
            <span
              className="ep-icon-wrong-outline text-20-med"
              style={{
                color: common.sectionColor[2],
                verticalAlign: 'sub',
              }}
            />
            <span className="ml-2">
              {remainingParameters.length} Remaining{' '}
              {mutuals.singluarOrPlural(remainingParameters.length, 'task')}
            </span>
          </div>
          {remainingParameters.map((item, index) => {
            if (index <= tasksToShowCount) {
              return (
                <div
                  key={index}
                  className="mt-4 grid"
                  style={{ gridTemplateColumns: '22px 1fr' }}>
                  <div>{index + 1}. </div>
                  <div>
                    <span>Achieve</span>{' '}
                    <span
                      className="px-1 rounded"
                      style={{
                        color: common.sectionColor[item.parameter.status],
                        background: common.lightBgColor[item.parameter.status],
                      }}>
                      {item.parameter.required_value}
                    </span>
                    <span> in {item.label}</span>
                  </div>
                </div>
              )
            } else {
              return null
            }
          })}
        </div>
      </section>
    )
  }

  finalLevel() {
    let { remainingParameters } = this.state
    let { performanceInfo } = this.props

    return (
      <div className="bg-white shadow-1 rounded" style={{ minHeight: 727 }}>
        <div className="relative">
          <img className="w-full" src={confetti} alt="decoration" />
          <div
            className="absolute w-full text-center text-24-bold"
            style={{ bottom: 20, color: '#27b8a0' }}>
            Congratulations
          </div>
        </div>

        <div className="text-center px-6" style={{ marginTop: 40 }}>
          <div>
            <div className="text-24-bold">{performanceInfo.current_level}</div>
            <div className="text-12-normal hintColor">Achieved</div>
          </div>

          <div className="mt-2">
            <img src={trophyFinalLevel} alt="decoration" />
          </div>
        </div>

        <div style={{ marginTop: 60 }}>
          <div className="hr" />
          <div className="px-4">{this.opiBlock()}</div>
          <div className="hr" />
        </div>

        <div className="text-center" style={{ marginTop: 60 }}>
          <span
            className="ep-icon-right-outtline text-18-normal align-text-bottom"
            style={{ color: common.sectionColor[0] }}
          />
          <span className="ml-2 text-14-demi">All tasks completed</span>
        </div>

        {this.levelInfoBlock()}
      </div>
    )
  }

  levelInfoBlock() {
    let { remainingParameters } = this.state
    let { performanceInfo } = this.props
    return (
      <LevelInfo
        {...this.props}
        modalVisiblity={this.modalVisiblity}
        count={remainingParameters.length}
        tasksToShowCount={tasksToShowCount}
      />
    )
  }

  opiBlock() {
    let { performanceInfo } = this.props
    return (
      <div className="flex items-center justify-between text-center">
        <span className="float-left">
          <span className="text-14-med"> Overall Performance Index</span>
          <span className="text-16-demi ml-4">{performanceInfo.op_index} </span>
          <span className="font-size-s" style={{ marginLeft: -5 }}>
            /5
          </span>
        </span>
        <span className="float-right">
          <Disclaimer
            body="Overall Performance Index (OPI) is the cumulative measure of
    your performance over the recent interview attempts."
            config={{ style: { width: 260 }, icon: 'ep-icon-info-outline' }}
          />
        </span>
      </div>
    )
  }

  render() {
    let { performanceInfo } = this.props
    let { remainingParameters } = this.state

    return this.safeToRender() ? (
      <React.Fragment>
        <div
          role="main"
          aria-label={`you are at ${performanceInfo.current_level}`}
          className={'comparison-container ' + this.props.customClasses}>
          {this.state.onFinalLevel ? (
            this.finalLevel()
          ) : (
            <section>
              <div className="bg-white shadow-1 px-6 py-8 rounded">
                <div>
                  <div className="absolute">
                    <div className="hintColor text-16-med">
                      Current Performance
                    </div>
                    <div className="text-20-bold">
                      {' '}
                      {performanceInfo.current_level}
                    </div>
                  </div>

                  <img
                    style={{ width: '100%', height: 185, marginTop: 25 }}
                    src={
                      levels[
                        this.currentLevelNumber(performanceInfo.current_level)
                      ]
                    }
                    alt={`you are at ${performanceInfo.current_level}`}
                  />
                </div>
                <div className="subHead mt-2 font-bold"></div>
                <div className="hr mt-6 mb-6" />
                {this.opiBlock()}
              </div>

              <div className="hr mt-2" />

              {this.subLevelsOngoingBlock()}

              <div
                className="bg-white shadow-1 px-6 py-8 rounded"
                style={{ height: 378 }}>
                {this.nonFinalLevel()}
                {this.levelInfoBlock()}
              </div>
            </section>
          )}
        </div>

        {this.state.modalVisiblity ? (
          <div
            className="fixed pin"
            style={{ background: 'rgba(0,0,0, 0.5)', zIndex: 10 }}
          />
        ) : null}
      </React.Fragment>
    ) : (
      <div className="clearfix loaderWrap">
        <Loader
          type={common.compLoader.type}
          active
          style={{ transform: common.compLoader.scale }}
        />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    totalRes: state.results.totalResult,
    performanceInfo: state.results.performanceInfo,
  }
}

export default connect(
  mapStateToProps,
  {}
)(Comparison)
