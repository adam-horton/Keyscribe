import { assert } from 'chai';
import { makeReqStub, makeResStub } from '../test-utils';
import { helloWorld, helloWorld2 } from '../../src/handlers/test-handler';

describe('Test Handler Tests', () => {
  it('should send a hello world message', () => {
    const req = makeReqStub();
    const res = makeResStub();

    helloWorld(req, res);

    assert.isTrue(res.send.calledOnceWithExactly('This is a test!'));
  });

  it('should send a different hello world message', () => {
    const req = makeReqStub();
    const res = makeResStub();

    helloWorld2(req, res);

    assert.isTrue(res.send.calledOnceWithExactly('This is another test!'));
  });
});
