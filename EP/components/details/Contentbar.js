import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import InformationComponent from './InformationComponent'
import Improvement from './../improvements/improvementComp'
import _ from 'underscore'
import { connect } from 'react-redux'
import VideoModal from './../illustration/VideoModal'
import { mutuals, log, common } from './../../actions/commonActions'

const play = process.env.APP_BASE_URL + '/dist/images/new/timeline/play.svg'
const illustrationSection =
  process.env.APP_BASE_URL + '/dist/images/new/illustration-section.svg'

var Loader = require('react-loaders').Loader
const trackingDebounceSmall = _.debounce(
  mutuals.socketTracking,
  mutuals.debounceTime.small,
  true
)

var classNames = require('classnames')
const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return React.createElement(component, finalProps)
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest)
      }}
    />
  )
}

class Contentbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videoModalStatus: false,
      videoSrc: null,
      videoSubtitlesSrc: null,
    }
    this.toggleVideoModal = this.toggleVideoModal.bind(this)
    this.videoModalOpen = this.videoModalOpen.bind(this)
    this.videoModalClose = this.videoModalClose.bind(this)
  }

  trackOnScroll() {
    trackingDebounceSmall({
      event_type: 'scroll',
      event_description: 'Insights section scrolled',
    })
  }

  toggleVideoModal(videoSrc = null) {
    this.setState({
      videoModalStatus: !this.state.videoModalStatus,
      videoSrc: videoSrc,
    })
  }

  videoModalOpen(videoSrc, videoSubtitlesSrc) {
    this.setState({
      videoModalStatus: true,
      videoSrc,
      videoSubtitlesSrc,
    })
  }

  videoModalClose() {
    this.setState({
      videoModalStatus: false,
    })

    trackingDebounceSmall({
      event_type: 'click',
      event_description: 'Illustration video modal close',
    })
  }

  videoSummaryInPath() {
    return (
      window.location.pathname.search('videosummary') !== -1 ||
      window.location.pathname.search('no-content') !== -1
    )
  }

  render() {
    let { appUrls, illustrationData } = this.props
    let { videoSrc, videoSubtitlesSrc } = this.state

    let contentWidth = this.videoSummaryInPath() ? { maxWidth: 770 } : null
    return (
      <div className="resultsContentSection">
        <div
          className="contentbar"
          style={contentWidth}
          aria-label="contentinfo">
          <InformationComponent
            location={this.props.location}
            appUrls={appUrls}
          />
        </div>

        <div
          className={classNames('improveSection', {
            hidden: this.videoSummaryInPath(),
          })}
          role="complementary"
          aria-label="Improvement Section">
          <Improvement location={this.props.location} appUrls={appUrls} />

          <div className="clearfix">
            <PropsRoute
              exact
              path={appUrls.eyeGaze}
              component={eyeGaze}
              videoModalOpen={this.videoModalOpen}
              videoModalClose={this.videoModalClose}
              data={illustrationData['eye-gaze']}
            />

            <PropsRoute
              exact
              path={appUrls.smile}
              component={smile}
              videoModalOpen={this.videoModalOpen}
              videoModalClose={this.videoModalClose}
              data={illustrationData['smile']}
            />
            <PropsRoute
              exact
              path={appUrls.gesture}
              component={gesture}
              videoModalOpen={this.videoModalOpen}
              videoModalClose={this.videoModalClose}
              data={illustrationData['gesture']}
            />
            <PropsRoute
              exact
              path={appUrls.body}
              component={body}
              videoModalOpen={this.videoModalOpen}
              videoModalClose={this.videoModalClose}
              data={illustrationData['body-posture']}
            />
            <PropsRoute
              exact
              path={appUrls.appearance}
              component={appearance}
              videoModalOpen={this.videoModalOpen}
              videoModalClose={this.videoModalClose}
              data={illustrationData['appearance']}
            />

            <PropsRoute
              exact
              path={appUrls.word}
              component={word}
              videoModalOpen={this.videoModalOpen}
              videoModalClose={this.videoModalClose}
              data={illustrationData['word-usage']}
            />
            <PropsRoute
              exact
              path={appUrls.sentence}
              component={sentence}
              videoModalOpen={this.videoModalOpen}
              videoModalClose={this.videoModalClose}
              data={illustrationData['sentence-analysis']}
            />

            <PropsRoute
              exact
              path={appUrls.vocal}
              component={vocal}
              videoModalOpen={this.videoModalOpen}
              videoModalClose={this.videoModalClose}
              data={illustrationData['vocal-features']}
            />

            <PropsRoute
              exact
              path={appUrls.pauses}
              component={pauses}
              videoModalOpen={this.videoModalOpen}
              videoModalClose={this.videoModalClose}
              data={illustrationData['appropriate-pauses']}
            />
            <PropsRoute
              exact
              path={appUrls.disfluencies}
              component={disfluencies}
              videoModalOpen={this.videoModalOpen}
              videoModalClose={this.videoModalClose}
              data={illustrationData['disfluencies']}
            />
            <PropsRoute
              exact
              path={appUrls.modulation}
              component={modulation}
              videoModalOpen={this.videoModalOpen}
              videoModalClose={this.videoModalClose}
              data={illustrationData['speech-modulation']}
            />

            {this.state.videoModalStatus ? (
              <VideoModal
                videoModalClose={this.videoModalClose}
                videoSrc={videoSrc}
                videoSubtitlesSrc={videoSubtitlesSrc}
                tabIndex={25}
              />
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    appIntKey: state.appIntKey.key,
    appUrls: state.appUrls,
    illustrationData: state.illustrationData,
  }
}

export default connect(
  mapStateToProps,
  {}
)(Contentbar)

class eyeGaze extends Component {
  render() {
    return (
      <Common
        arr={this.props.data}
        videoModalOpen={this.props.videoModalOpen}
        videoModalClose={this.props.videoModalClose}
        mainTabIndex={common.tabIndexes.illustration}
      />
    )
  }
}

class smile extends Component {
  render() {
    return (
      <Common
        arr={this.props.data}
        videoModalOpen={this.props.videoModalOpen}
        videoModalClose={this.props.videoModalClose}
        mainTabIndex={common.tabIndexes.illustration + 10}
      />
    )
  }
}

class gesture extends Component {
  render() {
    return (
      <Common
        arr={this.props.data}
        videoModalOpen={this.props.videoModalOpen}
        videoModalClose={this.props.videoModalClose}
        mainTabIndex={common.tabIndexes.illustration + 20}
      />
    )
  }
}

class body extends Component {
  render() {
    return (
      <Common
        arr={this.props.data}
        videoModalOpen={this.props.videoModalOpen}
        videoModalClose={this.props.videoModalClose}
        mainTabIndex={common.tabIndexes.illustration + 30}
      />
    )
  }
}

class appearance extends Component {
  render() {
    return (
      <Common
        arr={this.props.data}
        videoModalOpen={this.props.videoModalOpen}
        videoModalClose={this.props.videoModalClose}
        mainTabIndex={common.tabIndexes.illustration + 40}
      />
    )
  }
}

class word extends Component {
  render() {
    return (
      <Common
        arr={this.props.data}
        videoModalOpen={this.props.videoModalOpen}
        videoModalClose={this.props.videoModalClose}
        mainTabIndex={common.tabIndexes.illustration + 50}
      />
    )
  }
}

class sentence extends Component {
  render() {
    return (
      <Common
        arr={this.props.data}
        videoModalOpen={this.props.videoModalOpen}
        videoModalClose={this.props.videoModalClose}
        mainTabIndex={common.tabIndexes.illustration + 60}
      />
    )
  }
}

class vocal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIndex: -1,
    }
  }
  render() {
    return (
      <Common
        arr={this.props.data}
        videoModalOpen={this.props.videoModalOpen}
        videoModalClose={this.props.videoModalClose}
        mainTabIndex={common.tabIndexes.illustration + 70}
      />
    )
  }
}

