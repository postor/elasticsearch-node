import { Component } from 'react'
import axios from 'axios'
import layout from '../components/layout'

import { throttle } from 'throttle-debounce'

const tagStyle = {
  border: '1px solid #000',
  margin: '0 10px'
}

class Add extends Component {

  state = {
    title: '',
    suggestions: [],
    tags: [],
    tag: ''
  }

  loadSuggestions = throttle(300, async (text) => {
    if (!text) {
      this.setState({
        suggestions: [],
      })
      return
    }
    const res = await axios.get(`/api/tag_suggest/${text}`)
    try {
      const suggestions = res.data.suggest.tags[0].options
        .map((x) => x.text)
        .filter((value, index, self) => self.indexOf(value) === index)
      this.setState({
        suggestions
      })
    } catch (e) {
      console.log(e)
    }
  })


  componentDidMount() {
    const { title } = this.state
    this.loadSuggestions(title)
  }

  render() {
    const { title, tags, tag, suggestions } = this.state
    return (<div>
      <div>
        <input
          value={title}
          placeholder="标题"
          onChange={(e) => {
            this.setState({ title: e.target.value })
          }}
        />
        <hr />
        <input
          value={tag}
          placeholder="标签"
          onChange={(e) => {
            this.setState({ tag: e.target.value })
            this.loadSuggestions(e.target.value)
          }}
        />
        <button onClick={() => {
          this.setState({
            tags: [
              ...tags,
              tag
            ],
            tag: ''
          })

        }}>add</button>
        <br />
        <span>建议：</span>
        {suggestions.filter(x => !tags.includes(x)).map(x => (<a
          style={tagStyle}
          key={x}
          onClick={() => this.setState({
            tags: [...tags, x]
          })}
        >{x}</a>))}
        <br />
        <span>已选：</span>
        {tags.map(x => (<a
          style={tagStyle}
          key={x}
          onClick={() => this.setState({
            tags: tags.filter(y => y != x)
          })}
        >{x}</a>))}
        <hr />
        <button onClick={async () => {
          this.setState({
            title: '',
            tag: '',
            suggestions: [],
            tags: []
          })
          axios.post('/api/', {
            title,
            tags,
            tagac: tags,
            titleac: title,
          })
        }}>添加</button>
      </div>
    </div>)
  }
}


export default layout(Add)