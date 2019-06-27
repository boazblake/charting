import m from "mithril"
import Task from "data.task"
import { apikey } from "../.secrets.js"

const log = (m) => (v) => {
  console.log(m, v)
  return v
}

const url = (symbol) =>
  `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${symbol}&apikey=${apikey}`

const http = (url) => m.request({ url })
const httpTask = (url) => new Task((rej, res) => http(url).then(res, rej))

const state = {
  profile: ""
}

const Model = { httpTask, log, url, state }

export default Model
