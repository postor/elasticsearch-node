const elasticsearch = require('elasticsearch')
const config = require('../config')
const client = new elasticsearch.Client(config)


  ; (async () => {
    try {
      const index = 'myzhindex'
      if (!await client.indices.exists({ index })) {
        console.log('trying to create!')
        await client.indices.create({ index })
        //2. mapping
        await client.indices.putMapping({
          index,
          type: 'mytype',
          body: {
            properties: {
              title: {
                type: 'text',
                analyzer: "smartcn"
              },
              tags: {
                type: 'completion',
                analyzer: 'keyword'
              }
            }
          }
        });

      }
      const testExists = {
        index,
        type: 'mytype',
        id: '3',
      }
      const testData = {
        ...testExists,
        body: {
          title: 'hello',
          tags: ['y1', 'x1'],
          published: true,
          published_at: '2013-01-01',
          counter: 1
        }
      }

      if (!await client.exists(testExists)) {
        client.create(testData)
      }

      const response = await client.search({
        index,
        body: {
          query: {
            match: {
              tags: 'x',
            },
          }
        },
      })

      console.log({ response })
    } catch (e) {
      console.log(e)
    }
  })()

