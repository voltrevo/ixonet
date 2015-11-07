import assert from 'assert';
import Ixonet from '../lib';

describe('ixonet', function() {
  it('should have a head with value 1', function() {
    let ixonet = Ixonet();

    assert.equal(ixonet.head.value.curr, 1);
  });
});
