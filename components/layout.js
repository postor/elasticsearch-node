import { Component } from 'react'
import Link from 'next/link'

const aStyle = {
  border: '1px solid #000',
  margin: '0 10px'
}

export default Comp => class Layout extends Component {
  render() {
    return (<div>
      <header>
        <nav>
          <Link href="/">
            <a style={aStyle}>搜索</a>
          </Link>
          <Link href="/add">
            <a style={aStyle}>新增</a>
          </Link>
        </nav>
      </header>
      <Comp {...this.props} />
      <footer>footer</footer>
    </div>)
  }
}