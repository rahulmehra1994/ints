import React, { Component } from 'react'

export default class TargetFunction extends Component {
  render() {
    return (
      <div>
        <div className="container-fluid top-margin">
          <div className="row flexdiv">
            <div className="col-sm-2">
              <div className="home-left bg-white outer-border">
                <div className="sidebar-user">
                  <div className="avatar avatar-initials">
                    <img
                      src={`${process.env.APP_BASE_URL}dist/images/user-img.png`}
                      width="50"
                    />{' '}
                  </div>
                  <div className="sidebar-user-name">
                    {' '}
                    Oren Margolis <br />
                    <span className="user-info"> MBA Benchmark </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-8 padding-r-l ">
              <div className="row">
                <div className="col-sm-12">
                  <div className="aspire-module outer-border">
                    <div className="card-title">
                      {' '}
                      <span className="text-icon"> in </span> Aspire Module{' '}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="home-middle bg-blue">
                    <div className="row">
                      <div className="col-sm-3">
                        {' '}
                        <img
                          src={`${process.env.APP_BASE_URL}dist/images/aspire-header-img.png`}
                          width="220"
                        />{' '}
                      </div>
                      <div className="col-sm-8 col-sm-offset-1">
                        <h3>
                          Unleash the power fo your <br />
                          linkedin profile
                        </h3>
                        <p>
                          {' '}
                          Suspendisse nunc odio, euismod in erat et, maximus
                          aliquam ipsum suspendisse potenti nullam pulvinar quam
                          ac sapien malesuada, ut hendrerit justo auctor erat
                          et, maximus aliquam ipsum suspendisse potenti. Nullam
                          pulvinar quam ac sapien malesuada.{' '}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="get-started bg-white">
                    <h2> Get started</h2>
                    <div className="row border-radius-3 gray-bg width-40-p center-block">
                      <div className="col-sm-3">
                        {' '}
                        <img
                          src={`${process.env.APP_BASE_URL}dist/images/user-img.png`}
                          width="70"
                        />
                      </div>
                      <div className="col-sm-9 pull-left">
                        <p className="user-name"> Oren Margolis</p>
                        <p>
                          {' '}
                          www.linkedin.com/Orenmargolis/ <br />
                          You signed up with this profile{' '}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-12 margin-top-10">
                      <a className="btn btn-primary" href="javascript:void(0);">
                        Select target function
                      </a>
                    </div>
                    <div className="clearfix" />
                    <br />
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-2">
              <div className="home-right bg-white outer-border">
                {' '}
                Section 3 <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
