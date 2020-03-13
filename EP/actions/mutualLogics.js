export function getAppearTxt(val) {
  if (val === false) {
    return 'Not Detected'
  } else if (val === true) {
    return 'Detected'
  } else if (val === null) {
    return null
  }
}

export function wordUsageCal(data) {
  let repetitive_words = []
  let discourse_markers = []
  let specific_words = []
  let negative_words = []
  let action_words = []

  if (data) {
    if (data.constructor === Array) {
      for (let i = 0; i < data.length; i++) {
        switch (data[i]['type']) {
          case 1:
            repetitive_words.push(data[i])
            break
          case 2:
            discourse_markers.push(data[i])
            break
          case 3:
            specific_words.push(data[i])
            break
          case 4:
            negative_words.push(data[i])
            break
          case 5:
            action_words.push(data[i])
            break
        }
      }
    }
  }

  return {
    repetitive_words,
    discourse_markers,
    specific_words,
    negative_words,
    action_words,
  }
}

export function sentCal(punctVals) {
  let greetingArray = []
  let nameArray = []
  let personalArray = []
  let educationArray = []
  let workexpArray = []
  let acheivementArray = []
  let interestArray = []
  let hobbyArray = []
  let gratitudeArray = []
  let porArray = []

  if (punctVals) {
    if (punctVals.constructor === Array) {
      for (var i = 0; i < punctVals.length; i++) {
        switch (punctVals[i].type) {
          case 1:
            greetingArray.push(punctVals[i].content)
            break
          case 2:
            nameArray.push(punctVals[i].content)
            break
          case 3:
            personalArray.push(punctVals[i].content)
            break
          case 4:
            educationArray.push(punctVals[i].content)
            break
          case 5:
            interestArray.push(punctVals[i].content)
            break
          case 6:
            workexpArray.push(punctVals[i].content)
            break
          case 7:
            acheivementArray.push(punctVals[i].content)
            break
          case 8:
            hobbyArray.push(punctVals[i].content)
            break
          case 9:
            gratitudeArray.push(punctVals[i].content)
            break
          case 10:
            porArray.push(punctVals[i].content)
            break
        }
      }
    }
  }

  return {
    greetingArray,
    nameArray,
    personalArray,
    educationArray,
    workexpArray,
    acheivementArray,
    interestArray,
    hobbyArray,
    gratitudeArray,
    porArray,
  }
}

export function disfluencyRes(data) {
  let counterD = 0,
    disfluencyRes = 0,
    gentleVals = null

  gentleVals = data
  if (gentleVals) {
    if (gentleVals.constructor === Array) {
      if (gentleVals.length < 1) {
        return { counterD, disfluencyRes }
      }

      gentleVals.map((item, index) => {
        if (item.type === 1) {
          counterD += 1
        }
      })
    }
  }

  if (counterD <= 1) {
    disfluencyRes = 0
  } else if (counterD >= 3) {
    disfluencyRes = 2
  } else {
    disfluencyRes = 1
  }

  return { counterD, disfluencyRes }
}

export function elongRes(data) {
  let counterE = 0,
    elongRes = 0,
    gentleVals = null

  gentleVals = data

  if (gentleVals) {
    if (gentleVals.constructor === Array) {
      if (gentleVals.length < 1) {
        return { counterE, elongRes }
      }

      gentleVals.map((item, index) => {
        if (item.type === 2) {
          counterE += 1
        }
      })
    }
  }

  if (counterE <= 1) {
    elongRes = 0
  } else if (counterE >= 3) {
    elongRes = 2
  } else {
    elongRes = 1
  }

  return { counterE, elongRes }
}

export let mutualLogics = {
  getAppearTxt,
  wordUsageCal,
  sentCal,
  disfluencyRes,
  elongRes,
}
