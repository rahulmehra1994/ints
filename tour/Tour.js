import React, { Component } from 'react'
import { connect } from 'react-redux'
import { tourDone, updateTourStatus, changeTourActive } from './Action'
import { sendTrackingData } from '@vmockinc/dashboard/services/tracking'
import $ from 'jQuery'
import Joyride from 'react-joyride'

class Tour extends Component {
  constructor() {
    super()
    this.state = {
      steps: [],
      run: false,
    }
  }

  getSteps() {
    const options = {
      disableBeacon: true,
      disableScrollParentFix: true,
    }
    const circleStyle = {
      spotlight: {
        borderRadius: '50%',
      },
    }
    const steps = [
      {
        target: '.js-detailed-profile-strength',
        content: 'View your overall profile strength.',
        ...options,
        placement: 'bottom',
      },
      {
        target: '.js-detailed-left-nav',
        content:
          'Navigate to different sections of your profile through this panel.',
        ...options,
        placement: 'right',
      },
    ]
    if (this.props.tourelement === 'detailed') {
      if (this.props.has_pdf == 0) {
        steps.push({
          target: '.js-detailed-upload-pdf',
          content: 'Upload profile PDF to unlock full feedback!',
          ...optoins,
          placement: 'top',
        })
      }
    }

    if ($('#parameters-navigation-tab').length) {
      steps.push({
        target: '#parameters-navigation-tab',
        content: 'Navigate through different section.',
        ...options,
        placement: 'right',
      })
      steps.push({
        target: '#parameters-navigation-content',
        content: 'Feedback of different parameters.',
        ...options,
        placement: 'top',
      })
    } else {
      steps.push({
        target: '.js-detailed-feedback',
        content: 'Section evaluation parameters.',
        ...options,
        placement: 'right',
        // scroll_to: '.js-detailed-feedback',
        // scroll_to_1: '.active-section',
      })
    }

    steps.push({
      target: '.active-section .js-detailed-edit-button',
      content: 'Edit specific sections of your profile by using this button.',
      ...options,
      placement: 'left',
      styles: {
        ...circleStyle,
      },
    })

    steps.push({
      target: '.active-section .js-detailed-log-button',
      content: 'Logs button to keep track of your edits.',
      ...options,
      placement: 'left',
      styles: {
        ...circleStyle,
      },
    })

    steps.push({
      target: '.js-detailed-add-resume',
      content: 'Add or change your resume for more insights.',
      ...options,
      placement: 'bottom',
    })

    steps.push({
      target: '.js-detailed-target-functions',
      content: 'Change your target function to discover the best fit.',
      ...options,
      placement: 'bottom',
    })

    steps.push({
      target: '.integrate-to-linkedin-appbar-btn',
      content: 'Integrate changes to your LinkedIn profile after editing',
      ...options,
      placement: 'bottom',
    })

    steps.push({
      target: '#three-dots-dropdown',
      content: 'Download your improved profile from here.',
      ...options,
      placement: 'bottom',
      styles: {
        ...circleStyle,
      },
    })

    this.setState({
      steps: steps,
    })
  }

  componentDidMount() {
    var id = this.props.tourelement
    if (this.props.tourstatus[id] === 0) {
      this.hashLinkScroll()
      sendTrackingData('event', 'aspire_tour', 'click', 'first_run')
      this.runTour()
      var tempstatus = this.props.tourstatus
      tempstatus[id] = 1
      this.props.updateTourStatus(tempstatus, id)
    }
  }

  componentDidUpdate() {
    if (this.props.startTour && !this.state.run) {
      this.hashLinkScroll()
      sendTrackingData('event', 'aspire_tour', 'click', 'normal_run')
      this.runTour()
      this.props.tourDone()
    }
  }

  hashLinkScroll() {
    const { hash } = window.location
    if (hash !== '') {
      // Push onto callback queue so it runs after the DOM is updated,
      // this is required when navigating from a different page so that
      // the element is rendered on the page before trying to getElementById.
      setTimeout(() => {
        const id = hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) element.scrollIntoView()
      }, 0)
    }
  }

  runTour() {
    this.getSteps()
    this.setState({
      run: true,
    })
    $('.tour-scroll').addClass('no-scroll')
  }

  tourCallback(tour) {
    const { action, type, step } = tour
    if (type === 'tour:start') {
      this.tourActiveStatus(true)
    }
    if (type === 'tour:end') {
      if (action === 'skip') {
        sendTrackingData('event', 'aspire_tour', 'click', 'tour_skip')
      } else {
        sendTrackingData('event', 'aspire_tour', 'click', 'tour_end')
      }
      document.querySelectorAll('.tour-scroll').forEach(function(element) {
        element.classList.remove('no-scroll')
      })
      this.setState({ run: false })
      this.tourActiveStatus(true)
    }
    if (type === 'step:after') {
      sendTrackingData('event', 'aspire_tour', 'click', 'tour_step')
    }
  }

  tourActiveStatus(status) {
    this.props.changeTourActive(status)
  }

  render() {
    const { tourelement, tourstatus } = this.props
    const { steps, run } = this.state
    return (
      <Joyride
        key={tourelement}
        steps={steps}
        run={run}
        callback={v => this.tourCallback(v)}
        showSkipButton={true}
        continuous={true}
        locale={{ last: 'Done' }}
        styles={{
          options: {
            primaryColor: '#0075cb',
            zIndex: 2010,
            overlayColor: 'rgba(0, 0, 0, 0.8)',
          },
          buttonClose: {
            display: 'none',
          },
        }}
      />
    )
  }
}

const mapStateToProps = (store, ownProps) => {
  return {
    startTour: store.tour.startTour,
    tourstatus: store.tour.tourStatus,
    tourActive: store.tour.tourActive,
    has_pdf: store.aspireFeedbackData.has_pdf,
  }
}

export default connect(mapStateToProps, {
  tourDone,
  updateTourStatus,
  changeTourActive,
})(Tour)
