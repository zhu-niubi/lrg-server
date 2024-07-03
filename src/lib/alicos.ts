import OSS from 'ali-oss'

export default function aliOSS(): OSS {
  const accessKeyId: any = process.env.accessKeyId
  const accessKeySecret: any = process.env.accessKeySecret
  const store = new OSS({
    accessKeyId,
    accessKeySecret,
    bucket: 'max-club',
    endpoint: 'https://oss-cn-shanghai.aliyuncs.com',
  })
  // store.putBucketReferer('max-club', false, [
  //   'https://servicewechat.com',
  //   'http://127.0.0.1/*',
  //   'http://localhost/*',
  //   'http://localhost:8080/*',
  //   'http://localhost:8081/*',
  //   'http://localhost:3000/*',
  //   'https://admin.mcppf.com',
  // ])
  return store
}
