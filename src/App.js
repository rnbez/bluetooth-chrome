import React, { Component } from 'react'
import Welcome from './components/Welcome'
import Setup from './components/Setup'
import Connected from './components/Connected'
const log = console.log

class App extends Component {
  static WelcomeStep = 'welcome';
  static SetupStep = 'setup';
  static ConnectedStep = 'connected';

  constructor(props) {
    super(props)
    this.state = {
      step: App.WelcomeStep,
      deviceInfo: null,
      echoCharacters: null,
      setupCharacteristic: null,
      stateCharacteristic: null,
      addressCharacteristic: null,
    }
  }

  handleScanClick = () => {
    const serviceUuid = '4095880c-f7c3-42df-9a49-8dbb7a171995'

    const addressCharacteristicUuid = '7a305c79-e3be-4e05-9208-591d8617908c'
    const setupCharacteristicUuid = '4454c36c-92fe-45ce-a852-e483aa7998c1'
    const stateCharacteristicUuid = '40c67dc7-ad9a-43a0-b7b5-0407e21392e6'
    let service = null
    log('Requesting Bluetooth Device...')
    navigator.bluetooth
      .requestDevice({ filters: [{ services: [serviceUuid] }] })
      .then(device => {
        log('> Name:             ' + device.name)
        log('> Id:               ' + device.id)
        log('> Connected:        ' + device.gatt.connected)
        this.setState({
          step: App.SetupStep,
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
        service = serv
        log('Getting Address Characteristic...')
        return service.getCharacteristic(addressCharacteristicUuid)
      })
      .then(addressCharacteristic => {
        log('> Characteristic UUID:  ' + addressCharacteristic.uuid)
        log('> Read:                 ' + addressCharacteristic.properties.read)
        log(
          '> Write:                ' + addressCharacteristic.properties.write
        )
        log(
          '> Notify:               ' + addressCharacteristic.properties.notify
        )
        this.setState({
          addressCharacteristic,
        })

        log('Getting Setup Characteristic...')
        return service.getCharacteristic(setupCharacteristicUuid)
      })
      .then(setupCharacteristic => {
        log('> Characteristic UUID:  ' + setupCharacteristic.uuid)
        log('> Read:                 ' + setupCharacteristic.properties.read)
        log('> Write:                ' + setupCharacteristic.properties.write)
        log('> Notify:               ' + setupCharacteristic.properties.notify)
        this.setState({
          setupCharacteristic,
        })

        log('Getting State Characteristic...')
        return service.getCharacteristic(stateCharacteristicUuid)
      })
      .then(stateCharacteristic => {
        log('> Characteristic UUID:  ' + stateCharacteristic.uuid)
        log('> Read:                 ' + stateCharacteristic.properties.read)
        log('> Write:                ' + stateCharacteristic.properties.write)
        log('> Notify:               ' + stateCharacteristic.properties.notify)

        stateCharacteristic.readValue().then(value => {
          const { deviceInfo } = this.state
          const decoder = new TextDecoder('utf-8')
          log('Recieved value:' + decoder.decode(value))
          const state = JSON.parse(decoder.decode(value))

          stateCharacteristic.addEventListener(
            'characteristicvaluechanged',
            event => {
              const { deviceInfo, addressCharacteristic } = this.state
              const { value } = event.target
              const decoder = new TextDecoder('utf-8')
              log('Notified value:' + decoder.decode(value))
              const state = JSON.parse(decoder.decode(value))
              if (!addressCharacteristic) {
                this.setState({
                  step: App.ConnectedStep,
                  deviceInfo: Object.assign({}, deviceInfo, {
                    isConnected: state && state.connected,
                  }),
                })
              } else {
                addressCharacteristic
                  .readValue()
                  .then(value => {
                    const { deviceInfo } = this.state
                    const decoder = new TextDecoder('utf-8')
                    log('Recieved Address:' + decoder.decode(value))
                    const address = decoder.decode(value)
                    this.setState({
                      step: App.ConnectedStep,
                      deviceInfo: Object.assign({}, deviceInfo, {
                        isConnected: state && state.connected,
                        address,
                      }),
                    })
                  })
                  .catch(() => {
                    this.setState({
                      step: App.ConnectedStep,
                      deviceInfo: Object.assign({}, deviceInfo, {
                        isConnected: state && state.connected,
                      }),
                    })
                  })
              }
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
    const encoder = new TextEncoder('utf-8')
    setupCharacteristic
      .writeValue(encoder.encode(value))
      .then(() => encoder.encode(value))
      .catch(log)
  };

  render() {
    const { step, deviceInfo } = this.state

    if (step === App.SetupStep && deviceInfo) {
      return (
        <Setup
          deviceName={deviceInfo.name}
          isConnected={deviceInfo.isConnected}
          onWrite={this.handleWriteClick}
        />
      )
    } else if (step === App.ConnectedStep && deviceInfo) {
      return (
        <Connected
          deviceAddress={deviceInfo.address}
          deviceName={deviceInfo.name}
          isConnected={deviceInfo.isConnected}
        />
      )
    }
    return <Welcome onScan={this.handleScanClick} />
  }
}

export default App
