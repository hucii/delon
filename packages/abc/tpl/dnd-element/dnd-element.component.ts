import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ContentChild,
  ContentChildren,
} from '@angular/core';
import { toNumber } from 'ng-zorro-antd';
import { NzResizeEvent } from 'ng-zorro-antd/resizable/ng-zorro-antd-resizable';
import { TplEditService } from '../tpl-edit.service';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { StyleValue } from '../interface';

/** Gets the closest ancestor of an element that matches a selector. */
function getClosestMatchingAncestor(element: HTMLElement, selector: string) {
  let currentElement = element.parentElement as HTMLElement | null;

  while (currentElement) {
    // IE doesn't support `matches` so we have to fall back to `msMatchesSelector`.
    if (
      currentElement.matches ? currentElement.matches(selector) : (currentElement as any).msMatchesSelector(selector)
    ) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return null;
}

@Component({
  selector: 'lm-dnd-element',
  templateUrl: './dnd-element.component.html',
  styleUrls: ['./dnd-element.component.less'],
})
export class DndElementComponent implements OnInit, OnDestroy, AfterViewInit {
  isShowDel = true;
  @ViewChild('dndEl', { static: false }) dndEl: ElementRef;
  @ViewChild('dhEl', { static: false }) dhEl: ElementRef;
  @ViewChild(CdkDrag, { static: false }) _drag: CdkDrag;

  _boundary = '.header';
  @Input()
  get boundary() {
    return this._boundary;
  }
  set boundary(v) {
    this._boundary = v;
    this.getLimitMove();
  }

  @Input()
  maxWidth: number;

  @Input()
  maxHeight: number;

  @Input()
  minWidth = 64;

  @Input()
  minHeight = 20;

  @Input()
  type: 'input' | 'image' = 'input';

  _data;
  @Input()
  set data(v) {
    this.analyzeStyle(v);
    this._data = v;
    this.isShowDel = !this._data.always;
    // console.log(this._data);
  }
  get data() {
    return this._data;
  }

  private id = -1;

  // isActive = false;
  // fontSize = 13;
  // fontWeight: 'normal' | 'bold' = 'normal';
  // fontStyle: 'normal' | 'italic' = 'normal';
  // textDecoration: 'underline' | 'none' = 'none';

  boundaryElement: HTMLElement;
  rootElement: HTMLElement;

  constructor(private srv: TplEditService, private renderer: Renderer2, private element: ElementRef<HTMLElement>) {}

  onResize({ width, height }: NzResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.data.width = width!;
      this.data.height = height!;
      this.data.style = this.dndEl.nativeElement.attributes.style.value;
    });
  }

  getLimitMove() {
    if (this.dhEl) {
      this.boundaryElement = getClosestMatchingAncestor(this.element.nativeElement, this.boundary);
      this.rootElement = this.dhEl.nativeElement;
    }
  }

  limitMove() {
    const elRect = this.rootElement.getBoundingClientRect();
    const limitRect = this.boundaryElement.getBoundingClientRect();
    if (
      limitRect.top < elRect.top - 1 &&
      limitRect.right > elRect.right + 1 &&
      limitRect.bottom > elRect.bottom + 1 &&
      limitRect.left < elRect.left - 1
    ) {
      return false;
    }
    return true;
  }

  @HostListener('click', ['$event.target'])
  onClick(el: any) {
    this.srv.activeEl(this.data);
    window.onkeydown = this.onkeydown;
  }

  @HostListener('keydown', ['$event.target'])
  onkeydown = (e: any) => {
    if (this.data.isActive) {
      if (e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();

      const elRect = this.rootElement.getBoundingClientRect();
      const limitRect = this.boundaryElement.getBoundingClientRect();
      const ts: any = this.getTransform(this.dndEl.nativeElement.style.transform, true);
      let transform = '';
      if (ts.length) {
        switch (e.keyCode) {
          case 37:
            // 左
            if (limitRect.left < elRect.left - 1) {
              transform = `translate3d(${ts[0] - 1}px, ${ts[1]}px, ${ts[2]}px)`;
            }
            break;
          case 38:
            // 上
            if (limitRect.top < elRect.top - 1) {
              transform = `translate3d(${ts[0]}px, ${ts[1] - 1}px, ${ts[2]}px)`;
            }
            break;
          case 39:
            // 右
            if (limitRect.right > elRect.right + 1) {
              transform = `translate3d(${ts[0] + 1}px, ${ts[1]}px, ${ts[2]}px)`;
            }
            break;
          case 40:
            // 下
            if (limitRect.bottom > elRect.bottom + 1) {
              transform = `translate3d(${ts[0]}px, ${ts[1] + 1}px, ${ts[2]}px)`;
            }
            break;
        }
        if (transform) {
          this.data.transform = this.getTransform(transform);
        }
      }
      setTimeout(() => {
        this.data.style = this.dndEl.nativeElement.attributes.style.value;
        const tc: any = this.getTransform(this.data.transform);
        this._drag._dragRef['_initialTransform'] = tc;
        this._drag.reset();
      }, 50);
    }
  };

  del() {
    this.srv.removeEl(this.data);
  }
  dragStart($event) {
    console.log($event);
  }
  dragEnded($event) {
    this.data.style = this.dndEl.nativeElement.attributes.style.value;
    this.analyzeStyle(this.data);
  }

  getTransform(str: string = '', returnNum = false) {
    // translate3d\([\-|0-9][0-9]*px, [\-|0-9][0-9]*px, [\-|0-9][0-9]*px\)
    const tArray = str.match(/translate3d\([\-|0-9][0-9]*px, [\-|0-9][0-9]*px, [\-|0-9][0-9]*px\)/g);
    let ts: any = [5, 5, 0];
    if (tArray == null || tArray.length <= 0) {
      return returnNum ? ts : '';
    } else if (tArray.length === 1) {
      ts = tArray[0].match(/[\-|0-9][0-9]*px/g).map(x => toNumber(x.replace('px', '')));
    } else if (tArray.length > 1) {
      ts = tArray
        .map(x => x.match(/[\-|0-9][0-9]*px/g))
        .reduce((x, y): any[] => {
          return [
            toNumber(x[0].replace('px', '')) + toNumber(y[0].replace('px', '')),
            toNumber(x[1].replace('px', '')) + toNumber(y[1].replace('px', '')),
            toNumber(x[2].replace('px', '')) + toNumber(y[2].replace('px', '')),
          ];
        });
    }

    if (returnNum) {
      return ts;
    } else {
      return `translate3d(${ts[0]}px, ${ts[1]}px, ${ts[2]}px)`;
    }

    // [[1, 2, 3], [4, 5, 6]].reduce((x, y) => {console.log(x+'---'+y);return [x[0]+y[0],x[1]+y[1],x[2]+y[2]]});
  }

  analyzeStyle(v: any = {}) {
    const styleObj: any = {};
    if (!v.style) {
      v.style = '';
    }
    const styleArray = v.style.split(';');
    styleArray.forEach(sy => {
      if (sy.includes('height')) {
        const h = sy.split(':')[1];
        styleObj.height = h.replace('px', '').trim();
      }
      if (sy.includes('width')) {
        const h = sy.split(':')[1];
        styleObj.width = h.replace('px', '').trim();
      }
      if (sy.includes('position')) {
        const h = sy.split(':')[1];
        styleObj.position = h.trim();
      }
      if (sy.includes('transform')) {
        const h = sy.split(':')[1];
        styleObj.transform = this.getTransform(h).trim();
      }
      if (sy.includes('font-size')) {
        const h = sy.split(':')[1];
        styleObj.fontSize = h.replace('px', '').trim();
      }
      if (sy.includes('font-weight')) {
        const h = sy.split(':')[1];
        styleObj.fontWeight = h.trim();
      }
      if (sy.includes('font-style')) {
        const h = sy.split(':')[1];
        styleObj.fontStyle = h.trim();
      }
      if (sy.includes('text-decoration')) {
        const h = sy.split(':')[1];
        styleObj.textDecoration = h.trim();
      }
      if (sy.includes('text-align')) {
        const h = sy.split(':')[1];
        styleObj.textAlign = h.trim();
      }
    });
    Object.assign(v, styleObj);
    if (v.height === undefined) {
      v.height = this.type === 'input' ? 30 : 48;
    }
    if (v.width === undefined) {
      v.width = this.type === 'input' ? 100 : 48;
    }
    if (v.transform === undefined) {
      v.transform = 'translate3d(5px, 5px, 0px)';
    }
    if (v.fontSize === undefined) {
      v.fontSize = 13;
    }
    if (v.fontWeight === undefined) {
      v.fontWeight = StyleValue.initial;
    }
    if (v.fontStyle === undefined) {
      v.fontStyle = StyleValue.initial;
    }
    if (v.textDecoration === undefined) {
      v.textDecoration = StyleValue.none;
    }
    if (v.textAlign === undefined) {
      v.textAlign = StyleValue.initial;
    }
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  ngAfterViewInit(): void {
    this.data.style = this.dndEl.nativeElement.attributes.style.value;
    this.data.el = this.dndEl.nativeElement;
    this.getLimitMove();
  }
}
