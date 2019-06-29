import m from "mithril"
import { getStocks, load, filterBy } from "./helpers.js"

const Errors = ({ attrs: { mdl } }) => {
  let err = mdl.state.errors.message
  return {
    view: () => m("code.error", err)
  }
}

const SymbolList = () => {
  return {
    view: ({ attrs: { symbols, selectSymbol } }) =>
      m(
        ".symbolsList",
        symbols.map(({ symbol, name }) =>
          m(".symbol", { onclick: (e) => selectSymbol(symbol) }, name)
        )
      )
  }
}

const Search = ({ attrs: { mdl } }) => {
  let symbol = mdl.state.symbol
  let symbols = []
  let showList = false

  const onError = (mdl) => (error) => {
    mdl.state.errors = error
    mdl.state.symbols = undefined
  }

  const onSuccess = (mdl) => (data) => {
    mdl.state.symbols = data
    mdl.state.errors = undefined
  }

  const selectSymbol = (value) => {
    showList = false
    symbol = value
    mdl.state.symbol = symbol
    showList = false
    m.route.set(`/${mdl.state.symbol}`, { replace: true })
  }

  return {
    oninit: ({ attrs: { mdl } }) =>
      load(mdl).then(onSuccess(mdl), onError(mdl)),
    view: ({ attrs: { mdl } }) =>
      m(".searchContainer", [
        m(".inputContainer", [
          m("input[type=text].input", {
            value: symbol,
            oninput: (e) => {
              showList = true
              symbol = e.target.value.toUpperCase()
              symbols = filterBy(mdl.state.symbols, symbol)
            }
          }),
          m(
            "button.btn",
            {
              onclick: () => {
                mdl.state.symbol = symbol
                showList = false
                m.route.set(`/${mdl.state.symbol}`)
              }
            },
            "Get Stocks"
          )
        ]),
        showList && m(SymbolList, { symbols, selectSymbol })
      ])
  }
}

const Chart = () => {
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
  const onError = (errors) => {
    mdl.state.errors = errors
    mdl.state.data = undefined
  }

  const onSuccess = (data) => {
    mdl.state.errors = undefined
    mdl.state.data = data
  }

  return {
    oninit: ({ attrs: { key } }) => {
      mdl.state.symbol = key
      getStocks(mdl).then(onSuccess, onError)
    },
    view: () =>
      m(
        ".app",
        m(Search, { mdl }),
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
