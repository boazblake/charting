import m from "mithril"
import { getStocks } from "./helpers.js"

const Errors = {
  view: ({ attrs: { mdl } }) =>
    m("code", JSON.stringify(mdl.state.errors, null, 2))
}

const Input = ({ attrs: { mdl } }) => {
  let symbol = mdl.state.symbol

  return {
    view: ({ attrs: { mdl } }) =>
      m("", [
        m("input[type=text]", {
          value: symbol,
          oninput: (e) => {
            mdl.state.data = undefined
            mdl.state.errors = undefined
            symbol = e.target.value.toUpperCase()
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
    mdl.state.data = undefined
  }
  const onSuccess = (data) => {
    console.log(mdl.state)
    mdl.state.errors = undefined
    mdl.state.data = data
  }

  console.log("app again")
  return {
    oninit: ({ attrs: { key } }) => {
      mdl.state.symbol = key
      getStocks(mdl).fork(onError, onSuccess)
    },
    view: () =>
      m(
        ".app",
        m(Input, { mdl }),
        mdl.state.data && m(Chart, { mdl }),
        mdl.state.errors && m(Errors, { mdl })
      )
  }
}

export const routes = (mdl) => {
  return {
    "/:key": App(mdl)
  }
}
