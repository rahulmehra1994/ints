import React, { Component } from 'react'
import { infoScreenAriaLabel } from '../Constants/AriaLabelText'

export default class InfoProfileStrength extends Component {
  render() {
    return (
      <div>
        <div className="container-fluid bg-white text-center light-gray-bg2 score-calculated">
          <div className="row">
            <div className="col-sm-12 margin-4p">
              <div className="close-icon">
                <a
                  aria-label={infoScreenAriaLabel['close']}
                  href="javascript:void(0);"
                  onClick={() => this.props.hideModal()}>
                  {' '}
                  X
                </a>
              </div>
              <h2 className="margin-bottom-40">
                {' '}
                How is your score calculated?
              </h2>
              <div id="progressBar" className="margin-auto">
                <div className="position yellow-zone" />
              </div>
              <br />
              <p className="text-normal margin-bottom-30">
                Base score is based on 3 key aspects of your Linkedin profile{' '}
              </p>
              <div className="hr-doted-line"> </div>
              <div className="row">
                <div className="col-sm-4">
                  <div className="vr-doted-line" />
                  <div className="bg-white border-gray2 height40">
                    <div className="border-bottom-gray pad-mar-16">
                      <h3 className="padding-top-20">Content</h3>
                      <p>
                        Lorem ipsum integer efficitur euismod auctor. Sed
                        consequat blandit ligula a vehicula.{' '}
                      </p>
                      <img
                        src={`${process.env.APP_BASE_URL}dist/images/score-graph01.png`}
                      />
                    </div>
                    <ul>
                      <li className="dart-icon"> Completeness </li>
                      <li className="dart-icon"> Important Categories </li>
                      <li className="dart-icon"> Impact </li>
                    </ul>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="vr-doted-line" />
                  <div className="bg-white border-gray2 height40">
                    <div className="border-bottom-gray pad-mar-16">
                      <h3 className="padding-top-20"> Skill </h3>
                      <p>
                        Integer efficitur euismod auctor. Sed consequat blandit
                        ligula a vehicula.{' '}
                      </p>
                      <img
                        src={`${process.env.APP_BASE_URL}dist/images/score-graph02.png`}
                      />
                    </div>
                    <ul>
                      <li className="dart-icon"> Soft Skill </li>
                      <li className="dart-icon"> Hard skill Included </li>
                    </ul>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="vr-doted-line2" />
                  <div className="bg-white  border-gray2 height40">
                    <div className="border-bottom-gray pad-mar-16">
                      <h3 className="padding-top-20"> Profile Visibility </h3>
                      <p>
                        {' '}
                        Cras a elit sit amet odio hendrerit euismod. Donec
                        lacinia convallis tincidunt.{' '}
                      </p>
                      <img
                        src={`${process.env.APP_BASE_URL}dist/images/score-graph02.png`}
                      />
                    </div>
                    <ul>
                      <li className="dart-icon"> Number of Connections </li>
                      <li className="dart-icon"> Important categories</li>
                      <li className="dart-icon"> Impact </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