class pauses extends Component {
  render() {
    return (
      <Common
        arr={this.props.data}
        videoModalOpen={this.props.videoModalOpen}
        videoModalClose={this.props.videoModalClose}
        mainTabIndex={common.tabIndexes.illustration + 80}
      />
    )
  }
}

class disfluencies extends Component {
  render() {
    return (
      <Common
        arr={this.props.data}
        videoModalOpen={this.props.videoModalOpen}
        videoModalClose={this.props.videoModalClose}
        mainTabIndex={common.tabIndexes.illustration + 90}
      />
    )
  }
}

class modulation extends Component {
  render() {
    return (
      <Common
        arr={this.props.data}
        videoModalOpen={this.props.videoModalOpen}
        videoModalClose={this.props.videoModalClose}
        mainTabIndex={common.tabIndexes.illustration + 100}
      />
    )
  }
}

class Common extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIndex: -1,
    }
  }

  videoOpener(item) {
    this.props.videoModalOpen(item.video_url, item.subtitles_url)

    trackingDebounceSmall({
      event_type: 'click',
      event_description: `opened ${item.video_name}`,
    })
  }

  render() {
    let { mainTabIndex, arr } = this.props
    return (
      <div className="cardStyle mt-2">
        {arr.length > 0 ? (
          <React.Fragment>
            <div className="subHead pl-6 pr-6 pt-6">
              <img src={illustrationSection} alt="resources" />
              <span className="ml-4">Resources</span>
            </div>
            <div className="hr mt-3 mb-6" />

            <div
              className="mt-4 clearfix overflow-auto"
              style={{ height: 300 }}
              tabIndex={mainTabIndex}
              aria-label="Resources. This section provides access to video content. Select to continue further."
              onKeyPress={e => {
                if (e.key === 'Enter' && this.state.tabIndex === -1) {
                  this.setState({
                    tabIndex: mainTabIndex,
                  })
                  document.getElementById('firstFocusIllus').focus()
                }
              }}>
              {arr.map((item, index) => {
                let dateArr = item.duration.split(':')
                return (
                  <div
                    id={index === 0 ? 'firstFocusIllus' : ''}
                    className="cursor-pointer clearfix pl-6 pr-6 mb-4"
                    onClick={() => this.videoOpener(item)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') this.videoOpener(item)
                    }}
                    tabIndex={this.state.tabIndex}
                    aria-label={`This is a pop-up. ${item.video_name}. Click to open the video.`}
                    key={index}>
                    <div
                      className="relative float-left"
                      style={{ width: 80, height: 60 }}>
                      {item.is_exclusive === 1 ? (
                        <div className="exclusive-illus-video">EXCLUSIVE</div>
                      ) : null}
                      <img
                        className="videoThumb"
                        src={item.thumbnail_url}
                        alt={`${item.video_name}`}
                      />

                      <img
                        className="play-illustration-style"
                        src={play}
                        alt="play"
                      />
                    </div>
                    <div
                      className="pl-4 whitespace-normal float-left"
                      style={{ width: 'calc(100% - 80px)' }}>
                      <div className="para elipsis">{item.video_name}</div>

                      <div className="font-size-s" style={{ color: '#616161' }}>
                        {`${dateArr[1]}:${dateArr[2]}`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </React.Fragment>
        ) : (
          <div className="clearfix loaderWrap">
            <Loader
              type={common.compLoader.type}
              active
              style={{ transform: common.compLoader.scale, fill: 'black' }}
            />
          </div>
        )}
      </div>
    )
  }
}
