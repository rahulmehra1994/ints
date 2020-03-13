import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Link, Route, Redirect } from 'react-router-dom'
var Loader = require('react-loaders').Loader

class NotFound extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <div className="notFoundBar clearfix">
          <img
            className="float-left mainLogo"
            alt="vmock logo"
            src={process.env.APP_BASE_URL + '/dist/images/vmockLogo.png'}
          />
          <div className="float-right h-full pt-1 pb-1">
            <a href="/dashboard">
              <button className="bg-red hover:bg-red-dark text-white py-4 px-10 rounded mr-6">
                Dashboard
              </button>
            </a>
            <a className="ml-4 text-white" href="/about">
              About Us
            </a>
            <span
              className="ml-4 text-white"
              style={{ verticalAlign: 'super' }}>
              .
            </span>
            <a
              className="ml-4 text-white"
              href="/https://blog.vmock.com/"
              target="_blank">
              Blog
            </a>
            <span
              className="ml-4 text-white"
              style={{ verticalAlign: 'super' }}>
              .
            </span>
            <a className="ml-4 text-white" href="/contact">
              Contact Us
            </a>
          </div>
        </div>
        <div className="notFoundInfo w-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1>Page Not Found</h1>
            <p className="mt-12 subHeadLight">
              The link you followed may be broken, or the page may have been
              removed.
            </p>
            <p className="mt-12">
              If you are trying to verify email or reset password, please
              request a new link from home page.
            </p>
            <a href="/dashboard/elevator-pitch">
              <button className="bg-red hover:bg-red-dark text-white py-5 px-16 rounded mt-12">
                Go to home page
              </button>
            </a>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let combinedRes = null

  if (!_.isEmpty(state.results)) {
    if (state.results.vocalResults) {
      combinedRes = state.results.vocalResults
    }
  }

  return {}
}

export default connect(
  mapStateToProps,
  {}
)(NotFound)
