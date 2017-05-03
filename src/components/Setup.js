import 'tachyons'
import './color-theme.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { DoubleBounce } from 'better-react-spinkit'

class Setup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ssid: null,
      psk: null,
      isLoading: false,
    }
  }

  render() {
    const { ssid, psk, isLoading } = this.state
    const { deviceName, isConnected } = this.props
    const handleWriteClick = this.props.onWrite
    const headerClass = classNames('tl ph4 pv4', {
      'bg-eggshell-blue': isConnected && !isLoading,
      'bg-sunday': !isConnected && !isLoading,
      'bg-light-silver': isLoading,
    })

    return (
      <div>
        <header className={headerClass}>
          <h1 className="tc white f2-m f1-l fw6 mv3">
            {deviceName}
          </h1>
        </header>
        {isLoading
          ? <div className="flex justify-center mt6 mt6-l">
            <DoubleBounce color="#aaaaaa" size={200} />
          </div>
          : <div className="pa4-l mv4">
            <form className="mw7 center pa4">
              <fieldset className="cf bn ma0 pa0">
                <legend className="pa0 f5 f4-ns mb3 black-80">
                  <h1 className="f6 fw6 ttu tracked black-60">
                      Configuration
                    </h1>
                </legend>
                <div className="cf">
                  <label className="clip" htmlFor="ssid">
                      Network SSID
                    </label>
                  <input
                    className="mv2 f6 f5-l input-reset fl black-80 bg-white pa3 lh-solid w-100 ba br1"
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
                    className="mv2 f6 f5-l input-reset fl black-80 bg-white pa3 lh-solid w-100 ba br1"
                    placeholder="Password"
                    id="psk"
                    type="password"
                    name="psk"
                    value={psk || ''}
                    onChange={e => this.setState({ psk: e.target.value })}
                    />
                  <input
                    className="f6 f5-l button-reset fl pv3 mv3 tc bn bg-black-80 white pointer w-100 ba br1 grow"
                    type="button"
                    value="Send"
                    onClick={() => {
                      handleWriteClick(JSON.stringify({ ssid, psk }))
                      this.setState({
                        isLoading: true,
                      })
                    }}
                    />
                </div>
              </fieldset>
            </form>
          </div>}
      </div>
    )
  }
}

Setup.propTypes = {
  deviceName: PropTypes.string.isRequired,
  isConnected: PropTypes.bool,
  onWrite: PropTypes.func.isRequired,
}

export default Setup
