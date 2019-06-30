import o from "ospec"
import Model from "../src/Model.js"
import {
  filterBy,
  by,
  toInputModel,
  getProps,
  toObj,
  toChartModel,
  toTraces,
  fromDto,
  openData,
  highData,
  lowData,
  closeData,
  search,
  getStocks
} from "../src/helpers.js"
import { companies, pairs, symbols } from "./mock-data.js"

o.spec("helpers", () => {
  o.spec("search", () => {
    o("filterBy :: ([{ symbol, name }], letter) -> [{ symbol, name }]", () => {
      o(filterBy(symbols, "ab")).deepEquals([
        { symbol: "AABA", name: "cAa l.Itnab" }
      ])
      o(filterBy(symbols, "c")).deepEquals([
        { symbol: "A", name: "c oetgncngiTAhl.I eslenoi" },
        { symbol: "AA", name: "arCco.A pol" },
        { symbol: "AAAU", name: "s Pen doEyM lathPFitGlTich r" },
        { symbol: "AABA", name: "cAa l.Itnab" },
        { symbol: "AAC", name: ".AIn cldAs HiogCn" },
        { symbol: "AAL", name: "esi.panInnioAclimuGerr A r c" },
        { symbol: "AAMC", name: "tpsselcAoMCiorena  .mrAeu tnasteg" }
      ])
      o(filterBy(symbols, "abc")).deepEquals([])
    })
    o("by :: query -> { symbol, name } -> bool", () => {
      o(
        by("a")({ symbol: "AAMC", name: "tpsselcAoMCiorena  .mrAeu tnasteg" })
      ).equals(true)
      o(
        by("x")({ symbol: "AAMC", name: "tpsselcAoMCiorena  .mrAeu tnasteg" })
      ).equals(false)
    })
    o("getProps :: [company] -> [name, symbol]", () => {
      o(getProps(companies)).deepEquals(pairs)
    })
    o("toObj :: ([name, symbol]) -> ({ symbol, name })", () => {
      o(toObj(pairs[0])).deepEquals(symbols[0])
      o(toObj(pairs[1])).deepEquals(symbols[1])
      o(toObj(pairs[2])).deepEquals(symbols[2])
    })
    o("toInputModel :: [company] -> [{ symbol, name }]", () => {
      o(toInputModel(companies)).deepEquals(symbols)
    })
    // TODO: Need to mock http.
    // o("search :: mdl -> Promise[{}]", () => {
    //   const res = (mdl) =>
    //     new Promise(function(resolve) {
    //       setTimeout(resolve(search(mdl)), 10)
    //     })
    //   res(Model).then(
    //     (x) => console.log("succ", x),
    //     (x) => console.log("err", x)
    //   )
    // })
  })
})
