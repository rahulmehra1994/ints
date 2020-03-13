import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './EP/App'
import store from './store/configureStore'
import 'semantic-ui-css/semantic.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@vmockinc/dashboard/styles/dashboard.scss'
import './EP/styles/scss/App.scss'
import './EP/images/new/icomoon/style.css'
import 'video-react/dist/video-react.css'

ReactDOM.render(
  <Provider store={store}>
    <Router basename={process.env.APP_BASE_URL}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
)
