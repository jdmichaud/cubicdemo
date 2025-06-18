function getMouseCoordinates(event, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - Math.round(rect.left),
    y: event.clientY - Math.round(rect.top),
  };
}

function getMouseCoordinatesRelativelySvgElement(event, svgElement) {
  // get a sizes and position of svg element, relative browser viewport (page piece, showed on a screen, which we can see)
  let svg_element_position = svgElement.getBoundingClientRect(),
    // difference coefficients between HTML element and svg viewbox sizes.
    svg_sizes_factor = {
      x: svgElement.viewBox.baseVal.width / svg_element_position.width,
      y: svgElement.viewBox.baseVal.height / svg_element_position.height
    };

  // calculates the position of the cursor relative to the svg viewbox.
  return {
    x: Math.round( (event.clientX - svg_element_position.x) * svg_sizes_factor.x + svgElement.viewBox.baseVal.x ),
    y: Math.round( (event.clientY - svg_element_position.y) * svg_sizes_factor.y + svgElement.viewBox.baseVal.y )
  };
}

function activate(point) {
  point.setAttribute('fill', 'red');
}

function deactivate(point) {
  point.setAttribute('fill', 'black');
}

function addControlPointBehavior(id, initPos) {
  const point = document.getElementById(id);
  point.setAttribute('cy', initPos);

  point.addEventListener('mouseover', () => {
    activate(point);
  });
  point.addEventListener('mouseout', () => {
    deactivate(point);
  });

  const observable = new Observable.BehaviorSubject(parseFloat(point.getAttribute('cy')));

  let mouseStartPoint;

  const mouseMoveHandler = event => {
    activate(point);
    const mouseCurrentPoint = getMouseCoordinatesRelativelySvgElement(event, point.parentElement);
    const newPos = Math.min(100, Math.max(0, mouseCurrentPoint.y));
    point.setAttribute('cy', newPos);
    observable.next(newPos);
  };

  const mouseUpHandler = event => {
    deactivate(point);
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  }

  point.addEventListener('mousedown', event => {
    activate(point);
    event.stopPropagation();
    event.preventDefault();
    mouseStartPoint = getMouseCoordinatesRelativelySvgElement(event, event.target.parentElement);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  return observable;
}

function generateUrlToClipboard(p0, p1, p2, p3) {
  const url = `${window.location.origin}?p0=${p0.get()}&p1=${p1.get()}&p2=${p2.get()}&p3=${p3.get()}`;
  console.log('generated', url);
  // Copy the text inside the text field
  navigator.clipboard.writeText(url);
}

function getFloatParam(url, name) {
  const value = parseFloat(url.searchParams.get(name));
  if (Number.isNaN(value)) {
    return undefined;
  }
  return value;
}

function getInitialPoints() {
  const url = new URL(window.location);
  const p0init = getFloatParam(url, 'p0') ?? 75;
  const p1init = getFloatParam(url, 'p1') ?? 50;
  const p2init = getFloatParam(url, 'p2') ?? 90;
  const p3init = getFloatParam(url, 'p3') ?? 25;
  return [p0init, p1init, p2init, p3init];
}

// Catmull-Rom cubic spline segment
const T_DIV_2 = 3 / 2;
const F_DIV_2 = 5 / 2;
function cubic(p0, p1, p2, p3, x) {
  const x2 = x * x;
  const x3 = x2 * x;
  const a = -.5 * p0 + T_DIV_2 * p1 - T_DIV_2 * p2 + .5 * p3;
  const b =       p0 - F_DIV_2 * p1 +     2.  * p2 - .5 * p3;
  const c = -.5 * p0 +              +      .5 * p2          ;
  const d =                      p1                         ;

  return a * x3 + b * x2 + c * x + d;
}

// TODO: try Steffen or Kruger

const svgns = 'http://www.w3.org/2000/svg';
function drawCurve(svgElement, p0, p1, p2, p3) {
  // remove previous curve
  const curveElements = document.getElementsByClassName('curve');
  for (let i = curveElements.length - 1; i >= 0; --i) {
    curveElements[i].remove();
  }

  for (let x = 0; x < 100; x += 0.5) {
    const y = 100 - (cubic((100 - p0) / 100, (100 - p1) / 100, (100 - p2) / 100, (100 - p3) / 100, x / 100) * 100);
    const dot = document.createElementNS(svgns, 'circle');
    dot.setAttributeNS(null, 'cx', (1/3 + 1/3 * (x / 100)) * 100);
    dot.setAttributeNS(null, 'cy', y);
    dot.setAttributeNS(null, 'r', 0.1);
    dot.setAttributeNS(null, 'style', 'fill: green; stroke: green; stroke-width: 0.3px;' );
    dot.setAttributeNS(null, 'class', 'curve');
    svgElement.appendChild(dot);
  }
}

function main() {
  console.log('ready');
  const [p0init, p1init, p2init, p3init] = getInitialPoints();
  const p0 = addControlPointBehavior('p0', p0init);
  const p1 = addControlPointBehavior('p1', p1init);
  const p2 = addControlPointBehavior('p2', p2init);
  const p3 = addControlPointBehavior('p3', p3init);
  window.p0 = p0;

  const captureButton = document.getElementById('capture-button');
  captureButton.addEventListener('click', () => generateUrlToClipboard(p0, p1, p2, p3));

  const svg = document.getElementById('graph');
  Observable.Observable.all([p0, p1, p2, p3]).subscribe(([p0, p1, p2, p3]) => {
    drawCurve(svg, p0, p1, p2, p3);
  });
}

window.onload = main;