import 'tachyons'
import './color-theme.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import CopyToClipboard from 'react-copy-to-clipboard'

class Connected extends Component {
  constructor(props) {
    super(props)
    this.state = {
      copied: false,
    }
  }

  render() {
    const { deviceAddress, deviceName, isConnected } = this.props
    const headerClass = classNames('tl ph4 pv4', {
      'bg-eggshell-blue': isConnected,
      'bg-sunday': !isConnected,
    })
    const statusClass = classNames('tc f1 fw6 mt6 mb5', {
      'fc-eggshell-blue': isConnected,
      'fc-sunday': !isConnected,
    })
    const copyClass = classNames('f5 link dim br2 ba ph3 pv2 mb2 dib pointer ', {
      'black-30': this.state.copied,
    })
    const statusMessage = isConnected
      ? 'WiFi configured successfly'
      : 'Configuration failed'

    let connectionSection = null
    let connectionMessage = null
    if (isConnected) {
      connectionMessage = 'ssh pi@' + deviceAddress
      connectionSection = (
        <div className="ph3 tc">
          <h1 className="f6 fw6 ttu tracked black-60">
            Connect to your device
          </h1>
          <pre className="tc f3">$ {connectionMessage}</pre>
          <CopyToClipboard
            text={connectionMessage}
            onCopy={() => this.setState({ copied: true })}
          >
            <a className={copyClass}>
              {this.state.copied ? 'Copied' : 'Copy'}
            </a>
          </CopyToClipboard>

        </div>
      )
    }
    return (
      <div>
        <header className={headerClass}>
          <h1 className="tc white f2 f2-m f1-l fw6 mv3">
            {deviceName}
          </h1>
        </header>
        <h1 className={statusClass}>{statusMessage}</h1>
        {connectionSection}
      </div>
    )
  }
}

Connected.propTypes = {
  deviceName: PropTypes.string.isRequired,
  isConnected: PropTypes.bool,
  deviceAddress: PropTypes.string,
}

export default Connected
