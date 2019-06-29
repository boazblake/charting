import m from "mithril"
import Task from "data.task"
import { apikey } from "../.secrets.js"
import { Stream } from "stream"

const log = (m) => (v) => {
  console.log(m, v)
  return v
}

const url = (symbol) =>
  `https://cloud.iexapis.com/stable/stock/${symbol}/chart/1y?token=${apikey}`

const searchUrl = `https://cloud.iexapis.com/stable/ref-data/symbols?token=${apikey}`

const state = {
  profile: "",
  isLoading: false,
  loadingProgress: {
    max: 0,
    value: 0
  },
  symbol: "MSFT",
  symbols: undefined,
  data: undefined,
  errors: undefined,
  searchErrors: undefined
}

function onProgress(e) {
  console.log("eeee", e)
  if (e.lengthComputable) {
    model.state.loadingProgress.max = e.total
    model.state.loadingProgress.value = e.loaded
    m.redraw()
  }
}

function onLoad() {
  return false
}

function onLoadStart() {
  model.state.isLoading = true
  return false
}
function onLoadEnd() {
  model.state.isLoading = false
  model.state.loadingProgress.max = 0
  model.state.loadingProgress.value = 0
  return false
}

const xhrProgress = {
  config: (xhr) => {
    console.log(xhr)
    xhr.onprogress = onProgress
    xhr.onload = onLoad
    xhr.onloadstart = onLoadStart
    xhr.onloadend = onLoadEnd
  }
}

const http = (url) => m.request(url, { xhrProgress })
const Model = { http, log, url, state, searchUrl }

export default Model
