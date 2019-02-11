import { Component } from 'react'
import layout from '../components/layout'
import axios from 'axios'
import { throttle } from 'throttle-debounce'

const tagStyle = {
  border: '1px solid #000',
  margin: '0 10px'
}

const activeTagStyle = {
  ...tagStyle,
  background: 'green'
}

class Index extends Component {
  state = {
    title: '',
    tags: [],
    results: [],
    suggestions: []
  }

  loadResults = throttle(300, async (title = '', tags = []) => {
    const res = await axios.get(`/api/search?keyword=${title}&tags=${tags.filter(x => x.active).map(x => x.tag).join(',')}`)
    try {
      const results = res.data.hits.hits.map(x => {
        return {
          ...x._source,
          _id: x._id
        }
      })
      this.setState({
        results
      })
    } catch (e) {
      console.log(e)
    }
  })

  loadSuggestions = throttle(300, async (text) => {
    if (!text) {
      this.setState({
        suggestions: [],
      })
      return
    }
    const res = await axios.get(`/api/title_suggest/${text}`)
    try {
      const suggestions = res.data.suggest.titles[0].options
        .map((x) => x.text)
        .filter((value, index, self) => self.indexOf(value) === index)
      this.setState({
        suggestions
      })
    } catch (e) {
      console.log(e)
    }
  })

  async componentDidMount() {
    this.loadResults()
    const res = await axios.get('/api/tags')
    try {
      const tags = res.data.aggregations.tags.buckets.map(x => {
        return {
          tag: x.key,
          active: false
        }
      })
      this.setState({
        tags,
      })
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { title, tags, results, suggestions } = this.state
    return (<div>
      <input
        value={title}
        placeholder="标题"
        onChange={(e) => {
          this.setState({ title: e.target.value })
          this.loadResults(e.target.value, tags)
          this.loadSuggestions(e.target.value)
        }}
      />
      {(!!suggestions.length) && (<ul style={{ border: '1px solid #000' }}>
        {suggestions.map(x => (<li
          onClick={() => this.setState({
            suggestions: [],
            title: x
          })}
          key={x}
          style={{ borderBottom: '1px solid #000' }}
        >{x}</li>))}
      </ul>)}
      <br />
      {tags.map(({ active, tag }, index) => (<a
        key={tag}
        style={active ? activeTagStyle : tagStyle}
        onClick={() => {
          const newTags = [...tags]
          newTags[index] = {
            active: !active,
            tag
          }
          this.setState({ tags: newTags })
          this.loadResults(title, newTags)
        }}
      >{tag}</a>))}
      <hr />
      <ul>
        {results.map(({ title = '', tags = [], _id }) => (<li key={_id}>
          <h2>标题：{title}</h2>
          <p>标签：{tags.join(',')}</p>
        </li>))}
      </ul>
    </div>)
  }
}


export default layout(Index)