import WxPay from 'wechatpay-node-v3'
import fs from 'fs'
import { MD5 } from './util'
import dayjs from 'dayjs'
import path from 'path'
const appid = process.env.wxAppId
const mchid = process.env.mchid
const APIV3Secret = process.env.APIV3Secret

const pay = new WxPay({
  appid,
  mchid,
  key: APIV3Secret,
  publicKey: fs.readFileSync(
    path.join(__dirname, '../../cert/apiclient_cert.pem'),
  ), // 公钥
  privateKey: fs.readFileSync(
    path.join(__dirname, '../../cert/apiclient_key.pem'),
  ), // 秘钥
})

const getHeader = (url, params, method) => {
  const nonce_str = Math.random()
    .toString(36)
    .substring(2, 15)
    .toLocaleUpperCase() // 随机字符串
  const timestamp = dayjs().unix().toString() // 时间戳 秒
  // 获取签名
  const signature = pay.getSignature(method, nonce_str, timestamp, url, params) // 如果是get 请求 则不需要params 参数拼接在url上 例如 /v3/pay/transactions/id/12177525012014?mchid=1230000109
  // 获取头部authorization 参数
  return pay.getAuthorization(nonce_str, timestamp, signature)
}

export default pay

export const miniPrepay = async ({
  description,
  order,
  amount,
  time_expire,
  openid,
}: {
  description: string
  order: string
  amount: number
  openid: string
  time_expire: Date
}) => {
  const params = {
    appid,
    mchid,
    description,
    time_expire,
    out_trade_no: order,
    notify_url: `https://wxapp.ngj.nkdppf.com/payment/paid/${order}/${MD5(
      order + process.env.AppSecret,
    )}`,
    amount: {
      total: amount,
    },
    payer: {
      openid,
    },
  }
  const url = '/v3/pay/transactions/jsapi'
  const Authorization = getHeader(url, params, 'POST')

  const result = await fetch(`https://api.mch.weixin.qq.com${url}`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Accept-Language': 'zh-CN',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization,
    },
  }).then(res => res.json())
  return result
}

export const sha256WithRsa = str => {
  return pay.sha256WithRsa(str)
}

export const closeWxPayOrder = async order => {
  const url = `/v3/pay/transactions/out-trade-no/${order}/close`
  const Authorization = getHeader(url, { mchid }, 'POST')
  return fetch(`https://api.mch.weixin.qq.com${url}`, {
    method: 'POST',
    body: JSON.stringify({ mchid }),
    headers: {
      'Accept-Language': 'zh-CN',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization,
    },
  })
}
