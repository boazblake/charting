import m from "mithril"
import { getStocks } from "./helpers.js"

const Input = () => {
  let symbol = mdl.symbol
  return {
    view: ({ attrs: { mdl } }) => [
      m("input[type=text]", {
        value: mdl.symbol,
        oninput: (e) => (symbol = e.target.value)
      }),
      m(
        "button",
        {
          onclick: () => {
            console.log(symbol)
            m.route(`/${symbol}`)
          }
        },
        "Get Stocks"
      )
    ],
    onremove: () => (symbol = null)
  }
}

const Chart = {
  onupdate: ({ dom, attrs: { mdl } }) => {
    Plotly.newPlot(dom, mdl.data, {
      title: mdl.symbol
    })
  },
  view: () => m(".chart", { id: "chart" })
}

const App = ({ attrs: { mdl } }) => {
  console.log(mdl)
  getStocks(mdl).fork(mdl.onError(mdl), mdl.onSuccess(mdl))

  return {
    view: () => m(".app", [m(Input, { mdl }), m(Chart, { mdl })]),
    onremove: () => (state = null)
  }
}

const routes = (mdl) => ({
  "/:symbol": {
    onmatch: ({ symbol }) => {
      mdl.symbol = symbol
    },
    render: () => m(App, { mdl })
  }
})

export { routes }
