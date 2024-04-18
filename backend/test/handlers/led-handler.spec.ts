import { assert } from 'chai';
import sinon from 'ts-sinon';
import * as websocket from '../../src/websockets/websocket-setup';

describe('LED Handler Tests', () => {
  describe('ledOn Tests', () => {
    let getConnectionsStub: any;

    beforeEach(() => {
      getConnectionsStub = sinon.stub(websocket, 'getWebsocketConnections');
    });

    afterEach(() => {
      getConnectionsStub.restore();
    });

    it('Demo to show tests are working', () => {
      // Write future tests in this place
      assert.isTrue(true);
    });
  });
});
