import React, { Component } from 'react'
import { infoScreenAriaLabel } from '../Constants/AriaLabelText'

export default class InfoProfilePicture extends Component {
  render() {
    return (
      <div>
        <div className="container-fluid bg-white categories-info padding-6p">
          <div className="row">
            <div className="col-sm-12">
              <div className="close-icon">
                <a
                  href="javascript:void(0);"
                  aria-label="Click to close the info screen"
                  onClick={() => this.props.hideModal()}>
                  {' '}
                  X
                </a>
              </div>
              <h2> Profile Picture evaluation</h2>
              <div className="info-categories-icon">
                <img
                  alt=""
                  src={`${process.env.APP_BASE_URL}dist/images/info-profile-picture-evaluation-icon.jpg`}
                  width="60"
                />
              </div>
              <div className="info-right-data">
                <h3
                  tabIndex={0}
                  aria-label={infoScreenAriaLabel['profile_picture']['what']}>
                  What factors to consider for perfect profile picture?{' '}
                </h3>
                <p
                  tabIndex={0}
                  aria-label={infoScreenAriaLabel['profile_picture']['text']}>
                  According to LinkedIn research, having a picture, by itself,
                  makes your profile 14 times more likely to be viewed. It is
                  your chance to have a good first impression on the Recruiter.
                  Make sure that your picture is professional and has all the
                  characteristics of a good image listed below.
                </p>
              </div>
              <div className="row margin-4p border-top-gray">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="row profile-picture-evaluation">
                      <div className="col-sm-4">
                        <h5
                          tabIndex={0}
                          aria-label={
                            infoScreenAriaLabel['profile_picture']['sample'][
                              'face_frame'
                            ]
                          }>
                          FACE/FRAME RATIO
                        </h5>
                        <p>
                          A good image has a face/frame ratio of around 50%.
                        </p>
                      </div>
                      <div className="col-sm-4">
                        <h5
                          tabIndex={0}
                          aria-label={
                            infoScreenAriaLabel['profile_picture']['sample'][
                              'face_body'
                            ]
                          }>
                          FACE/BODY RATIO
                        </h5>
                        <p>
                          In a good LinkedIn profile picture, your face covers a
                          larger area as compared to your body.
                        </p>
                      </div>
                      <div className="col-sm-4 img-margin img-width">
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-01.png`}
                        />
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-02.png`}
                        />
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-03.png`}
                        />
                      </div>
                    </div>
                    <div className="border-bottom-gray" />
                    <div className="row profile-picture-evaluation">
                      <div className="col-sm-4">
                        <h5
                          tabIndex={0}
                          aria-label={
                            infoScreenAriaLabel['profile_picture']['sample'][
                              'background'
                            ]
                          }>
                          BACKGROUND ILLUMINATION{' '}
                        </h5>
                        <p>
                          A good image has a light colored background that helps
                          to portray your picture clearly.
                        </p>
                      </div>
                      <div className="col-sm-4">
                        <h5
                          tabIndex={0}
                          aria-label={
                            infoScreenAriaLabel['profile_picture']['sample'][
                              'foreground'
                            ]
                          }>
                          FOREGROUND ILLUMINATION{' '}
                        </h5>
                        <p>
                          Ensure that shadows and other reflections do not
                          interfere with the clarity and prominence of your
                          face.
                        </p>
                      </div>
                      <div className="col-sm-4 img-margin img-width">
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-04.png`}
                        />
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-05.png`}
                        />
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-06.png`}
                        />
                      </div>
                    </div>
                    <div className="border-bottom-gray" />
                    <div className="row profile-picture-evaluation">
                      <div className="col-sm-4">
                        <h5
                          tabIndex={0}
                          aria-label={
                            infoScreenAriaLabel['profile_picture']['sample'][
                              'eye'
                            ]
                          }>
                          EYE CONTACT
                        </h5>
                        <p>
                          One should make an eye contact with the camera. This
                          portrays confidence in the person.
                        </p>
                      </div>
                      <div className="col-sm-4">&nbsp;</div>
                      <div className="col-sm-4 img-margin img-width">
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-07.png`}
                        />
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-08.png`}
                        />
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-09.png`}
                        />
                      </div>
                    </div>
                    <div className="border-bottom-gray" />
                    <div className="row profile-picture-evaluation">
                      <div className="col-sm-4">
                        <h5
                          tabIndex={0}
                          aria-label={
                            infoScreenAriaLabel['profile_picture']['sample'][
                              'smile'
                            ]
                          }>
                          SMILE DETECTION
                        </h5>
                        <p>
                          An open smile increases likeability and is a feature
                          in almost all good LinkedIn profile pictures.
                        </p>
                      </div>
                      <div className="col-sm-4">&nbsp;</div>
                      <div className="col-sm-4 img-margin img-width">
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-10.png`}
                        />
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-11.png`}
                        />
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-12.png`}
                        />
                      </div>
                    </div>
                    <div className="border-bottom-gray" />
                    <div className="row profile-picture-evaluation">
                      <div className="col-sm-4">
                        <h5
                          tabIndex={0}
                          aria-label={
                            infoScreenAriaLabel['profile_picture']['sample'][
                              'size'
                            ]
                          }>
                          PHOTO SIZE
                        </h5>
                        <p>
                          Photo size should be between 400 x 400 and 20K x 20K
                          pixels for optimum picture clarity.
                        </p>
                      </div>
                      <div className="col-sm-4">&nbsp;</div>
                      <div className="col-sm-4 img-height">
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-13.png`}
                        />
                        <img
                          alt=""
                          src={`${process.env.APP_BASE_URL}dist/images/group-14.png`}
                        />
                      </div>
                    </div>
                    <div className="border-bottom-gray" />
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
