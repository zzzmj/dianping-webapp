import React, { Component } from 'react'
import './style.css'


class SearchBox extends Component {
    render() {
        const { inputText } = this.props
        const visiable = inputText.length > 0 ? true : false
        return (
            <div className="searchBox">
                <div className="searchBox__container">
                    <input
                        className="searchBox__text"
                        value={inputText}
                        onChange={this.handleChange}
                    />
                    {visiable ? (
                        <span
                            className="searchBox__clear"
                            onClick={this.handleClear}
                        />
                    ) : null}
                    <span className="searchBox__cancel">取消</span>
                </div>
                {visiable ? this.renderSuggestList() : null}
            </div>
        )
    }

    renderSuggestList() {
        const { relatedKeywords } = this.props
        return (
            <ul className="searchBox__list">
                {relatedKeywords.map(item => {
                    return (
                        <li className="searchBox__item" key={item.id} onClick={this.handleClick.bind(this, item.id)}>
                            <span className="searchBox__itemKeyworkd">
                                {item.keyword}
                            </span>
                            <span className="searchBox__itemQuantity">
                                约{item.quantity}个结果
                            </span>
                        </li>
                    )
                })}
            </ul>
        )
    }

    handleChange = e => {
        const text = e.target.value
        this.props.onChange(text)
    }

    handleClear = () => {
        this.props.onClear()
    }

    handleClick =  (id) => {
        this.props.onClickKeyword(id)
    }

    handleCancel = () => {}
}

export default SearchBox
