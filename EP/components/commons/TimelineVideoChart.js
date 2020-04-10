import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals } from '../../actions/commonActions'
import ReactTooltip from 'react-tooltip'

var Loader = require('react-loaders').Loader
const ReactHighcharts = require('react-highcharts')
var classNames = require('classnames')

class TimelineChart extends Component {
  constructor(...args) {
    super(...args)
    this.state = { isPlaying: false }
    this.getOneSecondValInPixel = this.getOneSecondValInPixel.bind(this)
  }

  componentDidMount() {
    this.getOneSecondValInPixel()
    window.addEventListener('resize', this.getOneSecondValInPixel)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getOneSecondValInPixel)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.videoChunksState) !==
      JSON.stringify(this.props.videoChunksState)
    ) {
      if (nextProps.videoChunksState.paused === false) {
        this.setState({ isPlaying: true })
      } else {
        this.setState({ isPlaying: false })
      }
    }
  }

  graph(arr) {
    let that = this

    let config = {
      title: {
        text: '',
      },
      chart: {
        height: 90,
        type: 'line',
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        gridLineWidth: 1,
        max: this.props.intDuration,
        min: 0,
        allowDecimals: false,
        labels: {
          formatter: function() {
            return mutuals.xAxisGraphsTick(this.value)
          },
        },
      },
      yAxis: {
        title: {
          text: '',
        },
        categories: [''],
        reversed: false,
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function(e) {
                that.props.changeVideo(this.index)
              },
            },
          },
          marker: {
            lineWidth: 1,
          },
          enableMouseTracking: false,
        },
      },
      series: [
        {
          cursor: 'pointer',
          name: '',
          data: arr,
          marker: {
            enabled: false,
          },
        },
      ],
      tooltip: {
        // formatter: function() {
        //   return `<b>Play video at:</b><br/> ${this.x} seconds`
        // },
      },
    }

    return <ReactHighcharts config={config} ref="timelineChart" />
  }

  graphMaker(props) {
    let propsClone = mutuals.deepCopy(props)
    let arr = propsClone.data.map((item, index) => {
      return {
        y: 0,
        x: (item.start_time + item.end_time) / 2,
      }
    })

    return this.graph(arr)
  }

  getOneSecondValInPixel() {
    let oneSecondValInPixel =
      (this.refs.timelineChart.clientWidth - 20) / this.props.intDuration
    this.setState({ multiplier: oneSecondValInPixel })
  }

  getLeftVal(item) {
    let avg = (item.start_time + item.end_time) / 2
    let temp = avg * this.state.multiplier
    return temp
  }

  playSpecificVideo(index) {
    this.props.changeVideo(index)
    mutuals.socketTracking({
      event_type: 'click',
      event_description: `Video timeline non-current button positioned ${index +
        1} clicked`,
    })
  }

  currentButtonHandler(index) {
    mutuals.socketTracking({
      event_type: 'click',
      event_description: `Video timeline current button positioned ${index +
        1} ${this.state.isPlaying ? 'paused' : 'played'} ?`,
    })

    this.state.isPlaying ? this.props.pause() : this.props.changeVideo(index)
  }

  render() {
    let { tabIndex, data, currPosition } = this.props

    return (
      <div className="timeline-chart relative">
        {this.graphMaker(this.props)}

        <div ref="timelineChart">
          <div className="timeline-middle-line" />
          {data.map((item, index) => {
            return (
              <span
                key={index}
                className="absolute"
                style={{
                  left: this.getLeftVal(item),
                  top: 15,
                }}
                data-tip={`${new Date(item.start_time * 1000)
                  .toISOString()
                  .substr(14, 5)} - ${new Date(item.end_time * 1000)
                  .toISOString()
                  .substr(14, 5)}`}>
                {currPosition === index ? (
                  <div className="play-pause-wrap">
                    <button
                      tabIndex={tabIndex}
                      aria-label={`play ${index + 1} out of ${data.length} ${
                        this.props.currentKey
                      } video clip`}
                      onClick={() => {
                        this.currentButtonHandler(index)
                      }}>
                      {this.state.isPlaying ? (
                        <img
                          alt={'audio pause'}
                          src={
                            process.env.APP_BASE_URL +
                            '/dist/images/new/timeline/pause.svg'
                          }
                        />
                      ) : (
                        <img
                          src={
                            process.env.APP_BASE_URL +
                            '/dist/images/new/timeline/play.svg'
                          }
                          alt="play"
                        />
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    tabIndex={tabIndex}
                    aria-label={`play ${index + 1} out of ${data.length} ${
                      this.props.currentKey
                    } video clip`}
                    className="timeline-dot"
                    onClick={() => {
                      this.playSpecificVideo(index)
                    }}
                  />
                )}
                <ReactTooltip place="bottom" type="dark" effect="solid" />
              </span>
            )
          })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    videoChunksState: state.videoInfo.videoChunksState,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineChart)
