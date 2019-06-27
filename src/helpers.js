import { prop, pluck, compose } from "ramda"
import Either from "data.either"
import Task from "data.task"

const catagories = [
  "1. open",
  "2. high",
  "3. low",
  "4. close",
  "5. adjusted close",
  // "6. volume",
  "7. dividend amount"
]

const openData = (cats) => pluck(cats[0])
const highData = (cats) => pluck(cats[1])
const lowData = (cats) => pluck(cats[2])
const closeData = (cats) => pluck(cats[3])
const adjustedData = (cats) => pluck(cats[4])
const volumeData = (cats) => pluck(cats[5])
// const amountData = (cats) => pluck(cats[6])

const fromDto = (dto) => {
  let xaxis = Object.keys(dto)
  let ys = Object.values(dto)
  return { xaxis, ys }
}

const group = (cats) => ({ xaxis, ys }) => {
  let data = [
    openData(cats)(ys),
    highData(cats)(ys),
    lowData(cats)(ys),
    closeData(cats)(ys),
    adjustedData(cats)(ys),
    volumeData(cats)(ys)
    // amountData(cats)(ys)
  ]
  return { xaxis, data }
}

const colors = [
  "#34495e",
  "#8e44ad",
  "#c0392b",
  "#d35400",
  "#27ae60",
  "#f1c40f",
  "#7f8c8d"
]

const toTraces = (cats) => ({ xaxis, data }) =>
  cats.map((cat, idx) => ({
    type: "scatter",
    mode: "lines",
    name: cat,
    x: xaxis,
    y: data[idx],
    line: { color: colors[idx] }
  }))

const toViewModel = (cats) =>
  compose(
    toTraces(cats),
    group(cats),
    fromDto
  )

const parse = Either.try(prop("Monthly Adjusted Time Series"))

const eitherToTask = (x) =>
  x.cata({
    Left: (error) => Task.rejected(error),
    Right: (data) => Task.of(data)
  })

const getStocks = (mdl) =>
  mdl
    .httpTask(mdl.url(mdl.symbol))
    .map(parse)
    .chain(eitherToTask)
    .map(toViewModel(catagories))

export { getStocks }
