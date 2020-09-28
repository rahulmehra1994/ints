import React, { Component } from 'react'
import { mutuals, common, noDetection, log } from '../../actions/commonActions'
import { connect } from 'react-redux'
import _ from 'underscore'
import anime from 'animejs/lib/anime'
import { setInfoBarsAnimationState } from '../../actions/actions'

var classNames = require('classnames')

var getBgColor = [
  common.lighterColor[0],
  common.lighterColor[1],
  common.lighterColor[2],
]

class InfoBarComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      animatingMainValue: 0,
      barsAndLegends: this.initializeBarAndLegends(),
    }
  }

  initializeBarAndLegends() {
    let props = mutuals.deepCopy(this.props)
    let temp = props.barsAndLegends.map((item, index) => {
      item.value = 0
      return item
    })
    return temp
  }

  componentDidMount() {
    this.getWidthPercentOfValueEquivalent()
    if (this.letItAnimate()) {
      this.animation()
    } else {
      this.setState({
        animatingMainValue: this.props.mainValue,
        barsAndLegends: this.props.barsAndLegends,
      })
    }
  }

  letItAnimate() {
    if (_.has(this.props.animState, this.props.id)) {
      return false
    } else {
      let temp = Object.assign(
        {},
        { [this.props.id]: true },
        this.props.animState
      )

      setInfoBarsAnimationState(temp)
      return true
    }
  }

  animation() {
    let stateCopy = mutuals.deepCopy(this.state)

    anime({
      targets: stateCopy,
      animatingMainValue: this.props.mainValue,
      round: 1,
      easing: 'easeOutSine',
      duration: 1000,
      update: () => {
        this.setState({ animatingMainValue: stateCopy.animatingMainValue })
      },
    })

    stateCopy.barsAndLegends.forEach((item, index) => {
      anime({
        targets: item,
        value: this.props.barsAndLegends[index].value,
        round: 1,
        easing: 'easeOutSine',
        duration: 1000,
        update: () => {
          stateCopy.barsAndLegends[index] = item
          this.setState({ barsAndLegends: stateCopy.barsAndLegends })
        },
      })
    })
  }

  calcMaxVal() {
    if (this.props.threshold.data.length === 1) {
      if (
        this.props.mainValue < this.props.threshold.data[0].value &&
        this.props.unit !== '%'
      )
        return (
          this.props.threshold.data[0].value +
          this.props.threshold.data[0].value * 0.5
        )
      else if (this.props.unit === '%') {
        return 100
      } else {
        return this.props.mainValue + this.props.mainValue * 0.5
      }
    } else {
      if (
        this.props.mainValue < this.props.threshold.data[1].value &&
        this.props.unit !== '%'
      )
        return (
          this.props.threshold.data[1].value +
          this.props.threshold.data[1].value * 0.5
        )
      else if (this.props.unit === '%') {
        return 100
      } else {
        return this.props.mainValue + this.props.mainValue * 0.5
      }
    }
  }

  getWidthPercentOfValueEquivalent() {
    let max = this.calcMaxVal()
    let onePercentEquivalent = 100 / max
    this.setState({ multiplier: onePercentEquivalent })
  }

  getBarStyle = (item, index) => {
    let logic = this.state.multiplier * item.value

    let style = {
      height: 'inherit',
      width: `${logic}%`,
      background: item.color,
    }

    return this.borderRadiusLogic(index, style)
  }

  borderRadiusLogic(selectedIndex, style) {
    let bars = this.props.barsAndLegends

    if (bars[selectedIndex - 1] === undefined) {
      style = { ...style, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }
    }
    if (bars[selectedIndex + 1] === undefined) {
      style = {
        ...style,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
      }
    }

    if (
      bars[selectedIndex - 1] !== undefined &&
      bars[selectedIndex - 1].value === 0
    ) {
      style = { ...style, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }
    }

    if (
      bars[selectedIndex - 1] !== undefined &&
      bars[selectedIndex - 1].value !== 0
    ) {
      style = { ...style }
    }

    if (
      bars[selectedIndex + 1] !== undefined &&
      bars[selectedIndex + 1].value === 0
    ) {
      style = {
        ...style,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
      }
    }

    if (
      bars[selectedIndex + 1] !== undefined &&
      bars[selectedIndex + 1].value !== 0
    ) {
      style = { ...style }
    }

    return style
  }

  render() {
    let {
      id,
      label,
      mainValue,
      bgColor,
      threshold,
      unit,
      barsAndLegends,
    } = this.props

    let pos, percentage, shifter

    let barEnds = _.has(this.props, 'barEnds') ? true : null

    pos =
      this.state.multiplier * threshold.data[0]['value'] >= 50
        ? 'left'
        : 'right'

    if (threshold.data.length === 2) {
      if (pos === 'left') {
        percentage = this.state.multiplier * threshold.data[0]['value']
        shifter = -140
      } else {
        percentage = this.state.multiplier * threshold.data[1]['value']
        shifter = -10
      }
    } else {
      if (pos === 'left') {
        percentage = this.state.multiplier * threshold.data[0]['value']
        shifter = -140
      } else {
        percentage = this.state.multiplier * threshold.data[0]['value']
        shifter = -10
      }
    }

    return (
      <div
        ref={id}
        className="test5 mt-10"
        style={
          noDetection(this.props)
            ? { border: 'solid 1px #dddddd' }
            : { background: getBgColor[bgColor] }
        }>
        <div className="clearfix">
          <div className="subHead float-left">
            <span>{label}</span>{' '}
            {_.has(this.props, 'description') ? (
              <span className="hover-wrap ml-2">
                <span className="ep-icon-info-outline" />

                <div
                  className="hover-elm pin-l bg-white shadow-1 rounded-lg p-4 text-14-med"
                  style={{ width: 300 }}>
                  {this.props.description}
                </div>
              </span>
            ) : null}
          </div>

          {barsAndLegends.length > 1 ? (
            <div className="float-right">
              {barsAndLegends.map((item, index) => {
                return (
                  <div key={index} className="float-left ml-6">
                    <div
                      className="float-left"
                      style={{
                        height: 16,
                        width: 16,
                        background: item.color,
                        borderRadius: 3,
                      }}></div>
                    <span className="ml-6">
                      <span>{item.label}</span>{' '}
                      {unit === '%' ? (
                        <span className="paraHead">
                          {_.has(item, 'valueModifier')
                            ? item.valueModifier(item, mainValue)
                            : item.value}
                          %
                        </span>
                      ) : null}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
        <section className="mt-8">
          <div className="relative">
            <div
              className="mainHead"
              style={barEnds ? { transform: 'translateY(-8px)' } : null}>
              <span
                className="mainValueIdentify"
                style={{ fontSize: 54, fontWeight: 500 }}>
                {this.state.animatingMainValue}
                {_.has(this.props, 'mainValueSuffix')
                  ? this.props.mainValueSuffix
                  : null}
              </span>{' '}
              <span className="" style={{ fontSize: 30, fontWeight: 400 }}>
                {unit === 'time' ? (mainValue !== 1 ? 'Times' : 'Time') : unit}
              </span>
            </div>

            {threshold.data.length > 1 ? (
              <div
                className="absolute"
                style={{
                  left: `${
                    this.state.multiplier * threshold.data[0]['value']
                  }%`,
                  width: `${
                    this.state.multiplier * threshold.data[1]['value'] -
                    this.state.multiplier * threshold.data[0]['value']
                  }%`,
                  bottom: -56,
                  paddingTop: 13,
                  borderTop: '1px solid black',
                  whiteSpace: 'nowrap',
                }}></div>
            ) : null}

            <div
              className="absolute"
              style={{
                left: `calc(${percentage}% + ${shifter}px)`,
                bottom: barEnds ? -62 : -48,
                width: 150,
              }}>
              <div className="relative mt-4 text-center">
                <span className="para">{threshold.underLabel}</span>
              </div>
            </div>

            {threshold.data.map((obj, index) => {
              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    left: this.state.multiplier * obj.value + '%',
                    bottom: barEnds ? -72 : -58,
                    transform: 'translateX(-50%)',
                  }}>
                  <div className="">
                    <img
                      src={
                        process.env.APP_PRODUCT_BASE_URL +
                        '/dist/images/new/icons/arrow.svg'
                      }
                      alt="arrow"
                    />
                  </div>
                  <div className="text-center">
                    <span style={{ fontSize: 16, fontWeight: 600 }}>
                      {obj.value}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className={classNames('bar-bg relative', {
              'progressbar-bg-nodetection': noDetection(this.props),
              'progressbar-bg-detection': !noDetection(this.props),
              'mt-2': !barEnds,
              'mt-6': barEnds,
            })}>
            {this.state.barsAndLegends.map((obj, index) => {
              return (
                <div
                  id={`animatingBar-${index}`}
                  key={index}
                  className="float-left"
                  style={this.getBarStyle(obj, index)}></div>
              )
            })}

            {barEnds ? (
              <React.Fragment>
                <div className="absolute para" style={{ left: 0, top: -24 }}>
                  <span className="ep-icon-arrow-left" />
                  <span className="ml-3">{this.props.barEnds.left}</span>
                </div>

                <div className="absolute para" style={{ right: 0, top: -24 }}>
                  <span className="">{this.props.barEnds.right}</span>
                  <span className="ep-icon-arrow-right ml-3" />
                </div>
              </React.Fragment>
            ) : null}
          </div>
        </section>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    transcript: state.transcript,
    concatData: !_.isEmpty(state.concatenateResults)
      ? state.concatenateResults
      : null,
    animState: state.animations.infobar,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

const InfoBar = connect(mapStateToProps, mapDispatchToProps)(InfoBarComponent)

const InfoBarHOC = WrappedComponent => {
  return class HOC extends Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    render() {
      let modifiedProps = JSON.parse(JSON.stringify(this.props))
      let { mainValue, barsAndLegends } = modifiedProps
      let temp = barsAndLegends.map(item => {
        if (item.value > 0 && item.value < 1) {
          item.value = 1
        } else {
          item.value = parseInt(item.value, 10)
        }
        return item
      })
      modifiedProps.barsAndLegends = temp
      if (mainValue > 0 && mainValue < 1) {
        modifiedProps.mainValue = 1
      } else {
        modifiedProps.mainValue = parseInt(modifiedProps.mainValue, 10)
      }

      return <WrappedComponent {...modifiedProps} />
    }
  }
}

export default InfoBarHOC(InfoBar)
