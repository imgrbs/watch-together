import React from 'react'
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap'
import styled, {injectGlobal} from 'styled-components'
import socket from '../../utils/socket'
import YouTube from 'react-youtube'

const YoutubePlayer = styled(YouTube)`
  min-height: 630px;
  width: 100%;
  background-color: #F6F6F6;
`

export default class Warpper extends React.Component {
  state = {
    video: {},
    id: '',
    idString: '',
    action: 'pause'
  }

  _handleChange = ({target:{value}}) => {
    let id = value.substring(value.indexOf('=')+1, value.length)
    this.setState({
      idString: id
    })
  }

  _handleClick = async () => {
    let id = await this.state.idString
    socket.emit('video', {id: id})
    this.setState({
      idString: ''
    })
  }
  
  _handleVideo = async (action) => {
    socket.emit('action', {action: action})
  }

  _onReady = ({target}) => {
    this.setState({
      video: target
    })
  }

  _stateChange = ({data}) => {
    if (data === 1) {
      this._handleVideo('play')
    } else {
      this._handleVideo('pause')
    }
  }

  componentWillMount() {
    injectGlobal`
      body {
        background: black;
      }
    `
  }

  componentDidMount() {
    socket.on('video',({id}) => {
      this.setState({
        id: id
      })
    })
    
    socket.on('action',({action}) => {
      this.setState({
        action: action
      })
      this._handleAction(action)
    })
  }

  _handleAction = (action) => {
    switch (action) {
      case 'play':
        this.state.video.playVideo()
        break
      default:
        this.state.video.pauseVideo()
        break
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row mb-3">
          <div className="col-12">
            <YoutubePlayer
              videoId={this.state.id}
              onReady={this._onReady}
              onStateChange={this._stateChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-2 justify-content-center align-items-center">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <Button onClick={() => this._handleVideo('play')} color="primary">Play</Button>
                  </InputGroupAddon>
                  <InputGroupAddon addonType="append">
                    <Button onClick={() => this._handleVideo('pause')} color="danger">Pause</Button>
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
