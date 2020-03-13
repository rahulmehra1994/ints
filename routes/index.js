import React from 'react'
import { Route, Switch } from 'react-router-dom'
import App from '../containers/App'
import AspireFeedback from '../containers/AspireFeedback'
import Summary from '../containers/Summary'
import DetailedFeedback from '../containers/DetailedFeedback'
import UploadPdfInternal from '../components/LoginScreens/UploadPdfInternal'
import TargetFunction from '../components/LoginScreens/TargetFunction'
import SelectFunction from '../components/LoginScreens/SelectFunction'

var devRoutes = null
if (
  process.env.APP_ENV === 'dev' ||
  process.env.APP_ENV === 'test' ||
  process.env.APP_ENV === 'staging'
) {
  devRoutes = (
    <React.Fragment>
      <Route path="/aspire/data/upload-pdf" component={UploadPdfInternal} />
      <Route path="/aspire/data/target-function" component={TargetFunction} />
      <Route path="/aspire/data/select-function" component={SelectFunction} />
    </React.Fragment>
  )
}

const MainRoutes = ({ ...props }) => {
  return (
    <App {...props}>
      <Switch>
        <Route
          path="/aspire/:fetchId/feedback/:page?"
          component={AspireFeedbackContainer}
        />
        {devRoutes}
        <Route
          path="*"
          component={() => {
            window.location.replace('/error/404')
          }}
        />
      </Switch>
    </App>
  )
}

export default MainRoutes

const AspireFeedbackContainer = props => {
  return (
    <AspireFeedback {...props}>
      <Route path="/aspire/:fetchId/feedback/summary" component={Summary} />
      <Route
        path="/aspire/:fetchId/feedback/detailed"
        component={DetailedFeedback}
      />
    </AspireFeedback>
  )
}
