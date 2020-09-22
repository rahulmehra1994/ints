import React, { useState, useEffect } from 'react'
import _ from 'underscore'
import { Player, BigPlayButton } from 'video-react'
import {
  checkShareTokenAPI,
  fetchRequirements,
} from './../../actions/apiActions'
import ReCAPTCHA from 'react-google-recaptcha'

const vmockLogo = process.env.APP_PRODUCT_BASE_URL + '/dist/images/logo.png'
export default function Share(props) {
  let [res, setRes] = useState({})
  let [captchaSolved, setCaptchaStatus] = useState(true)
  const setResCallback = data => {
    console.log('data', data)
    setRes(data)
  }

  useEffect(() => {
    if (captchaSolved) {
      let arr = props.location.pathname.split('/')
      checkShareTokenAPI(arr[2], setResCallback)
    }
  }, [captchaSolved])

  let onChange = value => {
    console.log('Captcha value:', value)
    setCaptchaStatus(true)
  }

  // if (!captchaSolved) {
  //   return (
  //     <ReCAPTCHA
  //       sitekey="6Lfi5swZAAAAAMQ0P6rVxJvw-Yy0eWBb7A9334aj"
  //       onChange={onChange}
  //     />
  //   )
  // }

  if (_.isEmpty(res)) return null

  return (
    <div
      style={{
        margin: '0 auto',
        maxWidth: 1440,
        minWidth: 1080,
        height: '100vh',
        background: '#ffffff',
      }}>
      <div style={{ background: 'black', height: 40 }}>
        <a href="">
          <div className="flex justify-center items-center">
            <img style={{ height: 28 }} src={vmockLogo} />
            <span className="ml-2 text-white">VMock</span>
          </div>
        </a>
      </div>
      <div
        className="grid px-10 py-12"
        style={{
          gridTemplateColumns: '350px 1fr',
          gridGap: 20,
        }}>
        <div>
          <div className="">
            <h2 className="text-24-demi">Student Detail</h2>

            <div className="mt-10">
              <img
                style={{ borderRadius: '100%', width: 63 }}
                src="https://via.placeholder.com/150"
              />
            </div>

            <div className="mt-4">
              <div className="text-20-demi">{res.email_id}</div>
              <div className="text-grey text-16-normal">
                Northwesten University
              </div>
            </div>

            <div
              className="grid mt-2"
              style={{ gridTemplateColumns: '65px 1fr', gridGap: 10 }}>
              <div className="text-grey text-right">Email:</div>

              <div className="">{res.email_id}</div>

              <div className="text-grey text-right">Message:</div>

              <div className="">{res.user_message}</div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-24-demi mb-8">{res.question}</div>
          <div style={{ width: 640 }}>
            <Player
              playsInline
              aspectratio={'4:3'}
              src={res.url}
              autoPlay={false}>
              <BigPlayButton
                position="center"
                aria-label={'video play button'}
              />
            </Player>
          </div>
        </div>
      </div>
    </div>
  )
}
