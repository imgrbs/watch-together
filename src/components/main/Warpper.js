import React from 'react'
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap'
import styled, {injectGlobal} from 'styled-components'

import YouTube from 'react-youtube'

const YoutubePlayer = styled(YouTube)`
  min-height: 630px;
  width: 100%;
  background-color: #F6F6F6;
`

export default class Warpper extends React.Component {
  state = {
    id: '',
    idString: ''
  }

  _handleChange = ({target:{value}}) => {
    this.setState({
      idString: value
    })
  }

  _handleClick = () => {
    this.setState({
      id: this.state.idString,
      idString: ''
    })
  }

  componentWillMount() {
    injectGlobal`
      body {
        background: black;
      }
    `
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row mb-3">
          <div className="col-12">
            <YoutubePlayer
              videoId={this.state.id}
              onReady={this._onReady}
            />
          </div>
        </div>
        <div className="row">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-2 justify-content-center align-items-center">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <Button color="primary">Play</Button>
                  </InputGroupAddon>
                  <InputGroupAddon addonType="append">
                    <Button color="danger">Pause</Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div className="col-12 col-md-10">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <Button color="danger">Youtube URL</Button>
                  </InputGroupAddon>
                  <Input
                    value={this.state.idString}
                    onChange={this._handleChange}
                    placeholder="eg. https://www.youtube.com/watch?v=k_0a3Dsih3A"
                  />
                  <InputGroupAddon addonType="append">
                    <Button onClick={this._handleClick} color="primary">Watch!</Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
