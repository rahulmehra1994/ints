import React, { Component } from 'react'
import classNames from 'classnames'
import { infoScreenAriaLabel } from '../Constants/AriaLabelText'

let categoryIcons = {
  'Job Role': (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/job_role.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
  'Company/Organisation': (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/company.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
  Degree: (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/degree.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
  Concentration: (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/concentration.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
  'School/University': (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/school.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
  'Job Function': (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/job_function.svg`}
      alt=""
      width="24"
      height="30"
      height="24"
    />
  ),
  Industry: (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/industry.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
  Certifications: (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/certification.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
  Competitions: (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/competition.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
  Awards: (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/awards.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
  'Goal Based Keyword': (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/goals.svg`}
      alt=""
      width="24"
    />
  ),
  'Position of Responsibility': (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/por.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
  'Club/Society': (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/clubs.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
  'Contact Information': (
    <img
      src={`${process.env.APP_BASE_URL}dist/images/contact_info.svg`}
      alt=""
      width="24"
      height="24"
    />
  ),
}

let samplesMapForInfoCategories = {
  Headline: {
    sub_heading:
      'Your profile needs to include certain important pieces of information that gives your profile visitors an overall view of you as a professional for example, your job role, job functions, educational qualification etc. This information helps recruiters figure out if you might be the correct fit for their company.',
    slides: [
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Headline']['sample']['first']
            }>
            5 yrs' experience in{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                A{' '}
              </span>
              Marketing
            </span>{' '}
            in{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Technology
            </span>{' '}
            Industry |{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                C{' '}
              </span>
              Product Manager
            </span>{' '}
            at{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              Apple
            </span>
            , skilled in{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                A{' '}
              </span>
              Product marketing
            </span>
          </p>
        ),
        categories: [
          { name: 'Job Function', albhabet: 'A' },
          { name: 'Industry', albhabet: 'B' },
          { name: 'Job Role', albhabet: 'C' },
          { name: 'Company/Organisation', albhabet: 'D' },
        ],
      },
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Headline']['sample']['second']
            }>
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                A{' '}
              </span>
              MBA
            </span>{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Finance
            </span>{' '}
            &{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Strategy
            </span>{' '}
            Candidate at{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                C{' '}
              </span>
              Stanford
            </span>{' '}
            |{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              Looking for
            </span>{' '}
            internship opportunities in the field of{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                E{' '}
              </span>
              Business Development
            </span>
          </p>
        ),
        categories: [
          { name: 'Degree', albhabet: 'A' },
          { name: 'Concentration', albhabet: 'B' },
          { name: 'School/University', albhabet: 'C' },
          { name: 'Goal Based Keyword', albhabet: 'D' },
          { name: 'Job Function', albhabet: 'E' },
        ],
      },
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Headline']['sample']['third']
            }>
            Recent graduate{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                A{' '}
              </span>
              seeking
            </span>{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Investment Banking
            </span>{' '}
            internship |{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                C{' '}
              </span>
              President
            </span>{' '}
            -{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              Finance Club
            </span>{' '}
            |{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                E{' '}
              </span>
              CFA
            </span>{' '}
            |{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Asset Management
            </span>{' '}
            |{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Strategy
            </span>
          </p>
        ),
        categories: [
          { name: 'Goal Based Keyword', albhabet: 'A' },
          { name: 'Job Function', albhabet: 'B' },
          { name: 'Position of Responsibility', albhabet: 'C' },
          { name: 'Club/Society', albhabet: 'D' },
          { name: 'Certifications', albhabet: 'E' },
        ],
      },
    ],
    static_categories: {
      left_col: [
        'Job Role',
        'Club/Society',
        'Industry',
        'Degree',
        'Concentration',
        'Job Function',
      ],
      right_col: [
        'School/University',
        'Certifications',
        'Goal Based Keyword',
        'Company/Organisation',
        'Position of Responsibility',
      ],
    },
  },
  Summary: {
    sub_heading:
      'Your profile needs to include certain important pieces of information that gives your profile visitors an overall view of you as a professional for example, your job role, job functions, educational qualification etc. This information helps recruiters figure out if you might be the correct fit for their company.',
    slides: [
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Summary']['sample']['first']
            }>
            With 8 years of experience as a{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                A{' '}
              </span>{' '}
              Human Resources Manager
            </span>{' '}
            at{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green-small">
                {' '}
                B{' '}
              </span>
              Goldman Sachs
            </span>{' '}
            including 2 years of experience in{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green-small">
                {' '}
                C{' '}
              </span>
              talent development
            </span>{' '}
            and{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green-small">
                {' '}
                C{' '}
              </span>
              recruiting
            </span>
            , I have recently obtained a{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green-small">
                {' '}
                D{' '}
              </span>
              Professional Certificate in Human Resources
            </span>{' '}
            and am aiming to open my own HR Consultancy for providing HR
            solutions to a diverse and wide set of companies.
          </p>
        ),
        categories: [
          { name: 'Job Role', albhabet: 'A' },
          { name: 'Company/Organisation', albhabet: 'B' },
          { name: 'Job Function', albhabet: 'C' },
          { name: 'Certifications', albhabet: 'D' },
        ],
      },
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Summary']['sample']['second']
            }>
            At College, I was the{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                A{' '}
              </span>
              Chairman
            </span>{' '}
            of the{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Toastmasters Club
            </span>
            . As Chairman, I organized various training sessions and workshops
            for students. I had also participated in various international{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                C{' '}
              </span>
              competitions
            </span>{' '}
            and had{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              won
            </span>{' '}
            the{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              1st prize
            </span>{' '}
            in the KPMG International Case{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                C{' '}
              </span>
              Competition
            </span>{' '}
            twice in a row.
          </p>
        ),
        categories: [
          { name: 'Position of Responsibility', albhabet: 'A' },
          { name: 'Club/Society', albhabet: 'B' },
          { name: 'Competitions', albhabet: 'C' },
          { name: 'Awards', albhabet: 'D' },
        ],
      },
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Summary']['sample']['third']
            }>
            I am an{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                A{' '}
              </span>
              MBA
            </span>{' '}
            candidate focusing on{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Finance
            </span>{' '}
            and{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Strategy
            </span>{' '}
            at{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                C{' '}
              </span>
              Harvard Business School
            </span>{' '}
            and have prior experience of 3 years in the same field. I have
            always been academically inclined and graduated Summa Cum Laude from{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                C{' '}
              </span>
              Cornell University
            </span>
            .
          </p>
        ),
        categories: [
          { name: 'Degree', albhabet: 'A' },
          { name: 'Concentration', albhabet: 'B' },
          { name: 'School/University', albhabet: 'C' },
        ],
      },
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Summary']['sample']['fourth']
            }>
            I am presently{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                A{' '}
              </span>
              looking for
            </span>{' '}
            opportunities in the{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Education
            </span>{' '}
            Industry as I always felt that working for student development and
            enhancing students’ careers was my calling in life. I can be reached
            at{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                C{' '}
              </span>
              abc.jkl@gmail.com
            </span>
            .
          </p>
        ),
        categories: [
          { name: 'Goal Based Keyword', albhabet: 'A' },
          { name: 'Industry', albhabet: 'B' },
          { name: 'Contact Information', albhabet: 'C' },
        ],
      },
    ],
    static_categories: {
      left_col: [
        'Awards',
        'Club/Society',
        'Job Role',
        'Competitions',
        'Degree',
        'Concentration',
        'Industry',
      ],
      right_col: [
        'Job Function',
        'Certifications',
        'School/University',
        'Goal Based Keyword',
        'Contact Information',
        'Company/Organisation',
        'Position of Responsibility',
      ],
    },
  },
  Experience: {
    sub_heading:
      'Your profile needs to include certain important pieces of information that gives your profile visitors an overall view of you as a professional for example, your job role, job functions, educational qualification etc. This information helps recruiters figure out if you might be the correct fit for their company.',
    slides: [
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Experience']['sample']['first']
            }>
            <span className="text-bold-larger">
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  A{' '}
                </span>
                Accounting Intern
              </span>{' '}
              -{' '}
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  B{' '}
                </span>
                Accounts payable
              </span>{' '}
              | Accounts receivables | Auditing at{' '}
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  C{' '}
                </span>
                Deloitte
              </span>
            </span>
            <br />
            Mar 2016 - May 2016
            <br />
            As part of summer internship at{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                C{' '}
              </span>
              Deloitte
            </span>
            , I undertook the following task:
            <br />- Performed meticulous{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              accounting
            </span>{' '}
            for companies across{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              Healthcare
            </span>{' '}
            and{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              Technology
            </span>{' '}
            industries; processed and consolidated 100+ customer and vendor
            invoices, saving company close to $10,000 in interest payments
          </p>
        ),
        categories: [
          { name: 'Job Role', albhabet: 'A' },
          { name: 'Job Function', albhabet: 'B' },
          { name: 'Company/Organisation', albhabet: 'C' },
          { name: 'Industry', albhabet: 'D' },
        ],
      },
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Experience']['sample']['second']
            }>
            <span className="text-bold-larger">
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  A{' '}
                </span>
                President
              </span>{' '}
              -{' '}
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  B{' '}
                </span>
                Marketing Club
              </span>{' '}
              at{' '}
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  C{' '}
                </span>
                Harvard Business School
              </span>
            </span>
            <br />
            Jan 1993 - Jan 1995
            <br />
            While pursuing my MBA, I was President of Marketing Club and had{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              won
            </span>{' '}
            "Student of the Year{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              Award
            </span>
            " as well as various international{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                E{' '}
              </span>
              competitions
            </span>
            . I was majorly responsible for:
            <br />- Organising 10+ competitions and seminars every year,{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                F{' '}
              </span>
              looking for
            </span>{' '}
            and inviting industry professionals to speak at events and getting
            maximum student turnout
          </p>
        ),
        categories: [
          { name: 'Position of Responsibility', albhabet: 'A' },
          { name: 'Club/Society', albhabet: 'B' },
          { name: 'School/University', albhabet: 'C' },
          { name: 'Awards', albhabet: 'D' },
          { name: 'Competitions', albhabet: 'E' },
          { name: 'Goal Based Keyword', albhabet: 'F' },
        ],
      },
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Experience']['sample']['third']
            }>
            <span className="text-bold-larger">
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  A{' '}
                </span>
                MBA
              </span>{' '}
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  B{' '}
                </span>
                Finance
              </span>{' '}
              Student at{' '}
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  C{' '}
                </span>
                Harvard Business School
              </span>
            </span>
            <br />
            Jan 2016 - Present
            <br />
            Presently, I am pursuing{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                A{' '}
              </span>
              MBA
            </span>{' '}
            in{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Finance
            </span>{' '}
            and{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                B{' '}
              </span>
              Strategy
            </span>{' '}
            at{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                C{' '}
              </span>
              Harvard Business School
            </span>
            , graduating in 2017. Over the last 1 year, I have built skills in
            financial analysis and modeling, along with investment analysis and
            investment strategies.
            <br />- Received{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              CFA Certification
            </span>{' '}
            2 months earlier; tutored batch of 100+ students in basic financial
            management concepts securing top of class results
          </p>
        ),
        categories: [
          { name: 'Degree', albhabet: 'A' },
          { name: 'Concentration', albhabet: 'B' },
          { name: 'School/University', albhabet: 'C' },
          { name: 'Certifications', albhabet: 'D' },
        ],
      },
    ],
    static_categories: {
      left_col: [
        'Awards',
        'Club/Society',
        'Industry',
        'Competitions',
        'Degree',
        'Concentration',
        'Job Role',
      ],
      right_col: [
        'Job Function',
        'Certifications',
        'Goal Based Keyword',
        'School/University',
        'Company/Organisation',
        'Position of Responsibility',
      ],
    },
  },
  Education: {
    sub_heading:
      'Your profile needs to include certain important pieces of information that gives your profile visitors an overall view of you as a professional for example, your job role, job functions, educational qualification etc. This information helps recruiters figure out if you might be the correct fit for their company.',
    slides: [
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Education']['sample']['first']
            }>
            <span className="text-bold-larger">
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  A{' '}
                </span>
                London Business School
              </span>
              <br />
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  B{' '}
                </span>
                Master of Business Administration
              </span>{' '}
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  A{' '}
                </span>
                (MBA)
              </span>
              ,{' '}
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  C{' '}
                </span>
                Finance
              </span>
            </span>
            <br />
            2015 - 2017
            <br />
            Activities and Societies:{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              President
            </span>{' '}
            -{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                E{' '}
              </span>
              Consulting Club
            </span>
            , Member -{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                E{' '}
              </span>
              Energy Club
            </span>
            , Member -{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                E{' '}
              </span>
              Business Club and China Club
            </span>
            , completed{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                F{' '}
              </span>
              CFA
            </span>{' '}
            Certification
          </p>
        ),
        categories: [
          { name: 'School/University', albhabet: 'A' },
          { name: 'Degree', albhabet: 'B' },
          { name: 'Concentration', albhabet: 'C' },
          { name: 'Position of Responsibility', albhabet: 'D' },
          { name: 'Club/Society', albhabet: 'E' },
          { name: 'Certifications', albhabet: 'F' },
        ],
      },
      {
        text: (
          <p
            className="text-normal padding-top-20"
            tabIndex={0}
            aria-label={
              infoScreenAriaLabel['category']['Education']['sample']['second']
            }>
            <span className="text-bold-larger">
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  A{' '}
                </span>
                Harvard Business School
              </span>
              <br />
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  B{' '}
                </span>
                Master of Business Administration
              </span>{' '}
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  B{' '}
                </span>
                (MBA)
              </span>
              ,{' '}
              <span className="show-category-larger">
                <span className="green-icon-cr cr-icon-width-small text-color-green">
                  {' '}
                  C{' '}
                </span>
                Finance
              </span>
            </span>
            <br />
            2015 - 2017
            <br />
            Activities and Societies: Member of{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                D{' '}
              </span>
              Private Equity and Venture Capital Club
            </span>
            ,{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                E{' '}
              </span>
              Winner
            </span>{' '}
            of{' '}
            <span className="show-category">
              <span className="green-icon-cr cr-icon-width-small text-color-green">
                {' '}
                F{' '}
              </span>
              Case Study Competition
            </span>
          </p>
        ),
        categories: [
          { name: 'School/University', albhabet: 'A' },
          { name: 'Degree', albhabet: 'B' },
          { name: 'Concentration', albhabet: 'C' },
          { name: 'Club/Society', albhabet: 'D' },
          { name: 'Awards', albhabet: 'E' },
          { name: 'Competitions', albhabet: 'F' },
        ],
      },
    ],
    static_categories: {
      left_col: ['Awards', 'Club/Society', 'Competitions', 'Degree'],
      right_col: [
        'Concentration',
        'School/University',
        'Certifications',
        'Position of Responsibility',
      ],
    },
  },
}

export default class InfoCategories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      slideLength: 0,
    }

    this.showDivs = this.showDivs.bind(this)
    this.len = 0
  }

  componentDidMount() {
    this.setState(prevState => ({ index: prevState.index }))
    this.len = 0
  }

  componentDidUpdate() {
    this.showDivs(this.state.index)
  }

  prevSample() {
    if (this.state.index > 0) {
      this.setState(prevState => ({ index: prevState.index - 1 }))
    }
  }

  nextSample(len) {
    if (this.state.index < len - 1) {
      this.setState(prevState => ({ index: prevState.index + 1 }))
    }
  }

  showDivs(n) {
    let i = 0
    let x = $('.mySlides')
    this.len = x.length
    let images = $('.cate-carousel-inner .item img')

    for (i = 0; i < x.length; i++) {
      $(x[i]).css('display', 'none')
    }
    $(x[this.state.index]).css('display', 'block')
  }

  render() {
    const { currentSection } = this.props
    let leftStaticCategories = []
    this.len = samplesMapForInfoCategories[currentSection]['slides'].length

    for (
      let i = 0;
      i <
      samplesMapForInfoCategories[currentSection]['static_categories'][
        'left_col'
      ].length;
      i++
    ) {
      leftStaticCategories.push(
        <li
          tabIndex={0}
          aria-label={
            samplesMapForInfoCategories[currentSection]['static_categories'][
              'left_col'
            ][i]
          }>
          {
            categoryIcons[
              samplesMapForInfoCategories[currentSection]['static_categories'][
                'left_col'
              ][i]
            ]
          }{' '}
          {
            samplesMapForInfoCategories[currentSection]['static_categories'][
              'left_col'
            ][i]
          }{' '}
        </li>
      )
    }

    let rightStaticCategories = []

    for (
      let i = 0;
      i <
      samplesMapForInfoCategories[currentSection]['static_categories'][
        'right_col'
      ].length;
      i++
    ) {
      rightStaticCategories.push(
        <li
          key={i}
          tabIndex={0}
          aria-label={
            samplesMapForInfoCategories[currentSection]['static_categories'][
              'right_col'
            ][i]
          }>
          {
            categoryIcons[
              samplesMapForInfoCategories[currentSection]['static_categories'][
                'right_col'
              ][i]
            ]
          }{' '}
          {
            samplesMapForInfoCategories[currentSection]['static_categories'][
              'right_col'
            ][i]
          }
        </li>
      )
    }

    let slideClassName = classNames('row', 'mySlides', {
      [`${currentSection}-slides-height`]: true,
    })
    let slides = []

    for (
      let i = 0;
      i < samplesMapForInfoCategories[currentSection]['slides'].length;
      i++
    ) {
      let categories = []

      for (
        let j = 0;
        j <
        samplesMapForInfoCategories[currentSection]['slides'][i]['categories']
          .length;
        j++
      ) {
        categories.push(
          <div className="col-sm-6 cate-first-impression">
            <ul>
              <li key={j}>
                <span className="green-icon-cr cr-icon-width text-color-green">
                  {' '}
                  {
                    samplesMapForInfoCategories[currentSection]['slides'][i][
                      'categories'
                    ][j]['albhabet']
                  }{' '}
                </span>{' '}
                {
                  categoryIcons[
                    samplesMapForInfoCategories[currentSection]['slides'][i][
                      'categories'
                    ][j]['name']
                  ]
                }{' '}
                {
                  samplesMapForInfoCategories[currentSection]['slides'][i][
                    'categories'
                  ][j]['name']
                }{' '}
              </li>
            </ul>
          </div>
        )
        if (j % 2 != 0) {
          categories.push(<div className="clearfix" />)
        }
      }

      slides.push(
        <div className={slideClassName}>
          <h4
            className="padding-top-20 "
            tabIndex={0}
            aria-label={infoScreenAriaLabel['category']['sample']}>
            Illustrations of how Information <br />
            Categories improve first impression
          </h4>
          {samplesMapForInfoCategories[currentSection]['slides'][i]['text']}
          <div className="border-bottom-gray" />
          <div className="row ">{categories}</div>
        </div>
      )
    }

    return (
      <div>
        <div className="container-fluid bg-white categories-info padding-6p">
          <div className="row">
            <div className="col-sm-12">
              <div className="close-icon">
                <a
                  aria-label={infoScreenAriaLabel['close']}
                  href="javascript:void(0);"
                  onClick={() => this.props.hideModal()}>
                  {' '}
                  X
                </a>
              </div>
              <h2> Information Categories</h2>
              <div className="info-categories-icon">
                <img
                  src={`${process.env.APP_BASE_URL}dist/images/info-categories-icon.jpg`}
                  width="60"
                />
              </div>
              <div className="info-right-data">
                <h3
                  tabIndex={0}
                  aria-label={infoScreenAriaLabel['category']['what']}>
                  What are Information Categories?{' '}
                </h3>
                <p>
                  <span
                    tabIndex={0}
                    aria-label={infoScreenAriaLabel['category']['text']}>
                    {samplesMapForInfoCategories[currentSection]['sub_heading']}
                  </span>
                </p>
              </div>
              <div className="row margin-4p border-top-gray">
                <div className="row">
                  <div className="col-sm-7">
                    {slides}
                    <div className="row">
                      <div className="col-sm-3 padding-rl-0">
                        {this.state.index != 0 ? (
                          <a
                            className="sample-prev"
                            href="javascript:void(0);"
                            aria-label={
                              infoScreenAriaLabel['category']['previous']
                            }
                            onClick={() => this.prevSample()}>
                            {' '}
                            <span className="glyphicon glyphicon-triangle-left" />{' '}
                          </a>
                        ) : (
                          <a
                            className="sample-prev-disabled"
                            href="javascript:void(0);">
                            <span className="glyphicon glyphicon-triangle-left" />
                          </a>
                        )}
                      </div>
                      <div className="col-sm-6 padding-rl-0">
                        <div className="text-center">
                          <div className="categories-bt-number">
                            {this.state.index + 1}/{this.len}
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3 padding-rl-0">
                        {this.state.index != this.len - 1 ? (
                          <a
                            className="sample-next"
                            href="javascript:void(0);"
                            aria-label={infoScreenAriaLabel['category']['next']}
                            onClick={() => this.nextSample(this.len)}>
                            {' '}
                            <span className="glyphicon glyphicon-triangle-right" />{' '}
                          </a>
                        ) : (
                          <a
                            className="sample-next-disabled"
                            href="javascript:void(0);">
                            {' '}
                            <span className="glyphicon glyphicon-triangle-right" />{' '}
                          </a>
                        )}
                      </div>
                      <div className="clearfix" />
                    </div>
                  </div>
                  <div className="col-sm-5 padding-top-30">
                    <div className="smp-bullets smp-gray-bg border-radius-5 margin-bottom-20">
                      <h5
                        tabIndex={0}
                        aria-label={infoScreenAriaLabel['category']['list']}>
                        List of Information Categories
                      </h5>
                      <div className="row ">
                        <div className="col-sm-5 padding-rl-0">
                          <ul>{leftStaticCategories}</ul>
                        </div>
                        <div className="col-sm-7 padding-rl-0">
                          <ul>{rightStaticCategories}</ul>
                        </div>
                      </div>
                    </div>
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
