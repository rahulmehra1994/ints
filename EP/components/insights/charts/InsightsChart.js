import React, { Component } from 'react'
import _ from 'underscore'
import { mutuals, common } from '../../../actions/commonActions'
import Highcharts from 'highcharts'

var Loader = require('react-loaders').Loader
const ReactHighcharts = require('react-highcharts')

class HandChart extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      firstLeftHandPoint: 0,
      firstRightHandPoint: 0,
    }
  }

  shouldComponentUpdate(newProps) {
    if (
      JSON.stringify(newProps.graphData) !==
      JSON.stringify(this.props.graphData)
    ) {
      return true
    } else {
      return false
    }
  }

  graph(props) {
    let config = {
      chart: {
        type: 'line',
        marginRight: 20,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        categories: props.xPoints,
        gridLineWidth: 1,
      },
      yAxis: {
        title: {
          text: 'Status',
        },
        gridLineWidth: 1,
        max: _.has(props.graphData, 'maxYPoint')
          ? props.graphData.maxYPoint
          : null,
        min: 0,
        //visible: _.has(props.config, 'hideYAxisPoints') ? false : true,
        plotBands: _.has(props.graphData, 'plotBands')
          ? [
              {
                from: props.graphData.plotBands.from,
                to: props.graphData.plotBands.to,
                color: props.graphData.plotBands.color,
                label: {
                  text: props.graphData.plotBands.text,
                  style: {
                    color: props.graphData.plotBands.textColor,
                  },
                  x: 0,
                  align: 'right',
                },
              },
            ]
          : null,
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            inside: true,
          },
          enableMouseTracking: false,
          marker: {
            lineWidth: 1,
          },
        },
      },
      series: [
        {
          name: '',
          lineWidth: 4,
          data: props.graphData.arr,
          dataLabels: {
            enabled: true,
            color: '#000000',
            // backgroundColor: '#FFFFFF',
            // borderWidth: '1',
            // align: 'center',
            // x: 0,
            // y: 0,
            // rotation: 0,
            formatter: function() {
              if (_.has(props, 'modifyDataLabels')) {
                return `${props.modifyDataLabels(this.y)} ${
                  _.has(props.graphData, 'unit') ? props.graphData.unit : ''
                }`
              } else
                return `${this.y} ${
                  _.has(props.graphData, 'unit') ? props.graphData.unit : ''
                }`
            },
          },
        },
      ],
      animation: true,
    }
    return <ReactHighcharts config={config} />
  }

  graphMaker() {
    return this.graph(this.props)
  }

  render() {
    return (
      <React.Fragment>
        <div className="mt-6">
          <div className="relative insights-chart">{this.graphMaker()}</div>
        </div>

        {_.has(this.props.config, 'legends') &&
        this.props.config.legends === false ? null : (
          <div className="text-center">
            <div className="m-auto" style={{ width: 300 }}>
              <div className="">
                <div
                  className="rounded-full float-left"
                  style={{
                    width: 12,
                    height: 12,
                    background: common.sectionColor[0],
                    marginTop: 3,
                  }}
                />

                <div
                  className="ml-4 float-left relative"
                  style={{ fontSize: 12, top: 2 }}>
                  Good Job
                </div>
              </div>
              <div className="ml-6 float-left">
                <div
                  className="rounded-full float-left"
                  style={{
                    width: 12,
                    height: 12,
                    background: common.sectionColor[1],
                    marginTop: 3,
                  }}
                />

                <div
                  className="ml-4 float-left relative"
                  style={{ fontSize: 12, top: 2 }}>
                  On Track
                </div>
              </div>

              <div className="ml-6 float-left">
                <div
                  className="rounded-full float-left"
                  style={{
                    width: 12,
                    height: 12,
                    background: common.sectionColor[2],
                    marginTop: 3,
                  }}
                />

                <div
                  className="ml-4 float-left relative"
                  style={{ fontSize: 12, top: 2 }}>
                  Needs Work
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default HandChart
