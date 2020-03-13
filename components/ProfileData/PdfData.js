import React from 'react'
import _ from 'underscore'
import $ from 'jquery'

function fetchImageUrl(url) {
  if (_.isEmpty(url)) {
    return
  }

  return url
}

function renderImage(input) {
  let url = _.isEmpty(input)
    ? `${process.env.APP_BASE_URL}dist/images/profile-avatar.png`
    : input

  let data = (
    <div className="profile border-radius-bottom-none">
      <img
        src={url}
        alt="Profile picture"
        width="80"
        height="100%"
        className="img-circle p-image"
      />
      <div className="clearfix" />
    </div>
  )

  return data
}

function renderName(name) {
  let data = (
    <div className="profile border-radius-padding-none">
      <div className="p-name">{name}</div>
      <div className="clearfix" />
    </div>
  )

  return data
}

function renderHeadline(data) {
  let component = (
    <div className="profile border-radius-padding-none">
      <div className="p-headline">{renderTextData(data)}</div>
      <div className="clearfix" />
    </div>
  )

  return component
}

function renderUrl(personalInfo, url) {
  let data = (
    <div className="profile border-radius-padding-none">
      <div className="padding-bottom-10">
        {url}
        <br />
        {personalInfo}
      </div>
      <div className="clearfix" />
    </div>
  )

  return data
}

function renderSummary(summaryData) {
  if (_.isEmpty(summaryData)) {
    return <div className="clearfix summary-margin" />
  }

  let data = (
    <div className="profile contnet-left border-radius-top-none">
      {renderTextData(summaryData['text'])}
      <div className="clearfix" />
    </div>
  )

  return data
}

function render68(experienceData, sectionName) {
  if (_.isEmpty(experienceData)) {
    return null
  }

  let data = []

  for (let index in experienceData) {
    data.push(
      <div
        key={Math.floor(Math.random() * 1000000 + 10000)}
        className="profile contnet-left">
        {renderTextData(experienceData[index]['title'])}
        {renderTextData(experienceData[index]['sub_title'])}
        {renderTextData(experienceData[index]['time_duration'])}
        <div>{renderTextData(experienceData[index]['text'])}</div>
        <div className="clearfix" />
      </div>
    )
  }

  return data
}

function renderSkills(skillsData) {
  if (_.isEmpty(skillsData)) {
    return null
  }

  let data = (
    <div className="profile">
      <p className="p-heading-1 align-text-left">Top Skills</p>
      <ul className="skills-keywords keywords-gray keyqords-r-paiding-none tab-r-paiding-none">
        {skillsData}
      </ul>
    </div>
  )

  return data
}

