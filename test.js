import { packCAN, unpackCAN } from './index';

function arrayBufferFromHex(hex) {
  const buffer = Buffer.from(hex, "hex");
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; i++) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

test('packCAN packs data to spec', () => {
  const msg = {
    address: 10,
    busTime: 0,
    data: Buffer.from('0001', 'hex'),
    bus: 1
  };
  const packed = packCAN(msg);

  expect(packed.toString('hex')).toEqual('01004001120000000001000000000000');
});

test('packCAN throws when data is over 8 bytes', () => {
  const msg = {
    address: 10,
    busTime: 0,
    data: Buffer.alloc(9),
    bus: 1
  };

  expect(() => packCAN(msg)).toThrow();
});

test('packCAN packs a message with extended address', () => {
  const msg = {
    address: 0x18DB33F1,
    busTime: 0,
    data: Buffer.from('0001', 'hex'),
    bus: 1
  };
  const packed = packCAN(msg);

  expect(packed.toString('hex')).toEqual('8d9fd9c6120000000001000000000000');
});

test('unpackCAN correctly parses a 16-byte buffer', () => {
  const buf = Buffer.from('ab'.repeat(16), 'hex');
  const dataBytes = Buffer.from('ab'.repeat(8), 'hex');

  const msgs = unpackCAN(buf);
  expect(msgs.length).toBe(1);
  expect(msgs[0]).toEqual({ address: 1373, busTime: 43947, data: dataBytes, bus: 10 });

});

test('unpackCAN correctly parses a 32-byte buffer', () => {
  const buf = Buffer.from('ab'.repeat(32), 'hex');
  const dataBytes = Buffer.from('ab'.repeat(8), 'hex');

  const msgs = unpackCAN(buf);
  expect(msgs.length).toBe(2);
  expect(msgs[0]).toEqual({ address: 1373, busTime: 43947, data: dataBytes, bus: 10 });
  expect(msgs[1]).toEqual({ address: 1373, busTime: 43947, data: dataBytes, bus: 10 });
});

test('unpackCAN rejects data not 16 bytes in length', () => {
  const buf = Buffer.from('abaaa', 'hex');

  expect(() => unpackCAN(buf)).toThrow();
});

test('unpackCAN correctly parses an extended CAN address', () => {
  const buf = Buffer.from('8d9fd9c6120000000001000000000000', 'hex');

  const msgs = unpackCAN(buf);
  expect(msgs.length).toBe(1);
  expect(msgs[0].address).toBe(0x18DB33F1);
});
