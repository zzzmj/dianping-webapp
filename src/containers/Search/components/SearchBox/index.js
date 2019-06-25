import React, { Component } from 'react'
import './style.css'
const data = [
    {
        id: 1,
        keyword: '火锅',
        quantity: 8710
    },
    {
        id: 2,
        keyword: '火锅自助',
        quantity: 541
    },
    {
        id: 3,
        keyword: '火锅 三里屯',
        quantity: 65
    },
    {
        id: 4,
        keyword: '火锅 望京',
        quantity: 133
    },
    {
        id: 5,
        keyword: '火锅家常菜',
        quantity: 179
    }
]

class SearchBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: ''
        }
    }

    render() {
        const visiable = this.state.inputValue.length > 0 ? true : false

        return (
            <div className="searchBox">
                <div className="searchBox__container">
                    <input
                        className="searchBox__text"
                        value={this.state.inputValue}
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
        return (
            <ul className="searchBox__list">
                {data.map((item, index) => {
                    return (
                        <li className="searchBox__item" key={index}>
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
        this.setState({
            inputValue: e.target.value
        })
    }

    handleClear = () => {
        this.setState({
            inputValue: ''
        })
    }

    handleCancel = () => {}
}

export default SearchBox
