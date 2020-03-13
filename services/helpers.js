import noty from 'noty'
import { sectionUnderscoreEntities } from '../config/sections'
import { sectionUnderscore } from '../components/Constants/UniversalMapping'

var set = false
export function notification(
  message,
  type = 'success',
  timeout = 3000,
  options = {}
) {
  if (!set) {
    set = true
    var n = noty({
      type: type,
      text: message,
      layout: 'topRight',
      theme: 'relax',
      maxVisible: 1,
      animation: {
        open: { height: 'toggle' },
        close: { height: 'toggle' },
        easing: 'swing',
        speed: 500,
      },
    })
    setTimeout(() => {
      n.close()
      set = false
    }, timeout)
    document
      .getElementById('noty_topRight_layout_container')
      .setAttribute('aria-live', 'rude')
  }
}

export function checkIfEmpty(sectionCurrentIndexData, sectionName) {
  for (let i in sectionUnderscoreEntities[sectionName]) {
    if (
      sectionCurrentIndexData[
        sectionUnderscoreEntities[sectionName][i]
      ].trim() !== ''
    )
      return false
  }
  return true
}
export function similar_text_array(
  options,
  filter,
  function_data,
  function_mapping,
  jobFuncs
) {
  if (!filter) {
    return options
  }

  filter = filter.toLowerCase()
  var values = []
  var matched = []
  var retOptions = []
  var pos = -1
  var present = 0
  for (var i = 0; i < options.length; i++) {
    var label = options[i]['label'].toLowerCase()
    var value = options[i]['value'].toLowerCase()
    if (present !== 1 && label === filter) {
      present = 1
    }
    pos = label.search(filter)
    if (pos >= 0) {
      values.push([options[i]])
      matched.push(options[i]['value'])
    }
  }

  values.sort(function(a, b) {
    var nameA = a[0].label.toLowerCase(),
      nameB = b[0].label.toLowerCase()
    if (nameA < nameB)
      //sort string ascending
      return -1
    if (nameA > nameB) return 1
    return 0 //default return value (no sorting)
  })

  var tagsMatch = []
  var match = 0
  var tags = Object.keys(function_data)

  for (var j = 0; j < tags.length; j++) {
    match = similar_text_strings(filter, tags[j])
    if (match > 90) {
      var all = function_data[tags[j]]
      for (var k = 0; k < all.length; k++) {
        if (matched.indexOf(all[k]) === -1) {
          var functionPresent = all[k]
          // if(function_mapping[functionPresent]) {
          //   functionPresent = function_mapping[functionPresent]
          // }
          // var label = tags[j]+"***"+functionPresent
          // var value = all[k]+"***"+tags[j]

          let label = function_mapping[functionPresent]
          let value = functionPresent

          if (_.indexOf(jobFuncs, functionPresent) === -1) {
            tagsMatch.push([{ label: label, value: value }])
            matched.push(value)
          }
        }
      }
    }
  }

  tagsMatch.sort(function(a, b) {
    var nameA = a[0].label.toLowerCase(),
      nameB = b[0].label.toLowerCase()
    if (nameA < nameB)
      //sort string ascending
      return -1
    if (nameA > nameB) return 1
    return 0 //default return value (no sorting)
  })

  var ret = []

  for (var i = 0; i < values.length; i++) {
    ret.push(values[i][0])
  }

  for (var i = 0; i < tagsMatch.length; i++) {
    ret.push(tagsMatch[i][0])
  }

  return ret
}

function similar_text_strings(first, second) {
  second = second.toLowerCase()
  if (second.search(first) === 0) {
    return 300
  }
  var secondOrigin = second
  first = first.split(' ')
  second = second.split(' ')
  var value = 0
  var score = 0
  for (var i = first.length - 1; i >= 0; i--) {
    var max = 0
    for (var j = second.length - 1; j >= 0; j--) {
      score = similar_text(first[i], second[j], true)
      if (max < score) {
        max = score
      }
    }
    if (max < 60) {
      max = 0
    } else if (max > 95) {
      max = max * 2
    } else if (max > 75) {
      max = max * 1.5
    }
    value += max
    var secondLength = second.length
    var firstLength = first.length
    if (secondLength > firstLength) {
      value = value - (secondLength - firstLength) * 10
    }
  }
  return value
}

function similar_text(first, second, percent) {
  if (
    first === null ||
    second === null ||
    typeof first === 'undefined' ||
    typeof second === 'undefined'
  ) {
    return 0
  }
  // secondSplit = secondSplit.length
  first += ''
  second += ''
  var pos1 = 0
  var pos2 = 0
  var max = 0
  var firstLength = first.length
  var secondLength = second.length
  var p
  var q
  var l
  var sum
  for (p = 0; p < firstLength; p++) {
    for (q = 0; q < secondLength; q++) {
      for (
        l = 0;
        p + l < firstLength &&
        q + l < secondLength &&
        first.charAt(p + l) === second.charAt(q + l);
        l++
      );
      if (l > max) {
        max = l
        pos1 = p
        pos2 = q
      }
    }
  }
  sum = max
  if (sum) {
    if (pos1 && pos2) {
      sum += similar_text(first.substr(0, pos1), second.substr(0, pos2))
    }
    if (pos1 + max < firstLength && pos2 + max < secondLength) {
      sum += similar_text(
        first.substr(pos1 + max, firstLength - pos1 - max),
        second.substr(pos2 + max, secondLength - pos2 - max)
      )
    }
  }
  if (!percent) {
    return sum
  }
  // secondLength = secondLength/secondSplit
  return (sum * 200) / (firstLength + secondLength)
}

export function generateUrl(
  fetchId = -1,
  page = 'summary',
  section = '',
  hashAvailable = false
) {
  let url = `${process.env.APP_BASE_URL}${fetchId}/feedback/${page}`
  if (!_.isEmpty(section)) {
    let hash = hashAvailable
      ? section
      : _.isUndefined(sectionUnderscore[section])
      ? section
      : `#${sectionUnderscore[section]}`
    url = `${url}${hash}`
  }
  return url
}

export function checkLinkedinUrlSanity(text) {
  // update the list in aspire modules as Str helpers
  let pattern = new RegExp(/[ -,\.-\/\:-@\[-\`\{-\}]/)
  return !pattern.test(text)
}
