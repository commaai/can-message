'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unpackCAN = unpackCAN;
exports.packCAN = packCAN;
/*
  CAN UTILS
*/

var CAN_TRANSMIT = exports.CAN_TRANSMIT = 1;
var CAN_EXTENDED = exports.CAN_EXTENDED = 4;

var CAN_MSG_LENGTH = 16;

function unpackCAN(data) {
  // Data must be a multiple of CAN_MSG_LENGTH
  if (data.byteLength % CAN_MSG_LENGTH !== 0) {
    var err = new Error('can-message.unpackCAN: byteLength must be a multiple of ' + CAN_MSG_LENGTH);
    throw err;
  }

  var msgs = [];

  for (var i = 0; i < data.byteLength; i += CAN_MSG_LENGTH) {
    var dat = data.slice(i, i + CAN_MSG_LENGTH);

    var datView = Buffer.from(dat);

    var f1 = datView.readInt32LE(0),
        f2 = datView.readInt32LE(4);
    var address = void 0;
    if ((f1 & CAN_EXTENDED) >>> 0) {
      address = f1 >>> 3;
    } else {
      address = f1 >>> 21;
    }

    var busTime = f2 >>> 16;
    var canMsgData = new Buffer(dat.slice(8, 8 + (f2 & 0xF)));
    var bus = f2 >> 4 & 0xF & 0xFF;

    var msg = { address: address, busTime: busTime, data: canMsgData, bus: bus };
    msgs.push(msg);
  }

  return msgs;
}

function packCAN(_ref) {
  var address = _ref.address,
      data = _ref.data,
      bus = _ref.bus;

  if (data.byteLength > 8) {
    var err = new Error('can-message.packCAN: byteLength cannot be greater than 8');
    throw err;
  }

  if (address >= 0x800) {
    address = (address << 3 | CAN_TRANSMIT | CAN_EXTENDED) >>> 0;
  } else {
    address = (address << 21 | CAN_TRANSMIT) >>> 0;
  }

  var buf = Buffer.alloc(0x10);

  buf.writeUInt32LE(address);
  buf.writeUInt32LE((data.byteLength | bus << 4) >>> 0, 4);
  data.copy(buf, 8);

  return buf;
}
