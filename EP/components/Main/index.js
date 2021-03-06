import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import $ from 'jquery'
import Navbar from '@vmockinc/dashboard/Navbar'
import { connect } from 'react-redux'
import {
  fetchImproveArticles,
  getUserInfo,
  intKeyIsValid,
} from './../../actions/apiActions'
import {
  log,
  onAndBlurFocus,
  removeOnAndBlurFocus,
  mutuals,
} from './../../actions/commonActions'
import { defaultUrls } from './../../services/services'
import CenterLoading from './../CenterLoading/index'
import Loadable from 'react-loadable'
import _ from 'underscore'
import Error404 from '@vmockinc/dashboard/Pages/components/Error404'
import Helmet from 'react-helmet'

const Calib = Loadable({
  loader: () => import('./../containers/Calibration'),
  loading: () => (
    <div className="fullscreen-loader">
      <CenterLoading />
    </div>
  ),
})

const Int = Loadable({
  loader: () => import('./../containers/Interview'),
  loading: () => (
    <div className="fullscreen-loader">
      <CenterLoading />
    </div>
  ),
})

const SummaryDetailedParent = Loadable({
  loader: () => import('./../containers/SummaryDetailedParent'),
  loading: () => (
    <div className="fullscreen-loader">
      <CenterLoading />
    </div>
  ),
})

var xhrPool = []

$.ajaxSetup({
  beforeSend: (xhr, options) => {
    xhrPool.push(xhr)
  },
  error: msg => {
    log('ajaxSetup error', '', '')
  },
})

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

class Main extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      clip_id: 0,
      calibration_msg: 'Click start to begin calibration process.',
      notFound: false,
      temp: false,
      mountRoutesComp: false,
    }

    this.pathArr = []
    this.calc404 = this.calc404.bind(this)
    this.whenIntKeyIsNotFound = this.whenIntKeyIsNotFound.bind(this)
    //  react router history to be used by the containers.
    window.reactRouterHistory = this.props.history
    this.validIntKeyUsed = this.validIntKeyUsed.bind(this)
    this.inValidIntKeyUsed = this.inValidIntKeyUsed.bind(this)
  }

  componentDidMount() {
    this.splitPath()
    onAndBlurFocus()
    getUserInfo()
    fetchImproveArticles()
    this.calc404()
    this.applyUsingMouseClassFunctionality()
  }

  splitPath() {
    this.pathArr = window.location.pathname.split('/')
    removeOnAndBlurFocus()
  }

  applyUsingMouseClassFunctionality() {
    document.body.classList.add('using-mouse')
    document.body.addEventListener('mousedown', function () {
      document.body.classList.add('using-mouse')
    })
    document.body.addEventListener('keydown', function () {
      document.body.classList.remove('using-mouse')
    })
  }

  alertOffline() {
    setInterval(() => {
      if (navigator.onLine) {
        //online
      } else {
        notify('You are offline! Do not proceed further.', 'error', {
          layout: 'center',
          timeout: false,
          callback: {
            onClose: () => {},
          },
        })
      }
    }, 3000)
  }

  allowedUrls(obj) {
    let { urlsObj, customizationsEP, intQuestionId } = obj
    let temp = []
    _.each(urlsObj, (val, key) => {
      if (key === 'appearance' && customizationsEP.appearance_enabled) {
        temp.push(val)
      }
      if (key !== 'appearance') {
        if (
          (key === 'word' || key === 'sentence') &&
          mutuals.isContentEnabled({
            customizations: customizationsEP,
            intQuestionId,
          })
        ) {
          temp.push(val)
        }

        if (key !== 'word' && key !== 'sentence') temp.push(val)
      }
    })

    log('rahu', urlsObj, temp)

    return temp
  }

  calc404() {
    let nonKeyUrls = ['calibration']

    if (nonKeyUrls.indexOf(this.pathArr[2]) !== -1) {
      this.setState({ notFound: false, mountRoutesComp: true })
      return
    }
    //when the interview key is in the url path
    intKeyIsValid(this.pathArr[2], this.validIntKeyUsed, this.inValidIntKeyUsed)
  }

  validIntKeyUsed(data) {
    let arr = []
    for (let i = 3; i < this.pathArr.length; i++) arr += '/' + this.pathArr[i]

    let urlsArr = this.allowedUrls({
      urlsObj: defaultUrls('', this.props.customizationsEP),
      customizationsEP: this.props.customizationsEP,
      intQuestionId: data.question_id,
    })

    if (urlsArr.indexOf(arr) === -1) {
      this.setState({ notFound: true })
    } else {
      this.setState({ notFound: false, mountRoutesComp: true })
    }
  }

  inValidIntKeyUsed() {
    this.setState({ notFound: true })
  }

  whenIntKeyIsNotFound() {
    this.setState({ notFound: true })
  }

  cancelAllAjax = callback => {
    $.each(xhrPool, function (idx, xhr) {
      xhr.abort()
    })
    callback()
  }

  setClipId = id => {
    this.setState({ clip_id: id })
  }

  updateCalibrationMsg = msg => {
    setTimeout(() => {
      this.setState({ calibration_msg: msg })
    }, 500)
  }

  render() {
    if (this.props.userInfoEP.questionData === null) {
      return <CenterLoading />
    }

    if (this.state.notFound) {
      return <Error404 />
    }

    if (this.state.notFound === false && this.state.mountRoutesComp) {
      return (
        <Router basename={process.env.APP_PRODUCT_BASE_URL}>
          <React.Fragment>
            <Helmet>
              <title>{mutuals.productName()}</title>
            </Helmet>
            <Route
              path="/"
              render={props => (
                <Navbar
                  id="nav"
                  navUrl="/dashboard/elevator-pitch"
                  productName={mutuals.productName()}
                />
              )}
            />
            <div className="ep-exclusive" style={{ marginTop: 40 }}>
              <PropsRoute
                exact
                path="/calibration"
                component={Calib}
                cancelAllAjax={this.cancelAllAjax}
                setClipId={this.setClipId}
                calibration_msg={this.state.calibration_msg}
                updateCalibrationMsg={this.updateCalibrationMsg}
              />

              <PropsRoute
                exact
                path="/:interviewKey/interview"
                component={Int}
                clipId={this.state.clip_id}
              />

              <PropsRoute
                path="/:interviewKey/results/"
                component={SummaryDetailedParent}
                whenIntKeyIsNotFound={this.whenIntKeyIsNotFound}
              />
            </div>
          </React.Fragment>
        </Router>
      )
    }

    return <CenterLoading />
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.user ? state.user.data : null,
    gentleResults: state.gentleResults,
    throughInt: state.throughInt,
    statuses: state.statuses,
    userInfoEP: state.userInfoEP,
    customizationsEP: state.epCustomizations,
    intQuestionId: state.interviewEP.intQuestionId,
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
