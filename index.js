require('dotenv').config();
const express = require('express');
const { createProxyMiddleware, Filter, Options, RequestHandler, responseInterceptor } = require('http-proxy-middleware');
const app = express();
const port = 3001

const deeplApiKey = process.env.DEEPL_API_KEY

const proxy = createProxyMiddleware({
  target: 'https://api-free.deepl.com',
  changeOrigin: true,
  logLevel: 'debug',
  selfHandleResponse: true,
  onProxyReq: onProxyReq = (proxyReq, req, res) => {
    proxyReq.setHeader('Authorization', `DeepL-Auth-Key ${deeplApiKey}`)
  },
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    const response = JSON.parse(responseBuffer.toString('utf8'));
    let text = response.translations[0].text
    let translations = {
      translated_text: text,
      card_names: text.match(/\b(\w+)\b/g).sort((a, b) => a.length - b.length).slice(-5)
    }
    return JSON.stringify(translations);
  }),
});


app.use('/v2/translate', proxy);

app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
