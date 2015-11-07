export default ({
  decay = 0.9
} = {}) => {
  let ixonet = {};

  ixonet.decay = decay;

  let ixons = [];

  ixonet.Ixon = () => {
    let ixon = {
      value: {
        curr: 0,
        next: 0
      },
      tmpMark: {},
      connections: []
    };

    ixons.push(ixon);

    return ixon;
  };

  ixonet.head = ixonet.Ixon();
  ixonet.head.value.curr = 1;

  ixonet.tail = ixonet.Ixon();

  let propagate = ixon => {
    let currConns = ixon.connections.map(conn => ({
      weight: Math.max(0, conn.upControl.value.curr - conn.downControl.value.curr),
      destination: conn.destination
    })).filter(
      conn => conn.weight > 0
    );

    if (currConns.length === 0) {
      return;
    }

    let controlSum = currConns.map(conn => conn.weight).reduce((a, b) => a + b);

    currConns.forEach(conn => {
      let weight = conn.weight / controlSum;
      conn.destination.value.next += weight * ixon.value.curr;
    });
  };

  ixonet.step = () => {
    ixons.forEach(propagate);

    ixons.forEach(ixon => {
      ixon.value.curr = ixonet.decay * ixon.value.next;
      ixon.value.next = 0;
    });

    ixonet.head.value.curr = 1;
    ixonet.tail.value.curr = 0;
  };

  ixonet.connect = (origin, upControl, downControl, destination) => {
    origin.connections.push({upControl, downControl, destination});
  };

  return ixonet;
};
