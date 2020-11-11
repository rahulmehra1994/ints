import React, { Component } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { getIntResults } from './../../actions/interviewActions'
import Results from './Results'
import Summary from './../summary/summary'
import { setAppUrls } from './../../actions/actions'
import { appIntKey } from './../../actions/resultsActions'
import {
  fetchInterviews,
  newGentle,
  reCallImgVideo,
  fetchTranscript,
  fetchIllustrationData,
  fetchUserSpeechSubtitles,
  fetchImproveArticles,
  intKeyIsValid,
} from './../../actions/apiActions'
import { mutuals } from './../../actions/commonActions'
import SubNavbar from './../../components/navbar/SubNavbar'

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

class SummaryDetailedParent extends Component {
  constructor(props) {
    super(props)
    this.state = { unExpire: null }
    this.setAppIntKey()
  }

  componentDidMount() {
    if (this.props.statuses.categories === 'success') fetchTranscript(null)
    fetchInterviews()
    getIntResults()
    this.state.unExpire = this.reviveImgsAndVideos()
    fetchIllustrationData()
    mutuals.changeInactivityTime(mutuals.defaultInactivityTime)
    mutuals.setupTimers()
    this.setAppIntKey()
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    let statuses = newProps.statuses
    if (
      JSON.stringify(newProps.statuses) !== JSON.stringify(this.props.statuses)
    ) {
      if (
        statuses.categories === 'not_started' &&
        statuses.concatenate === 'not_started' &&
        statuses.convert_video === 'not_started' &&
        statuses.gentle === 'not_started' &&
        statuses.post_gentle_praat === 'not_started' &&
        statuses.praat === 'not_started' &&
        statuses.punctuator === 'not_started'
      ) {
        this.props.whenIntKeyIsNotFound()
      }
    }

    this.okToFetchTranscript(newProps)
  }

  okToFetchTranscript(newProps) {
    let newStatuses = newProps.statuses
    if (newStatuses.categories !== this.props.statuses.categories) {
      if (newStatuses.categories === 'success') fetchTranscript(null)
    }
  }

  setAppIntKey() {
    let intKey = this.props.match.params.interviewKey
    this.props.setAppIntKey(intKey)
    setAppUrls('/' + intKey)
    // please make it so that it doesnot run 2 times
    intKeyIsValid(intKey)
  }

  componentWillUnmount() {
    clearInterval(this.state.unExpire)
    mutuals.removeTimers()
  }

  reviveImgsAndVideos() {
    return setInterval(() => {
      fetchTranscript(null)
      reCallImgVideo()
      newGentle()
      fetchIllustrationData()
      fetchUserSpeechSubtitles()
      fetchImproveArticles()
    }, 9 * (1000 * 60))
  }

  render() {
    if (_.isNull(this.props.intData)) return null

    return (
      <div>
        {this.props.appUrls ? (
          <Route
            path={this.props.appUrls.results}
            render={routeProps => {
              return (
                <SubNavbar
                  tabIndex={12}
                  appUrls={this.props.appUrls}
                  {...routeProps}
                />
              )
            }}
          />
        ) : null}

        <PropsRoute
          exact
          path="/:interviewKey/results/summary"
          component={Summary}
        />

        <PropsRoute
          path="/:interviewKey/results/detailed"
          component={Results}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    statuses: state.statuses,
    appUrls: state.appUrls,
    intData: state.interviewEP.basicData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAppIntKey: key => {
      dispatch(appIntKey(key))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryDetailedParent)
