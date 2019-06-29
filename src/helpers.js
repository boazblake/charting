import { compose, filter, map, pluck, prop, props, test } from "ramda"

const catagories = ["open", "high", "low", "close"]

const openData = (cats) => pluck(cats[0])
const highData = (cats) => pluck(cats[1])
const lowData = (cats) => pluck(cats[2])
const closeData = (cats) => pluck(cats[3])

const fromDto = (cats) => (dto) => {
  let xaxis = pluck("date", dto)
  let data = [
    openData(cats)(dto),
    highData(cats)(dto),
    lowData(cats)(dto),
    closeData(cats)(dto)
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

const toChartModel = (cats) =>
  compose(
    toTraces(cats),
    fromDto(cats)
  )

const getStocks = (mdl) =>
  mdl.http(mdl.url(mdl.state.symbol)).then(toChartModel(catagories))

const getProps = map(props(["name", "symbol"]))
const toObj = ([name, symbol]) => ({ name, symbol })

const toInputModel = compose(
  map(toObj),
  getProps
)

const load = (mdl) => mdl.http(mdl.searchUrl).then(toInputModel)

const testReg = (str) => new RegExp(/str/i)

const by = (query) =>
  compose(
    test(new RegExp(query, "i")),
    prop("name")
  )

const filterBy = (xs, symbol) => filter(by(symbol), xs)

export { getStocks, load, filterBy }