function renderTextData(textData) {
  if (_.isString(textData) || _.isNull(textData)) {
    return textData
  }

  if (_.isArray(textData)) {
    var output = []
    var tempOutput = []
    let prevWasPara = false
    let k = -1

    for (let i in textData) {
      if (_.isString(textData[i]) || _.isNull(textData[i])) {
        tempOutput.push(textData[i])
      } else if (_.isObject(textData[i])) {
        let temp = renderTextData(textData[i])
        if (
          k != -1 &&
          textData[k].hasOwnProperty('end_period') &&
          textData[k]['end_period'] == true
        ) {
          if (
            !(
              (textData[i].hasOwnProperty('new_paragraph') &&
                textData[i]['new_paragraph'] == true) ||
              (textData[i].hasOwnProperty('new_line') &&
                textData[i]['new_line'] == true)
            )
          ) {
            let t = [
              <span key={Math.floor(Math.random() * 1000000 + 10000)}>
                &nbsp;
              </span>,
            ]
            temp = t.concat(temp)
          }
        }
        k = i
        if (
          textData[i].hasOwnProperty('new_paragraph') &&
          textData[i]['new_paragraph'] == true
        ) {
          if (prevWasPara == false) {
            output = output.concat(
              <div key={`new-para-${output.length}`} className="margin-0">
                {tempOutput}
              </div>
            )
            tempOutput = []
          } else {
            output = output.concat(
              <div key={`new-para-${output.length}`} className="margin-top-10">
                {tempOutput}
              </div>
            )
            tempOutput = []
          }

          tempOutput = tempOutput.concat(temp)
          prevWasPara = true
        } else if (
          textData[i].hasOwnProperty('new_line') &&
          textData[i]['new_line'] == true
        ) {
          tempOutput.push(
            <div key={`new-line-${tempOutput.length}`} className="margin-0">
              {temp}
            </div>
          )
        } else {
          tempOutput = tempOutput.concat(temp)
        }
      }
    }

    if (!_.isEmpty(tempOutput)) {
      if (prevWasPara == false) {
        output = output.concat(
          <div key={`final-${output.length}`} className="margin-0">
            {tempOutput}
          </div>
        )
      } else {
        output = output.concat(
          <div key={`final-${output.length}`} className="margin-top-10">
            {tempOutput}
          </div>
        )
      }
    }

    return output
  }

  if (_.isObject(textData)) {
    var output = []
    var tempOutput = null

    if (textData['type'] == 'div') {
      if (textData.hasOwnProperty('key')) {
        tempOutput = (
          <div key={textData['key'] + '-pdf'} className={getClass(textData)}>
            {textData.hasOwnProperty('bullet') ? textData['bullet'] : null}
            {textData['text']}
          </div>
        )
      } else {
        tempOutput = (
          <div
            key={Math.floor(Math.random() * 1000000 + 10000)}
            className={getClass(textData)}>
            {textData.hasOwnProperty('bullet') ? textData['bullet'] : null}
            {textData['text']}
          </div>
        )
      }
    } else if (textData['type'] == 'span') {
      if (textData.hasOwnProperty('key')) {
        tempOutput = (
          <span key={textData['key'] + '-pdf'} className={getClass(textData)}>
            {textData.hasOwnProperty('bullet') ? textData['bullet'] : null}
            {textData['text']}
          </span>
        )
      } else {
        tempOutput = (
          <span
            key={Math.floor(Math.random() * 1000000 + 10000)}
            className={getClass(textData)}>
            {textData.hasOwnProperty('bullet') ? textData['bullet'] : null}
            {textData['text']}
          </span>
        )
      }
    } else if (textData['type'] == 'title_span') {
      if (textData.hasOwnProperty('key')) {
        tempOutput = (
          <div
            key={Math.floor(Math.random() * 1000000 + 10000)}
            className="p-heading-1">
            <span key={textData['key'] + '-pdf'} className={getClass(textData)}>
              {textData.hasOwnProperty('bullet') ? textData['bullet'] : null}
              {textData['text']}
            </span>
          </div>
        )
      } else {
        tempOutput = (
          <div
            key={Math.floor(Math.random() * 1000000 + 10000)}
            className="p-heading-1">
            <span className={getClass(textData)}>
              {textData.hasOwnProperty('bullet') ? textData['bullet'] : null}
              {textData['text']}
            </span>
          </div>
        )
      }
    }
    output.push(tempOutput)
  }

  return output
}

function getClass(textData) {
  if (textData.hasOwnProperty('class')) {
    return textData['class']['others'] // textData['class']['highlight_class']+' '+textData['class']['others']
  }

  return null
}
function inputValue(textData) {
  if (_.isNull(textData)) {
    return ''
  }

  if (_.isString(textData)) {
    return textData
  }

  let output = []

  if (_.isArray(textData)) {
    for (let i in textData) {
      output.push(inputValue(textData[i]))
    }
  }

  if (_.isObject(textData)) {
    let bullet =
      textData.hasOwnProperty('bullet') + ' ' ? textData['bullet'] : ''
    output.push(bullet)
    output.push(inputValue(textData['text']))
  }

  return output.join('')
}

const PdfData = ({ sectionWiseTextPdf }) => {
  if (_.isEmpty(sectionWiseTextPdf['name'])) {
    return null
  }

  return (
    <div id="pdf-data" className="pdf-data-main-styling">
      {renderImage(sectionWiseTextPdf['imageUrl'])}
      {renderName(sectionWiseTextPdf['name'])}
      {renderHeadline(sectionWiseTextPdf['headline'])}
      {renderUrl(
        sectionWiseTextPdf['personal_information'],
        sectionWiseTextPdf['profile_url']
      )}
      {renderSummary(sectionWiseTextPdf['summary'])}
      {render68(sectionWiseTextPdf['experience'], 'Experience')}
      {render68(sectionWiseTextPdf['education'], 'Education')}
    </div>
  )
}

export default PdfData
