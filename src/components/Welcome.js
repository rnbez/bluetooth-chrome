import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'tachyons'

class Welcome extends Component {
  render() {
    const handleScanClick = this.props.onScan

    return (
      <div>

        <header className="tc ph4 pv4">
          <h1 className="f2 f2-m f1-l fw2 black-90 mv3">
            Connect your Raspberry Pi
          </h1>
        </header>

        <div className="ph3 tc mt7 mt9-l">
          <h1 className="f6 fw6 ttu tracked black-60">Find your device</h1>
          <a
            className="f4 link dim br2 ba ph3 pv2 mt2 dib black"
            onClick={handleScanClick}
          >
            Scan
          </a>
        </div>

      </div>
    )
  }
}
Welcome.propTypes = {
  onScan: PropTypes.func.isRequired,
}

export default Welcome
