# elasticsearch-node-example

node使用es的一个例子，包含了，自动提示、文本检索和标签搜索 | a es with node example, conatains auto hint, text search and tag search

## 启动 | start service

前提：node、npm环境，elasticsearch服务（如果使用中文，需安装ES中文支持 https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-smartcn.html）

prerequisites: node, npm and elasticsearch

```
git clone https://github.com/postor/elasticsearch-node.git
cd elasticsearch-node
cp config-example.js config.js
vi config.js #调整你的elasticsearch服务配置并保存
npm i
npm run dev
```

启动后会提示打开 http://localhost:3000/ 即可使用

## 使用

![screenshot](./screenshot.gif)