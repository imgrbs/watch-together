import React from 'react'
import styled, {injectGlobal} from 'styled-components'
import YouTube from 'react-youtube'

import socket from '../../utils/socket'

import InputGroup from './InputGroup'

const YoutubePlayer = styled(YouTube)`
  min-height: 630px;
  width: 100%;
  background-color: #F6F6F6;
`

export default class Warpper extends React.Component {
  state = {
    room: 'default',
    join: false,
    video: {},
    id: '',
    idString: '',
    status: 0
  }

  _handleChange = ({target: {value}}) => {
    this.setState({
      idString: value
    })
  }

  _handleRoom = ({target: {value}}) => {
    this.setState({
      room: value
    })
  }

  _handleJoin = async () => {
    await window.localStorage.setItem('room', this.state.room)
    this.setState({
      join: true
    })
    window.location.reload()
  }

  convertUrl = (value) => value.substring(value.indexOf('=') + 1, value.length)

  _handleClick = async () => {
    let id = await this.convertUrl(this.state.idString)
    socket.emit('video', {
      room: this.state.room,
      id: id
    })
    this.setState({
      idString: ''
    })
  }

  _onReady = ({target}) => {
    this.setState({
      video: target
    })
  }

  _stateChange = async ({data}) => {
    console.log(this.state.video.getPlayerState())
    if (this.state.status !== this.state.video.getPlayerState()) {
      switch (this.state.video.getPlayerState()) {
        case 1:
          this._handleVideo()
          break
        case 3:
          this._handleVideo(this.state.video.getCurrentTime())
          break
        default:
          this._handleVideo()
          break
      }
    }
  }

  _handleVideo = async (data) => {
    socket.emit(`action`, {
      room: this.state.room,
      status: this.state.video.getPlayerState(),
      time: data
    })
  }

  componentWillMount () {
    injectGlobal`
      body {
        background: black;
      }
    `
  }

  async componentDidMount () {
    const room = await window.localStorage.getItem('room') || this.state.room
    this.setState({
      room: room
    })

    socket.on(`${room}`, ({id}) => {
      this.setState({
        id: id
      })
    })

    socket.on(`action_${room}`, (data) => {
      this.setState({
        status: data.status
      })
      switch (data.status) {
        case 1:
          this.state.video.playVideo()
          break
        case 3:
          this.state.video.seekTo(data.time)
          break
        default:
          this.state.video.pauseVideo()
          break
      }
    })
  }

  render () {
    return (
      <div className='container-fluid'>
        <div className='row mb-3'>
          <div className='col-12'>
            <YoutubePlayer
              videoId={this.state.id}
              onReady={this._onReady}
              onStateChange={this._stateChange}
            />
          </div>
        </div>
        <div className='row'>
          <div className='container'>
            <div className='row'>
              <div className='col-12 mb-3 col-md-6'>
                <InputGroup
                  color={`success`}
                  name={`Room`}
                  readOnly={this.state.join}
                  state={this.state.room}
                  handleState={this._handleRoom}
                  placeholder={''}
                  handleClick={this._handleJoin}
                  btnName={`Join`}
                />
              </div>

              <div className='col-12 mb-3 col-md-6'>
                <InputGroup
                  color={`danger`}
                  name={`Youtube URL`}
                  readOnly={false}
                  state={this.state.idString}
                  handleState={this._handleChange}
                  placeholder={`eg. https://www.youtube.com/watch?v=k_0a3Dsih3A`}
                  handleClick={this._handleClick}
                  btnName={`Watch!`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
