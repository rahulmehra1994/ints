import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import {
  mutuals,
  log,
  isGraphValNull,
  insightsGraphValColors,
} from '../../actions/commonActions'
import Tabs from '../commons/Tabs'
import InsightsChart from './charts/InsightsChart'

class InsightsWrap extends Component {
  constructor(props) {
    super(props)
    this.state = { tabsData: [], graphData: null }
    this.switchTab = this.switchTab.bind(this)
    this.tabsDataMaker = this.tabsDataMaker.bind(this)
  }

  componentDidMount() {
    this.tabsDataMaker()
  }

  tabsDataMaker() {
    let data = this.props.customData.map((item, index) => {
      return {
        ...item,
        arr: this.graphDataCreator(item),
      }
    })

    this.setState(
      {
        tabsData: data,
        graphData: {
          // label: data[0].label,
          // data: data[0].arr,
          // unit: _.has(data[0], 'unit') ? data[0].unit : null,
          ...data[0],
        },
      },
      () => {
        log('graphData', this.state.graphData)
      }
    )
  }

  graphDataCreator(obj) {
    let dateArr = this.props.rows.map((item, index) => {
      return mutuals.dateSmall(item.dates)
    })

    this.setState({ xPoints: dateArr.reverse() })

    let yPointsArr = this.props.rows.map((item, index) => {
      let yValue = mutuals.getValueFromKeys(item, obj.keys.yAxisKey)
      let yColorType = mutuals.getValueFromKeys(item, obj.keys.yAxisColor)

      if (_.has(this.props, 'checkContentDisabled')) {
        return {
          y: this.isContentEnabled(item)
            ? isGraphValNull(item, obj.keys.shouldShowNull)
              ? null
              : this.valueModify(obj, yValue)
            : 0, //when content is disabled zero value
          marker: {
            symbol: this.isContentEnabled(item)
              ? this.findSymbol(obj, yColorType)
              : null, //when content is disabled no color
          },
          isContentEnabled: this.isContentEnabled(item),
          checkContentDisabled: true,
        }
      }

      return {
        y: isGraphValNull(item, obj.keys.shouldShowNull)
          ? null
          : this.valueModify(obj, yValue),
        marker: {
          symbol: this.findSymbol(obj, yColorType),
        },
      }
    })

    log('yPointsArr', yPointsArr)

    return yPointsArr.reverse()
  }

  isContentEnabled(item) {
    return mutuals.isContentEnabled({
      intQuestionId: item.question_id,
      customizations: this.props.customizations,
    })
  }

  valueModify(obj, yValue) {
    log('valueModify', { obj, yValue })
    if (_.has(obj, 'yPointsModifier')) return obj.yPointsModifier(yValue, obj)
    else return yValue
  }

  findSymbol(obj, yColorType) {
    if (_.has(obj, 'colorValFind'))
      return insightsGraphValColors[obj.colorValFind(yColorType, obj)]
    else return insightsGraphValColors[yColorType]
  }

  switchTab(item) {
    this.setState({
      graphData: item,
    })
  }

  render() {
    let { tabsData, graphData, xPoints } = this.state
    let { tabIndex } = this.props
    return (
      <div className="clearfix insights-section">
        <div>
          <Tabs
            tabIndex={tabIndex}
            tabsData={tabsData}
            showOptions={false}
            parentMethod={this.switchTab}
          />
        </div>
        {graphData && graphData.arr.length > 0 ? (
          _.has(this.props, 'modifyDataLabels') ? (
            <InsightsChart
              graphData={graphData}
              xPoints={xPoints}
              modifyDataLabels={this.props.modifyDataLabels}
              config={this.props.config}
            />
          ) : (
            <InsightsChart
              graphData={graphData}
              xPoints={xPoints}
              config={this.props.config}
            />
          )
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    customizations: _.isEmpty(state.epCustomizations)
      ? null
      : state.epCustomizations,
  }
}

export default connect(mapStateToProps, {})(InsightsWrap)
