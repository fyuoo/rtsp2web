var videoStream = require('./rtsp2web/videoStream')
const ws = require('ws')
const url = require('url')
const querystring = require('querystring')

const wsServer = new ws.Server({
  port:9999
})

wsServer.on('connection', (client, request) => {
  const _url = url.parse(request.url)
  const _query = _url.query
  // const options = querystring.parse(_query)

  const rtsp = _query.substr(4, _query.length - 4)
  const stream = new videoStream(client, {
    name: rtsp,
    streamUrl: rtsp,
    ffmpegOptions: { // options ffmpeg flags
      '-stats': '' // an option with no neccessary value uses a blank string
    }
  })

  stream.on('exitWithError', () => {
    console.log(`${rtsp} transcode process exception`)
  });

  client.on('close', () => {
     console.log(`${rtsp} disconnect`)
     stream.stop()
  })
})

