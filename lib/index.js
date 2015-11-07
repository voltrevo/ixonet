export default ({
  decay = 0.9
} = {}) => {
  let ixonet = {};

  ixonet.head = {
    value: {
      curr: 1,
      next: 0
    },
    tmpMark: {},
    connections: []
  };

  let Ixons = () => {
    let ixons = [];

    let mark = {};

    let traverse = ixon => {
      if (ixon.tmpMark === mark) {
        return;
      }

      ixon.tmpMark = mark;

      ixons.push(ixon);

      ixon.connections.forEach(conn => {
        [conn.destination, conn.control].forEach(traverse);
      });
    };

    traverse(ixonet.head);

    return ixons;
  };

  let propagate = ixon => {
    let controlSum = ixon.connections.map(
      conn => conn.control.value.curr
    ).reduce(
      (a, b) => a + b
    );

    ixon.connections.forEach(conn => {
      let weight = conn.control.value.curr / controlSum;
      conn.destination.value.next += decay * weight * ixon.value.curr;
    });
  };

  ixonet.step = () => {
    ixonet.head.value.curr = 1;

    let ixons = Ixons();

    ixons.forEach(propagate);

    ixons.forEach(ixon => {
      ixon.value.curr = ixon.value.next;
      ixon.value.next = 0;
    });
  };

  return ixonet;
};
