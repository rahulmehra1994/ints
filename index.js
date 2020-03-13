import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Provider as UnstatedProvider } from 'unstated'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './EP/App'
import store from './store/configureStore'
import 'semantic-ui-css/semantic.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@vmockinc/dashboard/styles/dashboard.scss'
import './EP/styles/scss/index.scss'
import './EP/styles/scss/App.scss'
import './EP/images/new/icomoon/style.css'
import './EP/styles/scss/Calibration.scss'
import './EP/styles/scss/Interview.scss'
import './EP/styles/scss/Content.scss'
import './EP/styles/scss/Contentbar.scss'
import './EP/styles/scss/InformationComponent.scss'
import './EP/styles/scss/Leftbar.scss'
import './EP/styles/scss/Speech.scss'
import './EP/styles/scss/summary.scss'
import 'video-react/dist/video-react.css'

ReactDOM.render(
  <Provider store={store}>
    <UnstatedProvider>
      <Router basename={process.env.APP_BASE_URL}>
        <App />
      </Router>
    </UnstatedProvider>
  </Provider>,
  document.getElementById('root')
)
