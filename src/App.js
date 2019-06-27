import m from "mithril"
import { getStocks } from "./helpers.js"

const Input = ({ attrs: { state } }) => {
  let company = state.company

  return {
    view: ({ attrs: { update } }) =>
      m("", [
        m("input[type=text]", {
          value: company,
          oninput: (e) => (company = e.target.value)
        }),
        m(
          "button",
          {
            onclick: () => update(company)
          },
          "Get Stocks"
        )
      ]),
    onremove: () => (company = null)
  }
}

const Chart = {
  onupdate: ({ dom, attrs: { mdl, state } }) => {
    Plotly.newPlot(dom, state.data, {
      title: state.company
    })
  },
  view: () => m(".chart", { id: "chart" })
}

const App = ({ attrs: { mdl } }) => {
  let state = {
    company: "MSFT",
    data: [],
    errors: []
  }

  const onError = (state) => (errors) => (state.errors = errors)
  const onSuccess = (state) => (data) => (state.data = data)

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
      ]),
    onremove: () => (state = null)
  }
}

export default App
