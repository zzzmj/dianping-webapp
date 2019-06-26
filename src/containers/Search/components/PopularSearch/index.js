import React, { Component } from 'react'
import './style.css'

class PopularSearch extends Component {
    shouldComponentUpdate(preProps, preState) {
        // 流行关键词已经加载了就不必再重绘
        if (this.props.data.length > 0) {
            return false
        } else {
            return true
        }
    }

    render() {
        const { data } = this.props
        return (
            <div className="popularSearch">
                {data.map(item => {
                    return (
                        <span
                            key={item.id}
                            className="popularSearch__item"
                            onClick={this.handleClickKeywords.bind(this, item.id)}
                        >
                            {item.keyword}
                        </span>
                    )
                })}
            </div>
        )
    }

    handleClickKeywords = (id) => {
        this.props.onClickKeyword(id)
    }
}

export default PopularSearch
