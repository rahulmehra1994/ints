import React, { Component } from 'react'
import ModalHOC from '../hoc/ModalHOC'
import _ from 'underscore'
import {
  getStatusIcon,
  common,
  highContrast,
  mutuals,
  log,
} from './../../actions/commonActions'
const FocusTrap = require('focus-trap-react')
var Loader = require('react-loaders').Loader
var classNames = require('classnames')

class LevelInfo extends Component {
  constructor(...args) {
    super(...args)
    this.state = { isModalOpen: false, levels2: [], isExpanded: false }
    this.modalToggler = this.modalToggler.bind(this)
    this.escEvent = this.escEvent.bind(this)
  }

  attachEscEvent() {
    document.addEventListener('keydown', this.escEvent)
  }

  removeEscEvent() {
    document.removeEventListener('keydown', this.escEvent)
  }

  escEvent(e) {
    if (e.key === 'Escape') {
      this.modalToggler()
    }
  }

  componentWillUnmount() {
    this.removeEscEvent()
  }

  scrollModalUp() {
    document.querySelector('.summ-main-wrap').scrollTop = 0
  }

  modalToggler() {
    this.setState({ isModalOpen: !this.state.isModalOpen }, () => {
      this.props.modalVisiblity(mutuals.deepCopy(this.state.isModalOpen))
      if (this.state.isModalOpen === true) {
        this.scrollModalUp()
      }

      if (this.state.isModalOpen) {
        this.attachEscEvent()
      }
      if (this.state.isModalOpen === false) {
        this.removeEscEvent()
      }
    })
  }

  mgsBlock(val) {
    let stl = {
      padding: '2px 7px',
      marginLeft: 5,
      borderRadius: 9,
      fontSize: 10,
      fontWeight: 600,
    }
    if (val === 'done') {
      return (
        <span style={{ ...stl, background: common.lightBgColor[0] }}>
          COMPLETED
        </span>
      )
    }

    if (val === 'next') {
      return (
        <span style={{ ...stl, background: common.lightBgColor[1] }}>
          ONGOING
        </span>
      )
    }

    if (val === 'ongoing') {
      return null
    }
  }

  levelHeadBlock(label, status) {
    return (
      <div className="mb-5">
        {' '}
        <span className="subHead">{label}</span> {this.mgsBlock(status)}
      </div>
    )
  }

  sectionBlock(label, status, index, selectedItem) {
    let isClickable = selectedItem.arr.length > 0
    return (
      <button
        key={index}
        className="section-head"
        disabled={!isClickable}
        onClick={() => {
          log('what i have to see', this.state.levels2, selectedItem)
          let temp = this.state.levels2.map((item, index) => {
            item.arr.map((item2, index2) => {
              if (item2.id === selectedItem.id) item2.isOpen = !item2.isOpen
              return item2
            })
            return item
          })
          this.setState({ item: temp })
        }}
        tabIndex={this.props.tabIndex}
        aria-label={
          selectedItem.isOpen
            ? `collapse ${selectedItem.label}`
            : `expand ${selectedItem.label}`
        }>
        <span className="">{getStatusIcon[status]}</span>
        <span className="ml-6 paraHead">{label}</span>

        {isClickable ? (
          <span className="float-right hintColor" style={{ fontSize: 16 }}>
            {selectedItem.isOpen ? (
              <span className="ep-icon-expand-up"></span>
            ) : (
              <span className="ep-icon-expand-down"></span>
            )}
          </span>
        ) : null}
      </button>
    )
  }

