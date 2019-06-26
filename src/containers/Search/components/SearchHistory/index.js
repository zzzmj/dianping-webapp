import React, { Component } from 'react'
import './style.css'

class SearchHistory extends Component {
    shouldComponentUpdate(preProps, preState) {
        if (preProps.data.length !== this.props.data.length) {
            return true
        }
        return false
    }

    render() {
        const { data } = this.props
        return (
            <div className="searchHistory">
                <div className="searchHistory__header">搜索记录</div>
                <ul className="searchHistory__list">
                    {data.map((item) => {
                        return (
                            <li
                                key={item.id}
                                onClick={this.handleClick}
                                className="searchHistory__item"
                            >
                                {item.keyword}
                            </li>
                        )
                    })}
                </ul>
                <div
                    className="searchHistory__clear"
                    onClick={this.handleClear}
                >
                    清除搜索记录
                </div>
            </div>
        )
    }

    handleClick = () => {}

    handleClear = () => {
        this.props.onClaerHistory()
    }
}

export default SearchHistory
