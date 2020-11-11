import React from 'react'
import _ from 'underscore'
import ReactTooltip from 'react-tooltip'

var classNames = require('classnames')

export default class Tabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPosition: null,
      showDisabledToolTip: false,
      currentHovered: null,
    }
    this.checkForNonEmptyArray = this.checkForNonEmptyArray.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  componentDidMount() {
    this.checkForNonEmptyArray(this.props)
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.tabsData.length !== newProps.tabsData.length) {
      this.checkForNonEmptyArray(newProps)
    }
  }

  checkForNonEmptyArray = newProps => {
    let { tabsData } = newProps

    for (let i = 0; i < tabsData.length; i++) {
      if (tabsData[i].arr.length > 0) {
        this.setState({ currentPosition: i })
        this.handleClick(tabsData[i], i)
        break
      }
    }
  }

  handleClick(item, index) {
    this.setState({ currentPosition: index }, () => {
      this.props.parentMethod(item)
    })
  }

  onMouseEnter(item) {
    this.setState({ currentHovered: item.label })
  }

  onMouseLeave(item) {
    this.setState({ currentHovered: null })
  }

  render() {
    let { tabIndex } = this.props
    let disabledStyle = { fontWeight: 'normal', color: '#666666' }
    return (
      <div>
        <div
          className="mt-8 clearfix horizontal-scroll capitalize"
          style={{ zIndex: 1000 }}>
          {this.props.tabsData.map((item, index) => {
            return (
              <span
                key={index}
                data-tip={item.arr.length === 0 ? 'Not Available' : item.label}>
                <button
                  tabIndex={tabIndex}
                  aria-label={`${item.label} video clips`}
                  className={classNames('tab-style onEnterFocusAda', {
                    'tab-active-style': this.state.currentPosition === index,
                  })}
                  style={item.arr.length === 0 ? disabledStyle : null}
                  disabled={item.arr.length === 0 ? true : false}
                  onClick={() => {
                    this.handleClick(item, index)
                  }}>
                  {item.label}{' '}
                  {this.props.showOptions ? (
                    <div
                      className={classNames('tab-capsule', {
                        'tab-capsule-active':
                          this.state.currentPosition === index,
                      })}>
                      {item.arr.length}{' '}
                      <span>
                        {_.has(this.props, 'unit')
                          ? this.props.unit === '%'
                            ? '%'
                            : item.arr.length !== 1
                            ? this.props.unit + 's'
                            : this.props.unit
                          : item.arr.length !== 1
                          ? 'clips'
                          : 'clip'}{' '}
                      </span>
                    </div>
                  ) : null}
                </button>
                <span className="capitalize">
                  <ReactTooltip place="bottom" type="dark" effect="solid" />
                </span>
              </span>
            )
          })}
        </div>
      </div>
    )
  }
}
