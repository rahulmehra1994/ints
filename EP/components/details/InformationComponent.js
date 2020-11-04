import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import SpeechDisfluencies from './../SpeechComponents/SpeechDisfluencies'
import SpeechModulation from './../SpeechComponents/SpeechModulation'
import AppropriatePauses from './../SpeechComponents/appropriatePauses'
import VocalFeatures from './../SpeechComponents/vocalFeatures'
import EyeGaze from './../EyeComponents/eyeGaze'
import FacialExpressionSmile from './../FacialComponents/FacialExpressionSmile'
import GestureCombined from './../GestureComponents/GestureCombined'
import BodyCombined from './../BodyComponents/bodyCombined'
import AppearanceCombined from './../AppearanceComponents/appearanceCombined'
import WordUsage from '../ContentComponents/WordUsage'
import Sentence from '../ContentComponents/Sentence'
import Competency from '../ContentComponents/Competency'
import VideoSummary from './../details/VideoSummary'
import InsightsAllSection from '../insights/InsightsAllSection'
import NoContent from './../ContentComponents/NoContent'

const PropsRoute = ({ RouteComponent, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return <RouteComponent {...routeProps} {...rest} />
      }}
    />
  )
}

class InformationComponent extends Component {
  render() {
    let { appUrls, location } = this.props

    return (
      <div className="cardStyle" style={{ minHeight: '100%' }}>
        <PropsRoute exact path={appUrls.eyeGaze} RouteComponent={EyeGaze} />

        <Route
          exact
          path={appUrls.eyeContact}
          render={props => {
            return <Redirect to={appUrls.eyeGaze} />
          }}
        />

        <PropsRoute
          exact
          path={appUrls.smile}
          RouteComponent={FacialExpressionSmile}
        />

        <PropsRoute
          exact
          path={appUrls.gesture}
          RouteComponent={GestureCombined}
        />

        <PropsRoute exact path={appUrls.body} RouteComponent={BodyCombined} />

        <PropsRoute
          exact
          path={appUrls.appearance}
          RouteComponent={AppearanceCombined}
        />

        <PropsRoute exact path={appUrls.word} RouteComponent={WordUsage} />

        <PropsRoute exact path={appUrls.sentence} RouteComponent={Sentence} />

        <PropsRoute
          exact
          path={appUrls.competency}
          RouteComponent={Competency}
        />

        <PropsRoute exact path={appUrls.vocal} RouteComponent={VocalFeatures} />

        <PropsRoute
          exact
          path={appUrls.pauses}
          RouteComponent={AppropriatePauses}
        />

        <PropsRoute
          exact
          path={appUrls.disfluencies}
          RouteComponent={SpeechDisfluencies}
        />

        <PropsRoute
          exact
          path={appUrls.modulation}
          RouteComponent={SpeechModulation}
        />

        <PropsRoute
          exact
          path={appUrls.videosummary}
          RouteComponent={VideoSummary}
        />

        <PropsRoute exact path={appUrls.noContent} RouteComponent={NoContent} />

        {appUrls.videosummary !== location.pathname &&
        appUrls.noContent !== location.pathname ? (
          <InsightsAllSection location={location} appUrls={appUrls} />
        ) : null}
      </div>
    )
  }
}

export default InformationComponent