  subSectionBlock(item) {
    let arr = item.arr
    if (arr.length === 0) return null
    return (
      <div
        className={classNames('p-4 sub-section', { hidden: !item.isOpen })}
        style={{ paddingLeft: 50 }}>
        <div
          className="grid-2-cols paraHead"
          style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="pl-10">Objectives</div>
          <div className="">Required</div>
        </div>
        {arr.map((item, index) => {
          return (
            <div
              key={index}
              className="grid-2-cols mt-6"
              style={{ gridTemplateColumns: '2fr 1fr' }}>
              <div>
                <span className="">{getStatusIcon[item.status]}</span>
                <span className="ml-4">{item.label}</span>
              </div>
              <div className="">{item.requiredValue}</div>
            </div>
          )
        })}
      </div>
    )
  }

  extractSections(obj) {
    let modArr = Object.keys(obj).map(item => {
      let temp = []
      for (let key in obj[item]) {
        if (key !== 'status' && key !== 'value' && key !== 'required_value')
          temp.push({
            label: key,
            status: obj[item][key]['status'],
            requiredValue: obj[item][key]['required_value'],
          })
      }

      return {
        id: item + mutuals.randomStr(5),
        label: item,
        status: obj[item]['status'],
        arr: temp,
        isOpen: false,
      }
    })

    return modArr
  }

  levelLockedBlock() {
    return (
      <div className="text-center">
        <div className="hintColor paraHead">Level Locked</div>
        <div className="hintColor para">
          Complete the previous levels to view
        </div>
      </div>
    )
  }

  levelUnlocked(item) {
    return item.arr.map((innerItem, index2) => {
      let temp1 = this.sectionBlock(
        innerItem.label,
        innerItem.status,
        index2,
        innerItem
      )
      let temp2 = this.subSectionBlock(innerItem)
      return (
        <div key={index2}>
          {temp1}
          {temp2}
        </div>
      )
    })
  }

  UNSAFE_componentWillMount() {
    let { level_info } = this.props.performanceInfo
    let levelsObj = level_info

    let levels = Object.keys(levelsObj).map(key => {
      return {
        label: key,
        status: levelsObj[key]['status'],
        arr: this.extractSections(levelsObj[key]['section']),
      }
    })

    this.setState({ levels2: levels })
  }

  expandContract = () => {
    let temp = this.state.levels2.map((item, index) => {
      item.arr.map((item2, index2) => {
        if (this.state.isExpanded) {
          item2.isOpen = false
        } else {
          item2.isOpen = true
        }
        return item2
      })
      return item
    })
    this.setState({ item: temp, isExpanded: !this.state.isExpanded })
  }

  render() {
    let { levels2, isExpanded } = this.state
    let { tasksToShowCount, count, tabIndex } = this.props

    return (
      <React.Fragment>
        <div className="mt-6">
          <button
            className="bluePrimaryTxt text-14-demi"
            style={{ width: '100%' }}
            tabIndex={tabIndex}
            aria-label={`level objectives button`}
            onClick={this.modalToggler}>
            See All{count > tasksToShowCount ? `(${count})` : null}
          </button>
        </div>

        {this.state.isModalOpen ? (
          <div id="scrollerer">
            <button
              className="epModalClose"
              style={{ right: -478 }}
              onClick={() => {
                this.modalToggler()
              }}
              tabIndex={tabIndex}
              aria-label={'Level info popup close button'}>
              <span className="ep-icon-close"></span>
            </button>
            <div className="level-info-modal p-3">
              <div className="px-5 pt-8 pb-4">
                <span className="font-bold" style={{ fontSize: 24 }}>
                  Levels Objectives
                </span>
                <button
                  className="ml-6 bluePrimaryTxt font-semibold"
                  onClick={() => {
                    this.expandContract()
                  }}>
                  {isExpanded ? 'Collapse All' : 'Expand All'}
                </button>
              </div>

              {levels2.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="px-5 py-5">
                      <div key={index} className="">
                        {this.levelHeadBlock(item.label, item.status)}

                        {item.status === 'ongoing'
                          ? this.levelLockedBlock()
                          : this.levelUnlocked(item)}
                      </div>
                    </div>
                    <div className="hr" />
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </React.Fragment>
    )
  }
}

export default ModalHOC(LevelInfo)
