import React, { Component } from 'react'
import Welcome from './components/Welcome'
import Connected from './components/Connected'
const log = console.log

class App extends Component {
  static WelcomeStep = 'welcome';
  static ConnectedStep = 'connected';

  constructor(props) {
    super(props)
    this.state = {
      step: App.WelcomeStep,
      deviceInfo: null,
      echoCharacters: null,
      setupCharacteristic: null,
      stateCharacteristic: null,
    }
    // this.state = {
    //   step: App.ConnectedStep,
    //   deviceInfo: {
    //     id: '0000ec0e-0000-1000-8000-00805f9b34fb',
    //     name: 'raspberrypi',
    //   },
    // }
  }

  handleScanClick = () => {
    // this.setState({
    //   step: App.ConnectedStep,
    //   deviceInfo: {
    //     id: '0000ec0e-0000-1000-8000-00805f9b34fb',
    //     name: 'raspberrypi',
    //   },
    // })
    // log(e)
    const serviceUuid = '4095880c-f7c3-42df-9a49-8dbb7a171995'
    const stateCharacteristicUuid = '40c67dc7-ad9a-43a0-b7b5-0407e21392e6'
    const setupCharacteristicUuid = '4454c36c-92fe-45ce-a852-e483aa7998c1'
    let service = null
    log('Requesting Bluetooth Device...')
    navigator.bluetooth
      .requestDevice({ filters: [{ services: [serviceUuid] }] })
      .then(device => {
        log('> Name:             ' + device.name)
        log('> Id:               ' + device.id)
        log('> Connected:        ' + device.gatt.connected)
        this.setState({
          step: App.ConnectedStep,
          deviceInfo: {
            id: btoa(device.id),
            name: device.name,
            display: 'no info received',
          },
        })
        log('\n\nConnecting to GATT Server...')
        return device.gatt.connect()
      })
      .then(server => {
        log('Getting Service...')
        return server.getPrimaryService(serviceUuid)
      })
      .then(serv => {
        log('Getting Characteristic...')
        service = serv
        return service.getCharacteristic(setupCharacteristicUuid)
        // return service.getCharacteristics()
      })
      .then(setupCharacteristic => {
        log('> Characteristic UUID:  ' + setupCharacteristic.uuid)
        log('> Read:                 ' + setupCharacteristic.properties.read)
        log('> Write:                ' + setupCharacteristic.properties.write)
        log('> Notify:               ' + setupCharacteristic.properties.notify)
        this.setState({
          setupCharacteristic,
        })

        return service.getCharacteristic(stateCharacteristicUuid)
      })
      .then(stateCharacteristic => {
        log('> Characteristic UUID:  ' + stateCharacteristic.uuid)
        log('> Read:                 ' + stateCharacteristic.properties.read)
        log('> Write:                ' + stateCharacteristic.properties.write)
        log('> Notify:               ' + stateCharacteristic.properties.notify)

        stateCharacteristic.addEventListener(
          'characteristicvaluechanged',
          event => {
            const { deviceInfo } = this.state
            const { value } = event.target
            const decoder = new TextDecoder('utf-8')
            // log(value)
            log('Recieved value:' + decoder.decode(value))
            const state = JSON.parse(decoder.decode(value))
            this.setState({
              deviceInfo: Object.assign({}, deviceInfo, {
                isConnected: state && state.connected,
              }),
            })
          }
        )
        stateCharacteristic
          .startNotifications()
          .then(() => {
            log('> Notifications started')
          })
          .catch(error => {
            log('Argh! ' + error)
          })

        stateCharacteristic.readValue().then(value => {
          const { deviceInfo } = this.state
          const decoder = new TextDecoder('utf-8')
          // log(value)
          log('Recieved value:' + decoder.decode(value))
          const state = JSON.parse(decoder.decode(value))
          this.setState({
            deviceInfo: Object.assign({}, deviceInfo, {
              isConnected: state && state.connected,
            }),
          })
        })

        this.setState({
          stateCharacteristic,
        })
      })
      .catch(error => {
        log('Argh! ' + error)
      })
  };

  handleWriteClick = value => {
    const { setupCharacteristic } = this.state
    log(value)
    const encoder = new TextEncoder('utf-8')
    setupCharacteristic
      .writeValue(encoder.encode(value))
      .then(() => encoder.encode(value))
      .catch(log)
  };

  render() {
    const { step, deviceInfo } = this.state

    if (step === App.ConnectedStep && deviceInfo) {
      return (
        <Connected
          deviceId={deviceInfo.id}
          deviceName={deviceInfo.name}
          isConnected={deviceInfo.isConnected}
          onWrite={this.handleWriteClick}
        />
      )
    }
    return <Welcome onScan={this.handleScanClick} />
  }
}

export default App
