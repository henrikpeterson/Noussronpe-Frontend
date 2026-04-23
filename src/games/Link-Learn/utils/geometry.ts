// Line segment intersection detection
interface Point { x: number; y: number; }
interface Segment { p1: Point; p2: Point; }

function ccw(A: Point, B: Point, C: Point): boolean {
  return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
}

export function segmentsIntersect(s1: Segment, s2: Segment): boolean {
  const { p1: A, p2: B } = s1;
  const { p1: C, p2: D } = s2;
  return ccw(A, C, D) !== ccw(B, C, D) && ccw(A, B, C) !== ccw(A, B, D);
}

export function checkAnyCrossing(
  connections: Array<{ fromPos: Point; toPos: Point }>,
  excludeIndex?: number
): number[] {
  const crossingIndices: number[] = [];
  for (let i = 0; i < connections.length; i++) {
    if (i === excludeIndex) continue;
    for (let j = i + 1; j < connections.length; j++) {
      if (j === excludeIndex) continue;
      const s1: Segment = { p1: connections[i].fromPos, p2: connections[i].toPos };
      const s2: Segment = { p1: connections[j].fromPos, p2: connections[j].toPos };
      if (segmentsIntersect(s1, s2)) {
        if (!crossingIndices.includes(i)) crossingIndices.push(i);
        if (!crossingIndices.includes(j)) crossingIndices.push(j);
      }
    }
  }
  return crossingIndices;
}

export function pointInRect(p: Point, rect: { x: number; y: number; w: number; h: number }): boolean {
  return p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h;
}

export function lineIntersectsRect(p1: Point, p2: Point, rect: { x: number; y: number; w: number; h: number }): boolean {
  const { x, y, w, h } = rect;
  const edges: Segment[] = [
    { p1: { x, y }, p2: { x: x + w, y } },
    { p1: { x: x + w, y }, p2: { x: x + w, y: y + h } },
    { p1: { x: x + w, y: y + h }, p2: { x, y: y + h } },
    { p1: { x, y: y + h }, p2: { x, y } },
  ];
  const seg: Segment = { p1, p2 };
  return edges.some(edge => segmentsIntersect(seg, edge));
}
