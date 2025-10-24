/**
 * Web Serial API 类型定义
 */

interface SerialPort extends EventTarget {
  readonly readable: ReadableStream<Uint8Array> | null
  readonly writable: WritableStream<Uint8Array> | null

  open(options: SerialOptions): Promise<void>
  close(): Promise<void>

  getInfo(): SerialPortInfo

  addEventListener(
    type: 'connect' | 'disconnect',
    listener: (this: SerialPort, ev: Event) => any,
    options?: boolean | AddEventListenerOptions,
  ): void
}

interface SerialOptions {
  baudRate: number
  dataBits?: 7 | 8
  stopBits?: 1 | 2
  parity?: 'none' | 'even' | 'odd'
  bufferSize?: number
  flowControl?: 'none' | 'hardware'
}

interface SerialPortInfo {
  usbVendorId?: number
  usbProductId?: number
}

interface SerialPortRequestOptions {
  filters?: SerialPortFilter[]
}

interface SerialPortFilter {
  usbVendorId?: number
  usbProductId?: number
}

interface Serial extends EventTarget {
  getPorts(): Promise<SerialPort[]>
  requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>

  addEventListener(
    type: 'connect' | 'disconnect',
    listener: (this: Serial, ev: Event & { target: SerialPort }) => any,
    options?: boolean | AddEventListenerOptions,
  ): void
}

interface Navigator {
  readonly serial: Serial
}

