import m from "mithril"
import { getStocks, load, filterBy } from "./helpers.js"

const Errors = {
  view: ({ attrs: { mdl } }) =>
    m(
      "code",
      JSON.stringify(mdl.state.errors || mdl.state.searchError, null, 2)
    )
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
    mdl.state.searchError = error
    mdl.state.symbols = undefined
    console.log("eer searching", mdl.state)
  }

  const onSuccess = (mdl) => (data) => {
    mdl.state.symbols = data
    mdl.state.searchError = undefined
  }

  const selectSymbol = (value) => {
    showList = false
    symbol = value
    mdl.state.symbol = symbol
    showList = false
    m.route.set(`/${mdl.state.symbol}`)
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
              mdl.state.data = undefined
              mdl.state.errors = undefined
              symbol = e.target.value.toUpperCase()
              symbols = filterBy(mdl.state.symbols, symbol)
            }
          })
        ]),
        showList && m(SymbolList, { symbols, selectSymbol })
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
