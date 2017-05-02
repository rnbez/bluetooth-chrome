import 'tachyons'
import './Connected.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'


class Connected extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ssid: null,
      psk: null,
    }
  }

  render() {
    const { ssid, psk } = this.state
    const { deviceId, deviceName, isConnected } = this.props
    const handleWriteClick = this.props.onWrite
    const statusMessage = isConnected ? 'Connected' : 'Not Connected'
    const headerClass = classNames(
      'tl ph4 pv4',
      {
        'bg-eggshell-blue': isConnected,
        'bg-sunday': !isConnected,
      }
    )

    const statusClass = classNames(
      'tc f3 fw3 mv3',
      {
        'fc-eggshell-blue': isConnected,
        'fc-sunday': !isConnected,
      }
    )

    return (
      <div>
        <header className={headerClass}>
          <h1 className="f2 f2-m f1-l fw4 black-90 mv3">
            {deviceName}
          </h1>
          <h2 className="f5 f4-m f3-l fw4 black-50 mt0 lh-copy">
            {deviceId}
          </h2>
        </header>

        <div className="pa4-l">
          <form className="mw7 center pa4 br2-ns ba b--black-10">
            <fieldset className="cf bn ma0 pa0">
              <legend className="pa0 f5 f4-ns mb3 black-80">
                <h1 className="f6 fw6 ttu tracked black-60">Configuration</h1>
              </legend>
              <div className="cf">
                <label className="clip" htmlFor="ssid">
                  Network SSID
                </label>
                <input
                  className="mv2 f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns"
                  placeholder="Network SSID"
                  id="ssid"
                  type="text"
                  name="ssid"
                  value={ssid || ''}
                  onChange={e => this.setState({ ssid: e.target.value })}
                />
                <label className="clip" htmlFor="psk">
                  Password
                </label>
                <input
                  className="mv2 f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns"
                  placeholder="Password"
                  id="psk"
                  type="password"
                  name="psk"
                  value={psk || ''}
                  onChange={e => this.setState({ psk: e.target.value })}
                />
                <input
                  className="f6 f5-l button-reset fl pv3 mv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"
                  type="button"
                  value="Send"
                  onClick={() =>
                    handleWriteClick(JSON.stringify({ ssid, psk }))}
                />
              </div>
            </fieldset>
          </form>
        </div>

        <h2 className={statusClass}>{statusMessage}</h2>
      </div>
    )
  }
}

Connected.propTypes = {
  deviceId: PropTypes.string.isRequired,
  deviceName: PropTypes.string.isRequired,
  isConnected: PropTypes.bool,
  onWrite: PropTypes.func.isRequired,
}

export default Connected
