import React, { useState, useEffect, useRef } from 'react'
import _ from 'underscore'
import { getVideoSharingToken } from './../../actions/apiActions'
import { common, log } from './../../actions/commonActions'
import { notify } from '@vmockinc/dashboard/services/helpers'

const FocusTrap = require('focus-trap-react')
const vmockLogo = process.env.APP_PRODUCT_BASE_URL + '/dist/images/logo.png'

export default function ShareVideoPopup(props) {
  const inputEl = useRef(null)

  let [tokenObj, setTokenObj] = useState({})
  let [panelVisibility, setPanelVisibility] = useState(false)
  let [linkCopied, setLinkCopied] = useState(false)
  let [enableLinkCopy, setEnableLinkCopy] = useState(false)
  let [msgContent, setMsgContent] = useState('XuBZJ7yq4B')
  let [hashObj, setHashObj] = useState({})

  useEffect(() => {
    setEnableLinkCopy(false)
    getVideoSharingToken(
      props.intBasicData.question_content,
      msgContent,
      null,
      res => {
        setTokenObj({ token: res.token })
        log('tokenObj ', tokenObj)
        setEnableLinkCopy(true)
      }
    )
  }, [])

  useEffect(() => {
    log('msgContent in => ', msgContent, tokenObj)
    if (msgContent !== 'XuBZJ7yq4B') {
      msgHandleDebounce.current(msgContent, tokenObj)
    }
  }, [msgContent])

  const afterTyping = (msg, token) => {
    setEnableLinkCopy(false)
    getVideoSharingToken(
      props.intBasicData.question_content,
      msg,
      token.token,
      res => {
        setHashObj(res)
        setEnableLinkCopy(true)
      }
    )
    log('afterTyping msgContent =>', msg, token.token)
  }

  const msgHandleDebounce = useRef(_.debounce(afterTyping, 1000))

  const open = () => {
    setPanelVisibility(true)
  }

  const close = () => {
    setPanelVisibility(false)
  }

  const copyLink = () => {
    var copyText = inputEl.current
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    document.execCommand('copy')
    notify('Link Copied!', 'success', {
      layout: 'topCenter',
      timeout: 300,
    })
  }

  const urlAssembler = () => {
    let url = window.location.origin + process.env.APP_PRODUCT_BASE_URL

    if (!_.isEmpty(tokenObj)) url += `/share/${tokenObj.token}`

    if (!_.isEmpty(hashObj)) url += `&hash=${hashObj.hash}`

    log('url here => ', url)
    return url
  }

  return (
    <span className={`relative app-text-font ${props.containerClasses}`}>
      <button
        className={`${props.iconClasses}`}
        onClick={() => {
          setPanelVisibility(true)
        }}
        aria-label="open video sharing popup"
      />

      {panelVisibility ? (
        <div
          className="absolute bg-white pin-r"
          style={{
            width: 400,
            zIndex: 10001,
            top: '110%',
            fontSize: 14,
            boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.16)',
          }}>
          <div className="px-5 py-3">
            <span className="text-16-demi">Get shareable link</span>
            <span className="ml-8">
              {/* <span
                className="ep-icon-right-outtline text-16-normal align-middle"
                style={{ color: common.sectionColor[0] }}
              />
              <span className="ml-1">Link Copied</span> */}

              <button
                className="float-right"
                onClick={() => {
                  setPanelVisibility(false)
                }}
                aria-label="close video sharing popup">
                <span className="ep-icon-close text-20-normal text-grey-icon" />
              </button>
            </span>
          </div>
          <div className="hr" />

          <div className="px-5 mt-6">
            {!enableLinkCopy ? <span>disabled</span> : <span>enabled</span>}
            <input
              ref={inputEl}
              className="bg-grey-lighter p-2"
              style={{ width: 255 }}
              value={urlAssembler()}
              disable={!enableLinkCopy}
            />

            <button
              className="brand-blue-color ml-4"
              onClick={() => {
                copyLink()
              }}
              aria-label={'Click to copy video sharing url link'}
              disable={!enableLinkCopy}>
              <span className="ep-icon-share" />
              <span className="ml-2 text-14-normal">Copy link</span>
            </button>
          </div>
          <div className="px-5 pb-4 mt-4">
            <textarea
              className="border p-3"
              style={{ height: 73, width: '100%' }}
              placeholder="Message"
              onChange={event => {
                setMsgContent(event.target.value)
              }}
            />
          </div>
        </div>
      ) : null}
    </span>
  )
}
