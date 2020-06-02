import React, { Component } from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import _ from 'underscore'
import { mutuals } from '../../actions/commonActions'
import CustomPlayPause from '../utilities/CustomPlayPause'
import CustomMuteUnmute from '../utilities/CustomMuteUnmute'
import { Media, Player, controls } from 'react-media-player'
import ReactTooltip from 'react-tooltip'

const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)
const ReactHighcharts = require('react-highcharts')
var classNames = require('classnames')

class TimelineAudioChart extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      tabIndex: -1,
      audios: new Array(100).fill(false),
      audioLoaders: new Array(100).fill(true),
      position: 0,
    }
  }

  componentDidMount() {
    this.getOneSecondValInPixel()
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (JSON.stringify(newProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({ position: 0 })
    }
  }

  graph(arr) {
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
          formatter: function () {
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

      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function (e) {},
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
      legend: {
        enabled: false,
      },
    }

    return <ReactHighcharts config={config} />
  }

  graphMaker(props) {
    let arr = props.data.map((item, index) => {
      return {
        y: 0,
        x: (item.start_time + item.end_time) / 2,
      }
    })

    return this.graph(arr)
  }

  getOneSecondValInPixel() {
    let oneSecondValInPixel =
      (this.refs.timelineChart.clientWidth - 12) / this.props.intDuration
    this.setState({ multiplier: oneSecondValInPixel })
  }

  getLeftVal(item, index) {
    let res

    res = (item.start_time + item.end_time) / 2

    return res * this.state.multiplier
  }

  onAudioEvent(id, event) {
    let audios = document.getElementsByTagName('audio')

    for (let i = 0; i < audios.length; i++) {
      if (audios[i].id !== id) audios[i].pause()
    }

    trackingDebounceSmall({
      event_type: 'click',
      event_description: `EP pauses audio ${event}`,
    })
  }

  changeByOne(val) {
    if (
      (this.state.position === 0 && val === -1) ||
      (this.state.position === this.props.data.length - 1 && val === 1)
    ) {
      return
    }

    this.setState({ position: this.state.position + val }, () => {
      this.playOneAudio()
    })
  }

  changeByAnyVal(val) {
    this.setState({ position: val }, () => {
      this.playOneAudio()
    })
  }

  playOneAudio() {
    let audios = document.getElementsByTagName('audio')
    for (let i = 0; i < audios.length; i++) {
      if (audios[i].id !== 'audio' + this.state.position) audios[i].pause()
      else audios[i].play()
    }
  }

  leftSideDisablity() {
    if (this.state.position === 0) {
      return true
    } else {
      return false
    }
  }

  rightSideDisablity() {
    if (this.state.position === this.props.data.length - 1) {
      return true
    } else {
      return false
    }
  }

  render() {
    let disableStyle = { opacity: 0.3 }
    let nonDisableStyle = { opacity: 1 }
    let { audios, position } = this.state
    let { tabIndex, data } = this.props

    return (
      <div
        ref="timelineChart"
        className="timeline-chart relative"
        tabIndex={tabIndex}
        aria-label={``}>
        {this.graphMaker(this.props)}
        <div className="timeline-middle-line" />
        {data.map((item, index) => {
          return (
            <span
              key={index}
              className="absolute"
              style={{
                left: this.getLeftVal(item, index),
                top: 15,
              }}
              data-tip={`${new Date(item.start_time * 1000)
                .toISOString()
                .substr(14, 5)} - ${new Date(item.end_time * 1000)
                .toISOString()
                .substr(14, 5)}`}>
              {position === index ? (
                <div
                  className="play-pause-wrap"
                  tabIndex={tabIndex}
                  aria-label={`short pause audio ${index + 1}`}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      this.setState(state => {
                        const list = state.audios.map((item, count) => {
                          if (index === count) return !item
                          return item
                        })
                        return { audios: list }
                      })
                    }
                  }}>
                  <Media>
                    <div className="float-left clearfix">
                      <Player
                        id={`audio${index}`}
                        className="media-player"
                        src={item.url}
                        onPlay={() => {
                          this.onAudioEvent(
                            `audio${index}`,
                            `audio_played_${index + 1}`
                          )
                        }}
                        onPause={() => {
                          trackingDebounceSmall({
                            event_type: 'click',
                            event_description: `audio_paused_${index + 1}`,
                          })
                        }}
                        onCanPlayThrough={() => {
                          this.setState({
                            audioLoaders: this.state.audioLoaders.map(
                              (obj, count) => (count === index ? false : obj)
                            ),
                          })
                        }}
                        onPlaying={() => {
                          this.setState({
                            audioLoaders: this.state.audioLoaders.map(
                              (obj, count) => (count === index ? false : obj)
                            ),
                          })
                        }}
                        onWaiting={() => {
                          this.setState({
                            audioLoaders: this.state.audioLoaders.map(
                              (obj, count) => (count === index ? true : obj)
                            ),
                          })
                        }}
                      />

                      {this.state.audioLoaders[index] ? (
                        <div className="audio-loader-wrap">
                          <img
                            src={
                              process.env.APP_PRODUCT_BASE_URL +
                              '/dist/images/new/timeline/Loader.svg'
                            }
                            alt={'loader'}
                          />
                        </div>
                      ) : null}
                      <div className="media-controls">
                        <CustomPlayPause
                          tabIndex={tabIndex}
                          className="audio-button"
                          style={{
                            fontSize: 20,
                            padding: '5px 6px',
                            color: 'white',
                          }}
                          toggleAudio={audios[index]}
                        />
                      </div>
                    </div>
                  </Media>
                </div>
              ) : (
                <button
                  className="timeline-dot"
                  onClick={() => {
                    this.changeByAnyVal(index)
                  }}
                  tabIndex={tabIndex}
                  aria-label={`play ${index + 1} out of ${
                    data.length
                  } audio clip`}
                />
              )}
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </span>
          )
        })}

        <div className="timeline-controls">
          <span>
            <div className="float-left">
              {' '}
              <button
                className="paraHead bluePrimaryTxt"
                style={
                  this.leftSideDisablity() ? disableStyle : nonDisableStyle
                }
                disabled={this.leftSideDisablity()}
                onClick={() => {
                  this.changeByOne(-1)
                }}>
                <span className="">{'<'}</span>
                <span className="ml-6">Prev</span>
              </button>
            </div>

            <div className="float-left ml-6 grey-color">
              {this.state.position + 1}/{this.props.data.length}
            </div>

            <div className="float-left ml-6">
              <button
                className="paraHead bluePrimaryTxt"
                style={
                  this.rightSideDisablity() ? disableStyle : nonDisableStyle
                }
                disabled={this.rightSideDisablity()}
                onClick={() => {
                  this.changeByOne(1)
                }}>
                <span className="">Next</span>
                <span className="ml-6">{'>'}</span>
              </button>
            </div>
          </span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineAudioChart)
