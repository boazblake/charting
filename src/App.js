import m from "mithril"
import { prop, pluck, compose } from "ramda"

const getStocks = (mdl) => (state) =>
  mdl
    .httpTask(mdl.url(state.company))
    .map(prop("Monthly Adjusted Time Series"))
    .map(toViewModel(catagories))

const Input = ({ attrs: { state, update } }) => {
  let company = state.company

  return {
    view: ({ attrs: { update } }) =>
      m("", [
        m("input[type=text]", {
          value: company,
          oninput: (e) => {
            company = e.target.value
          }
        }),
        m(
          "button",
          {
            onclick: () => {
              console.log("input", company)
              update(company)
            }
          },
          "Get Stocks"
        )
      ])
  }
  onremove: () => (company = null)
}

const Chart = {
  onupdate: ({ dom, attrs: { mdl, state } }) => {
    console.log(state.data)
    Plotly.newPlot(dom, state.data, {
      title: state.company
    })
  },
  view: () => m(".chart", { id: "chart" })
}

const catagories = [
  "1. open",
  "2. high",
  "3. low",
  "4. close",
  "5. adjusted close",
  "6. volume",
  "7. dividend amount"
]

const openData = (cats) => pluck(cats[0])
const highData = (cats) => pluck(cats[1])
const lowData = (cats) => pluck(cats[2])
const closeData = (cats) => pluck(cats[3])
const adjustedData = (cats) => pluck(cats[4])
const volumeData = (cats) => pluck(cats[5])
const amountData = (cats) => pluck(cats[6])

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
    volumeData(cats)(ys),
    amountData(cats)(ys)
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

const App = ({ attrs: { mdl } }) => {
  const onError = (state) => (errors) => (state.errors = errors)
  const onSuccess = (state) => (data) => (state.data = data)

  const state = {
    company: "MSFT",
    data: [],
    errors: []
  }

  getStocks(mdl)(state).fork(onError(state), onSuccess(state))

  const updateCompany = (s) => (company) => {
    s.company = company
    getStocks(mdl)(s).fork(onError(s), onSuccess(s))
  }

  return {
    view: () =>
      m(".app", [
        m(Input, { mdl, state, update: updateCompany(state) }),
        m(Chart, { mdl, state })
      ])
  }
}

export default App
