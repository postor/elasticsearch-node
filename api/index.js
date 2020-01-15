const { Router } = require('express')
const { json } = require('body-parser')
const elasticsearch = require('elasticsearch')

const config = getConfig()

const client = new elasticsearch.Client(config)

const index = 'myzhindex3'
// const type = 'mytype3'

/**
 * 准备index和mapping
 */
module.exports.init = async () => {
  if (!await client.indices.exists({ index })) {
    //1. create index
    await client.indices.create({ index })
    //2. mapping
    await client.indices.putMapping({
      index,
      // type,
      body: {
        properties: {
          title: {
            type: 'text',
            analyzer: "smartcn",
          },
          titleac: {
            type: 'completion',
          },
          tags: {
            type: 'keyword',
          },
          tagac: {
            type: 'completion',
          }
        }
      }
    })
  }
}

const r = new Router()

//更新
r.put('/:id', (req, res) => {
  res.json({ type: 'update', id: req.params.id })

})

//删除
r.delete('/:id', (req, res) => {
  res.json({ type: 'delete', id: req.params.id })

})

//搜索
r.get('/search', async (req, res) => {
  const keyword = (req.query.keyword || '').trim()
  const tags = (req.query.tags || '').trim()

  const body = {
    //_source: false
  }
  if (keyword || tags) {
    body.query = {
      bool: {
        must: []
      }
    }
    keyword && (body.query.bool.must.push({
      match: {
        title: keyword,
      },
    }))

    tags && (() => {
      tags.split(',').map(x => x.trim()).filter(x => x).forEach(x => {
        body.query.bool.must.push({
          term: {
            tags: x,
          },
        })
      })
    })()
  }
  const rtn = await client.search({
    index,
    body,

  })

  res.json(rtn)

})


r.get('/tag_suggest/:tag', async (req, res) => {
  const tag = (req.params.tag || '').trim()
  const rtn = await client.search({
    index,
    body: {
      suggest: {
        tags: {
          prefix: tag,
          completion: {
            field: 'tagac'
          }
        }
      },
      _source: false
    }
  })
  res.json(rtn)
})

r.get('/title_suggest/:title', async (req, res) => {
  const title = (req.params.title || '').trim()
  const rtn = await client.search({
    index,
    body: {
      suggest: {
        titles: {
          prefix: title,
          completion: {
            field: 'titleac'
          }
        }
      },
      _source: false
    }
  })
  res.json(rtn)
})

r.get('/tags', async (req, res) => {
  const rtn = await client.search({
    index,
    body: {
      aggs: {
        tags: {
          terms: {
            field: 'tags'
          }
        }
      },
      _source: false
    }
  })
  res.json(rtn)
})

r.use(json())
//创建
r.post('/', async (req, res) => {
  const rtn = await client.index({
    index,
    type,
    body: req.body,
  })
  res.json(rtn)
})

module.exports.router = r

function getConfig() {
  if (require('fs').existsSync(require('path').join(__dirname, '..', 'config.js'))) {
    return require('../config')
  }
  return {
    host: process.env.ES_HOST || 'localhost:9200',
    log: process.env.ES_LOG || 'trace'
  }
}