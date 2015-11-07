import assert from 'assert';
import Ixonet from '../lib';

describe('ixonet', function() {
  it('should have a head with value 1', () => {
    let ixonet = Ixonet();

    assert.equal(ixonet.head.value.curr, 1);
  });

  it('should still have head with value 1 after a step', () => {
    let ixonet = Ixonet();

    ixonet.step();

    assert.equal(ixonet.head.value.curr, 1);
  });

  it('should decay in propagation', () => {
    let ixonet = Ixonet();

    let head = ixonet.head;
    let a = ixonet.Ixon();
    let b = ixonet.Ixon();

    ixonet.connect(head, head, a);
    ixonet.connect(a, head, b);

    ixonet.step();

    assert.equal(a.value.curr, ixonet.decay);
    assert.equal(b.value.curr, 0);

    ixonet.step();

    assert.equal(a.value.curr, ixonet.decay);
    assert.equal(b.value.curr, ixonet.decay * ixonet.decay);
  });

  it('should have state that allows accumulation', () => {
    let ixonet = Ixonet();

    let head = ixonet.head;
    let a = ixonet.Ixon();
    ixonet.connect(head, head, a);
    ixonet.connect(a, head, a);

    assert.equal(a.value.curr, 0);

    let k = ixonet.decay;

    ixonet.step();
    assert.equal(a.value.curr, k);

    ixonet.step();
    assert.equal(a.value.curr, k + k * k);

    ixonet.step();
    assert.equal(a.value.curr, k + k * k + k * k * k);
  });
});
