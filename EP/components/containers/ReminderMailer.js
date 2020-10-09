import React, { useState, useEffect } from 'react'
import { common } from './../../actions/commonActions'
import { sendEmailerReminderToken } from './../../actions/apiActions'

export default function ReminderMailer() {
  let [showSuccess, setShowSuccess] = useState(false)
  let [days, setDays] = useState(0)
  useEffect(() => {
    let loc = window.location.pathname.split('/')
    let token = loc[3]
    sendEmailerReminderToken(
      token,
      onSuccessOfEmailerReminderToken,
      afterAllUnsuccess
    )
  }, [])

  const onSuccessOfEmailerReminderToken = data => {
    if (data.status === 'success') {
      setShowSuccess(true)
      setDays(data.days)
    }
  }

  const afterAllUnsuccess = () => {
    setShowSuccess(false)
    window.location.replace(process.env.APP_NAVBAR_URL)
  }

  if (showSuccess) {
    return (
      <div className="bg-white" style={{ height: '100vh' }}>
        <div
          className="bg-white flex justify-center items-center"
          style={{ height: 64, boxShadow: '0 3px 12px 0 rgba(0, 0, 0, 0.16)' }}>
          <a href={process.env.APP_NAVBAR_URL}>
            <img
              style={{ height: 53 }}
              src="https://vmockvideofiles.s3.amazonaws.com/assets/images/new_summary_benchmarking_dashtest_logo1.png"
              alt={'vmock logo'}
            />
          </a>
        </div>

        <div
          className="flex justify-center items-center"
          style={{ marginTop: 150 }}>
          <div>
            <div className="text-center">
              <img
                src="https://s3.amazonaws.com/vmockvideofiles/assets/images/ep-images/mailer/reminder-email-tick.png"
                style={{ width: 235 }}
              />{' '}
            </div>

            <div className="" style={{ marginTop: 50 }}>
              <p className="text-center" style={{ fontSize: 40 }}>
                The reminder is successfully set!
                <br /> You will be reminded after {days}{' '}
                {days !== 1 ? 'days' : 'day'}.{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}
