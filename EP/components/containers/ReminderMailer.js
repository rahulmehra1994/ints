import React, { useState, useEffect } from 'react'
import { common } from './../../actions/commonActions'
export default function ReminderMailer() {
  useEffect(() => {}, [])
  return (
    <div className="bg-white" style={{ height: '100vh' }}>
      <div
        className="shadow-1 bg-white flex justify-center items-center"
        style={{ height: 64 }}>
        <a href="/">
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
              <br /> You will be reminded after [N] days.{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
