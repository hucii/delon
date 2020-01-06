import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';

@Component({
  selector: 'lm-resizable-element',
  templateUrl: './resizable-element.component.html',
  styleUrls: ['./resizable-element.component.less'],
})
export class ResizableElementComponent implements OnInit, AfterViewInit {
  @ViewChild('dndEl', { static: false }) dndEl: ElementRef;
  width = 138;
  id = -1;
  _data;
  @Input()
  set data(v) {
    this.analyzeStyle(v);
    this._data = v;
  }
  get data() {
    return this._data;
  }

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.data.style = this.dndEl.nativeElement.attributes.style.value;
  }
  onResize({ width, height }: NzResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.data.width = width!;
      this.data.style = this.dndEl.nativeElement.attributes.style.value;
    });
  }
  analyzeStyle(v: any = {}) {
    const styleObj: any = {};
    if (!v.style) {
      v.style = '';
    }
    const styleArray = v.style.split(';');
    styleArray.forEach(sy => {
      if (sy.includes('width')) {
        const h = sy.split(':')[1];
        styleObj.width = h.replace('px', '');
      }
    });
    Object.assign(v, styleObj);

    if (v.width === undefined) {
      v.width = 138;
    }
  }
}
