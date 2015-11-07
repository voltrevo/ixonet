import assert from 'assert';

import {range} from 'range';

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

    let {head, tail} = ixonet;
    let a = ixonet.Ixon();
    let b = ixonet.Ixon();

    ixonet.connect(head, head, tail, a);
    ixonet.connect(a, head, tail, b);

    ixonet.step();

    assert.equal(a.value.curr, ixonet.decay);
    assert.equal(b.value.curr, 0);

    ixonet.step();

    assert.equal(a.value.curr, ixonet.decay);
    assert.equal(b.value.curr, ixonet.decay * ixonet.decay);
  });

  it('should have state that allows accumulation', () => {
    let ixonet = Ixonet();

    let {head, tail} = ixonet;
    let a = ixonet.Ixon();
    ixonet.connect(head, head, tail, a);
    ixonet.connect(a, head, tail, a);

    assert.equal(a.value.curr, 0);

    let k = ixonet.decay;

    ixonet.step();
    assert.equal(a.value.curr, k);

    ixonet.step();
    assert.equal(a.value.curr, k + k * k);

    ixonet.step();
    assert.equal(a.value.curr, k + k * k + k * k * k);
  });

  it('correctly simulates alternation pattern', () => {
    let ixonet = Ixonet();

    let {head: h, tail: t} = ixonet;
    let [a, b] = range(2).map(ixonet.Ixon);

    ixonet.connect(h, h, a, a);

    ixonet.connect(a, h, b, b);
    ixonet.connect(b, h, a, a);

    range(100).forEach(() => {
      console.log([a, b].map(ixon => ixon.value.curr));
      ixonet.step();
    });
  });

  it('correctly simulates 3 cycle', () => {
    let ixonet = Ixonet();

    let {head: h, tail: t} = ixonet;
    let [m, a, b, c] = range(4).map(ixonet.Ixon);

    ixonet.connect(h, h, a, m);
    ixonet.connect(m, h, a, a);

    ixonet.connect(a, h, t, b);
    ixonet.connect(b, h, t, c);
    ixonet.connect(c, h, t, a);

    range(100).forEach(() => {
      console.log([a, b, c].map(ixon => ixon.value.curr));
      ixonet.step();
    });
  });
});
