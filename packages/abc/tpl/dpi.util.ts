export function getDPI() {
  const arrDPI = new Array();
  // tslint:disable-next-line: no-string-literal
  if (window.screen['deviceXDPI']) {
    // tslint:disable-next-line: no-string-literal
    arrDPI[0] = window.screen['deviceXDPI'];
    // tslint:disable-next-line: no-string-literal
    arrDPI[1] = window.screen['deviceYDPI'];
  } else {
    const tmpNode: any = document.createElement('DIV');
    tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';
    document.body.appendChild(tmpNode);
    // tslint:disable-next-line: radix
    arrDPI[0] = parseInt(tmpNode.offsetWidth);
    // tslint:disable-next-line: radix
    arrDPI[1] = parseInt(tmpNode.offsetHeight);
    tmpNode.parentNode.removeChild(tmpNode);
  }
  return arrDPI;
}
export function mmToPx(v) {
  return Math.round((v / 25.4) * getDPI()[0]);
}
export function pxToMm(v) {
  return Math.round((v * 25.4) / getDPI()[0]);
}
