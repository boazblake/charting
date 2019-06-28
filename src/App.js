import m from "mithril"
import { getStocks } from "./helpers.js"

const Input = ({ attrs: { mdl } }) => {
  let symbol = mdl.state.symbol

  return {
    view: ({ attrs: { update } }) =>
      m("", [
        m("input[type=text]", {
          value: symbol,
          oninput: (e) => {
            symbol = e.target.value
          }
        }),
        m(
          "button",
          {
            onclick: () => {
              mdl.state.symbol = symbol
              m.route.set(`/${mdl.state.symbol}`)
            }
          },
          "Get Stocks"
        )
      ])
  }
}

const Chart = ({ attrs: { mdl } }) => {
  const toPlot = (dom, mdl) =>
    Plotly.newPlot(dom, mdl.state.data, {
      title: mdl.state.symbol
    })

  return {
    oncreate: ({ dom, attrs: { mdl } }) => toPlot(dom, mdl),
    view: () => m(".chart", { id: "chart" })
  }
}

const App = (mdl) => {
  console.log(mdl)
  const onError = (errors) => {
    console.log(errors)
    mdl.state.errors = errors
  }
  const onSuccess = (data) => {
    console.log(mdl.state)
    mdl.state.data = data
  }

  console.log("app again")
  return {
    oninit: ({ attrs: { key } }) => {
      mdl.state.symbol = key
      getStocks(mdl).fork(onError, onSuccess)
    },
    view: () => m(".app", m(Input, { mdl }), m(Chart, { mdl }))
  }
}

export const routes = (mdl) => {
  return {
    "/:key": App(mdl)
  }
}
