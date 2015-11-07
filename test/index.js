import assert from 'assert';
import Ixonet from '../lib';

describe('ixonet', function() {
  it('should have a head with value 1', function() {
    let ixonet = Ixonet();

    assert.equal(ixonet.head.value.curr, 1);
  });

  it('should still have head with value 1 after a step', function() {
    let ixonet = Ixonet();

    ixonet.step();

    assert.equal(ixonet.head.value.curr, 1);
  });
});
