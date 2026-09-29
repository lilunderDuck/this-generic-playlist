const predefinedLabels = {
  debug: "#525eff",
  timing: "#25cbbe",
  early: "#dd6e29"
}

const BASE_STYLE = "color: #11111b; padding-inline: 5px; border-radius: 6px; font-weight: bold"

export function duckDotLog(...something: any[]) {
  console.log(`%cduck%c`, `${BASE_STYLE};background-color: #ebb748`, "", ...something)
}

export function duckDotLogWithLabel(label: keyof typeof predefinedLabels, ...something: any[]) {
  console.log(
    `%cduck%c %c${label}%c`, 
    `${BASE_STYLE};background-color: #ebb748`, "",
    `${BASE_STYLE};background-color: ${predefinedLabels[label]}`, "", 
    ...something
  )
}

export function duckBeginTimer(...something: any[]) {
  const startTime = Date.now()
  console.group(
    `%cduck%c %ctiming%c`, 
    `${BASE_STYLE};background-color: #ebb748`, "",
    `${BASE_STYLE};background-color: ${predefinedLabels.timing}`, "", 
    ...something
  )

  return () => {
    console.groupEnd()
    console.log(
      `%cduck%c %ctiming%c`, 
      `${BASE_STYLE};background-color: #ebb748`, "",
      `${BASE_STYLE};background-color: ${predefinedLabels.timing}`, "", 
      'finished in',
      Date.now() - startTime, 
      "miliseconds"
    )
  }
}