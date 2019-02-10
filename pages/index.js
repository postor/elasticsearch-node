import { Component } from 'react'
import layout from '../components/layout'
import axios from 'axios'
import { throttle } from 'throttle-debounce'

class Index extends Component {
  state = {
    title: '',
    tags: [],
    selectedTags: [],
    results: [],
  }

  loadResults = throttle(300, async (title = '', tags = []) => {
    if (!text) {
      this.setState({
        suggestions: [],
      })
      return
    }
    const res = await axios.get(`/api/search`)
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

  async componentDidMount() {
    const res = await axios.get('/api/tags')
    try {
      const tags = res.data.aggregations.tags.buckets.map(x => x.key)
      this.setState({
        tags,
      })
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { title, tags, selectedTags, results } = this.state
    return (<div>
      <input value={title} onChange={(e) => {
        this.setState({ title: e.target.value })

      }} />
    </div>)
  }
}


export default layout(Index)