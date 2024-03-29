import mitt from 'mitt'

const emitter = mitt()

const EventBus = {
  $on: emitter.on,
  $off: emitter.off,
  $emit: emitter.emit
}

export default EventBus
