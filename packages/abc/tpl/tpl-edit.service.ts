import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toNumber } from '@delon/util';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { mmToPx, pxToMm } from './dpi.util';
import {
  BillType,
  FooterType,
  HeaderType,
  PrintTemplateItemType,
  StyleKey,
  StyleValue,
  TplData,
  TplElement,
  TplElementType,
} from './interface';

@Injectable({
  providedIn: 'root',
})
export class TplEditService {
  private _editorHeight = document.body.clientHeight - 95;
  public tabHeight = this.editorHeight - 55;

  get editorHeight() {
    return this._editorHeight;
  }
  set editorHeight(v) {
    this._editorHeight = v;
    this.tabHeight = this.editorHeight - 55;
  }

  private _isShowPic = false; // 是否显示图片模块
  get isShowPic() {
    return this._isShowPic;
  }
  set isShowPic(v) {
    this._isShowPic = v;
  }

  private _isEdit = false; // 是否为编辑
  get isEdit() {
    return this._isEdit;
  }
  set isEdit(v) {
    this._isEdit = v;
  }

  private _isDesign = false;
  get isDesign() {
    return this._isDesign;
  }
  set isDesign(v) {
    this._isDesign = v;
  }

  private _isBack = true;
  get isBack() {
    return this._isBack;
  }
  set isBack(v) {
    this._isBack = v;
  }

  private _printNameLength = 30;
  get tplNameLength() {
    return this._printNameLength;
  }
  /**
   * 模板名称最大字符长度
   */
  set tplNameLength(v) {
    this._printNameLength = v;
  }

  private _headerFieldLength = 30;
  get fieldLength() {
    return this._headerFieldLength;
  }
  /**
   * 数据源最大字符长度（默认值）
   */
  set fieldLength(v) {
    this._headerFieldLength = v;
  }

  private tplDataSource$: Subject<TplData> = new Subject();
  public get tplData() {
    return this.tplDataSource$.asObservable();
  }

  // 打印对象
  printObjs = [];
  markLeft = -40;
  printObj = this.printObjs.length ? this.printObjs[0] : { name: '无打印对象', value: null };
  // 模板名称
  printName = '';
  // 纸张类型
  papers = [
    {
      name: 'A4(210x297)mm',
      value: {
        width: 210,
        height: 297,
      },
    },
    {
      name: '一等分(241x280)mm',
      value: {
        width: 241,
        height: 280,
      },
    },
    {
      name: '二等分(241x140)mm',
      value: {
        width: 241,
        height: 140,
      },
    },
    {
      name: '三等分(241x93)mm',
      value: {
        width: 241,
        height: 93,
      },
    },
    {
      name: '自定义纸张大小',
      value: undefined,
    },
  ];
  paper = this.papers[0];
  // 纸张宽度
  paperWidthPx = mmToPx(210);
  _paperWidth = 210;
  get paperWidth() {
    return this._paperWidth;
  }
  set paperWidth(v) {
    this._paperWidth = v;
    this.paperWidthPx = mmToPx(this._paperWidth);
  }
  // 纸张高度
  paperHeightPx = mmToPx(297);
  _paperHeight = 297;
  get paperHeight() {
    return this._paperHeight;
  }
  set paperHeight(v) {
    this._paperHeight = v;
    this.paperHeightPx = mmToPx(this._paperHeight);
  }

  // 内边距
  _padding = 15;
  set padding(v) {
    this._padding = v;
    this.markLeft = -25 - this._padding;
  }
  get padding() {
    return this._padding;
  }

  // 表头高度
  headerHeight = 100;
  // 表尾高度
  footerHeight = 80;
  // 页眉
  paperHeaders = [
    {
      name: '无',
      value: HeaderType.无,
    },
    {
      name: '公司名称',
      value: HeaderType.公司名,
    },
  ];
  paperHeader = this.paperHeaders[0];
  // 页脚
  paperFooters = [
    {
      name: '无',
      value: FooterType.无,
    },
    {
      name: '第1页',
      value: FooterType.第1页,
    },
    {
      name: '第1页,共n页',
      value: FooterType.第1页_总n页,
    },
  ];
  paperFooter = this.paperFooters[0];

  /**
   * 表格行高
   */
  rowHeight = 50;

  // 是否连续打印
  isContinuousPrinting = false;
  // 每页打印表头
  paginalHeader = false;
  // 每页打印表尾
  paginalFooter = false;
  // 尾部锁定底部
  fixedFooter = false;

  // 表头字段
  formHeaders = [];
  selectedFormHeaders = [];
  // 表体字段
  formBodys = [];
  selectedFormBodys = [];
  // 数据合计
  formCounts = [];
  selectedFormCounts = [];
  // 表尾字段
  formFooters = [];
  selectedFormFooters = [];
  // 打印图片
  formPic = [];

  formData: any[] = [];

  currentActiveEl = null;
  fontSize = 13;
  fontWeight: StyleValue = StyleValue.initial;
  fontStyle: StyleValue = StyleValue.initial;
  textDecoration: StyleValue = StyleValue.none;
  textAlign: StyleValue = StyleValue.initial;

  constructor(private http: HttpClient, private modalSrv: NzModalService) {
    this.toBillTypes(BillType);
    this.reset();
  }

  initSelected() {
    this.formHeaderChange();
    this.formBodyChange();
    this.formCountChange();
    this.formFooterChange();
  }

  activeEl(el) {
    el.isActive = true;
    this.currentActiveEl = el;
    this.fontSize = el.fontSize;
    this.fontStyle = el.fontStyle;
    this.textDecoration = el.textDecoration;
    this.selectedFormHeaders.filter(e => e !== el).forEach(e => (e.isActive = false));
    this.selectedFormFooters.filter(e => e !== el).forEach(e => (e.isActive = false));
  }

  removeEl(el: TplElement) {
    if (!el.always) {
      el.selected = false;
      this.selectedFormHeaders = this.selectedFormHeaders.filter(e => e !== el);
      this.selectedFormFooters = this.selectedFormFooters.filter(e => e !== el);
      this.formPic = this.formPic.filter(e => e !== el);
    }
  }

  changeFontSize(e) {
    if (this.currentActiveEl) {
      this.currentActiveEl.fontSize = this.fontSize;
      this.refreshStyle();
    }
  }

  setStyle(key: any, value: any) {
    if (!this.currentActiveEl) {
      return;
    }
    // tslint:disable-next-line: prefer-conditional-expression
    if (this.currentActiveEl[key] !== value) {
      this.currentActiveEl[key] = value;
    } else {
      this.currentActiveEl[key] = key === StyleKey.textDecoration ? StyleValue.none : StyleValue.initial;
    }
    this.refreshStyle();
  }

  // bold() {
  //   if (!this.currentActiveEl) {
  //     return;
  //   }
  //   if (this.currentActiveEl.fontWeight === 'normal') {
  //     this.currentActiveEl.fontWeight = 'bold';
  //   } else {
  //     this.currentActiveEl.fontWeight = 'normal';
  //   }
  //   setTimeout(() => {
  //     this.currentActiveEl.style = this.currentActiveEl.el.attributes.style.value;
  //   }, 20);
  // }

  // italic() {
  //   if (!this.currentActiveEl) {
  //     return;
  //   }
  //   if (this.currentActiveEl.fontStyle === 'normal') {
  //     this.currentActiveEl.fontStyle = 'italic';
  //   } else {
  //     this.currentActiveEl.fontStyle = 'normal';
  //   }
  //   this.refreshStyle();
  // }

  // underline() {
  //   if (!this.currentActiveEl) {
  //     return;
  //   }
  //   if (this.currentActiveEl.textDecoration === 'none') {
  //     this.currentActiveEl.textDecoration = 'underline';
  //   } else {
  //     this.currentActiveEl.textDecoration = 'none';
  //   }
  //   this.refreshStyle();
  // }

  // setTextAlign(align: 'left' | 'center' | 'right') {
  //   if (!this.currentActiveEl) {
  //     return;
  //   }
  //   if (this.currentActiveEl.textAlign !== align) {
  //     this.currentActiveEl.textAlign = align;
  //   } else {
  //     this.currentActiveEl.textAlign = 'initial';
  //   }
  //   this.refreshStyle();
  // }

  refreshStyle() {
    if (this.currentActiveEl) {
      setTimeout(() => {
        this.currentActiveEl.style = this.currentActiveEl.el.attributes.style.value;
      }, 20);
    }
  }

  get isBold() {
    return this.currentActiveEl && this.currentActiveEl.fontWeight === StyleValue.bold;
  }
  get isItalic() {
    return this.currentActiveEl && this.currentActiveEl.fontStyle === StyleValue.italic;
  }
  get isUnderline() {
    return this.currentActiveEl && this.currentActiveEl.textDecoration === StyleValue.underline;
  }
  get isAlignLeft() {
    return this.currentActiveEl && this.currentActiveEl.textAlign === StyleValue.left;
  }
  get isAlignCenter() {
    return this.currentActiveEl && this.currentActiveEl.textAlign === StyleValue.center;
  }
  get isAlignRight() {
    return this.currentActiveEl && this.currentActiveEl.textAlign === StyleValue.right;
  }

  formHeaderChange() {
    this.selectedFormHeaders = this.formHeaders.filter(h => h.selected);
  }

  formBodySort() {
    this.formBodys.sort((x, y) => x.order - y.order);
  }
  formBodyChange() {
    this.selectedFormBodys = this.formBodys.filter(h => h.selected);
  }
  formCountChange() {
    this.selectedFormCounts = this.formCounts.filter(h => h.selected);
  }
  formFooterChange() {
    this.selectedFormFooters = this.formFooters.filter(h => h.selected);
  }

  paperChange($event) {
    if (this.paper.value) {
      this.paperHeight = this.paper.value.height;
      this.paperWidth = this.paper.value.width;
    }
  }

  isTypeInput(e: any) {
    return e.type === TplElementType.输入;
  }

  printChange() {
    const temp = this.formHeaders.find(x => (x.type = TplElementType.输入));
    if (temp) {
      temp.value = this.printObj.name;
    }
    this.billTypeChange();
  }

  billTypeChange() {}

  upload($event) {
    // console.log($event);
  }

  reset() {
    if (this.isDesign) {
      this.http.get('./assets/data.json').subscribe((x: any) => {
        this.formHeaders = x.formHeaders || [];
        this.formBodys = x.formBodys || [];
        this.formCounts = x.formCounts || [];
        this.formFooters = x.formFooters || [];
        this.formPic = x.formPic || [];
        this.initSelected();
      });
    } else {
      this.printObj = this.printObjs.length ? this.printObjs[0] : { name: '无打印对象', value: null };
      this.paperHeader = this.paperHeaders[0];
      this.paperFooter = this.paperFooters[0];
      this.paper = this.papers[0];
      this.paperWidth = 210;
      this.paperHeight = 297;
      this.padding = 15;
      this.rowHeight = 40;
      // 表头高度
      this.headerHeight = 100;
      // 表尾高度
      this.footerHeight = 80;
      // 是否连续打印
      this.isContinuousPrinting = false;
      // 每页打印表头
      this.paginalHeader = false;
      // 每页打印表尾
      this.paginalFooter = false;
      // 尾部锁定底部
      this.fixedFooter = false;

      this.formPic = [];
      this.formHeaders = [];
      this.formBodys = [];
      this.formCounts = [];
      this.formFooters = [];
      this.currentActiveEl = null;
      this.fontSize = 13;
      this.fontWeight = StyleValue.initial;
      this.fontStyle = StyleValue.initial;
      this.textAlign = StyleValue.initial;
      this.textDecoration = StyleValue.none;
      this.initSelected();
    }
  }

  convert(obj: TplData) {
    this.printObj = this.printObjs.find(f => f.value === obj.printObj);
    this.printName = obj.tplName;
    const p = this.papers.find(
      f => f.value && f.value.width === pxToMm(obj.paperWidth) && f.value.height === pxToMm(obj.paperHeight),
    );
    if (p) {
      this.paper = p;
    }
    this.paperWidth = pxToMm(obj.paperWidth);
    this.paperHeight = pxToMm(obj.paperHeight);
    this.padding = obj.padding;
    this.headerHeight = obj.headerHeight;
    this.footerHeight = obj.footerHeight;
    this.paperHeader = this.paperHeaders.find(f => f.value === obj.paperHeader);
    this.paperFooter = this.paperFooters.find(f => f.value === obj.paperFooter);
    this.isContinuousPrinting = obj.isContinuousPrinting;
    this.paginalHeader = obj.paginalHeader;
    this.paginalFooter = obj.paginalFooter;
    this.fixedFooter = obj.fixedFooter;
    this.formHeaders = obj.data.formHeaders;
    this.formBodys = obj.data.formBodys;
    this.formCounts = obj.data.formCounts;
    this.formFooters = obj.data.formFooters;
    this.rowHeight = obj.rowHeight;
    this.initSelected();
  }

  convertPreviewPrint() {
    const pObj: any = {
      paperHeaderText: this.paperHeader.value ? this.paperHeader.name : '',
      paperHeader: this.paperHeader.value,
      paperFooterText: this.paperFooter.value ? this.paperFooter.name : '',
      paperFooter: this.paperFooter.value,
      paperWidth: this.paperWidthPx,
      paperHeight: this.paperHeightPx,
      rowHeight: this.rowHeight,
      padding: this.padding,
      headerHeight: this.headerHeight,
      footerHeight: this.footerHeight,
      fixedFooter: this.fixedFooter,
      paginalHeader: this.paginalHeader,
      paginalFooter: this.paginalFooter,
      isContinuousPrinting: this.isContinuousPrinting,
      formPics: this.formPic.map(x => ({
        title: '',
        value: x.thumbUrl,
        style: x.style,
      })),
      formHeaders: this.selectedFormHeaders.map(x => ({
        title: x.type === TplElementType.输入 ? '' : x.title,
        value: x.value,
        style: x.style,
      })),
      formBodys: this.selectedFormBodys.map(x => ({
        title: x.title,
        value: x.value,
        style: x.style,
      })),
      formCounts: this.selectedFormCounts.map(x => ({
        title: x.title,
        value: x.value,
        style: x.style,
      })),
      formFooters: this.selectedFormFooters.map(x => ({
        title: x.type === TplElementType.输入 ? '' : x.title,
        value: x.value,
        style: x.style,
      })),
    };
    return pObj;
  }

  private getTplData() {
    const tplData: TplData = {
      printObj: this.printObj,
      tplName: this.printName,
      paperType: this.paper,
      paperWidth: this.paperWidthPx,
      paperHeight: this.paperHeightPx,
      rowHeight: this.rowHeight,
      padding: this.padding,
      headerHeight: this.headerHeight,
      footerHeight: this.footerHeight,
      paperHeaderText: this.paperHeader.value ? this.paperHeader.name : '',
      paperFooterText: this.paperFooter.value ? this.paperFooter.name : '',
      paperHeader: this.paperHeader.value,
      paperFooter: this.paperFooter.value,
      isContinuousPrinting: this.isContinuousPrinting,
      paginalHeader: this.paginalHeader,
      paginalFooter: this.paginalFooter,
      fixedFooter: this.fixedFooter,
      data: {
        formHeaders: this.formHeaders,
        selectedFormHeaders: this.selectedFormHeaders,
        formBodys: this.formBodys,
        selectedFormBodys: this.selectedFormBodys,
        formCounts: this.formCounts,
        selectedFormCounts: this.selectedFormCounts,
        formFooters: this.formFooters,
        selectedFormFooters: this.selectedFormFooters,
        formPic: this.formPic.map(x => ({
          title: '',
          value: x.thumbUrl || x.url || x.value,
          style: x.style,
        })),
      },
    };
    return tplData;
  }

  save() {
    this.tplDataSource$.next(this.getTplData());
  }

  // 页面调用返回
  goBack() {}

  addField(e: TplElement) {
    switch (e.area) {
      case PrintTemplateItemType.表头:
        this.formHeaders = [...this.formHeaders, e];
        if (e.always) {
          e.selected = true;
          this.formHeaderChange();
        }
        break;
      case PrintTemplateItemType.表体:
        this.formBodys = [...this.formBodys, e];
        this.formBodys.forEach((b, i) => {
          b.order = i;
        });
        if (e.always) {
          e.selected = true;
          this.formBodyChange();
        }
        break;
      case PrintTemplateItemType.数据合计:
        this.formCounts = [...this.formCounts, e];
        if (e.always) {
          e.selected = true;
          this.formCountChange();
        }
        break;
      case PrintTemplateItemType.表尾:
        this.formFooters = [...this.formFooters, e];
        if (e.always) {
          e.selected = true;
          this.formFooterChange();
        }
        break;
      default:
        break;
    }
  }

  delField(e: TplElement) {
    switch (e.area) {
      case PrintTemplateItemType.表头:
        this.formHeaders = this.formHeaders.filter(f => f !== e);
        this.formHeaderChange();
        break;
      case PrintTemplateItemType.表体:
        this.formBodys = this.formBodys.filter(f => f !== e);
        this.formBodyChange();
        break;
      case PrintTemplateItemType.数据合计:
        this.formCounts = this.formCounts.filter(f => f !== e);
        this.formCountChange();
        break;
      case PrintTemplateItemType.表尾:
        this.formFooters = this.formFooters.filter(f => f !== e);
        this.formFooterChange();
        break;
      default:
        break;
    }
  }

  toBillTypes(dic: object, keys = []) {
    const kvs = this.dicToKeyValues(dic);
    kvs.filter(f => keys.some(s => s === f.value));
    this.printObjs = kvs;
  }

  dicToKeyValues(dic: object) {
    const kvs = [];
    if (dic instanceof Object) {
      for (const key in dic) {
        if (dic.hasOwnProperty(key) && !toNumber(key)) {
          kvs.push({
            name: key,
            value: dic[key],
          });
        }
      }
    }
    return kvs;
  }
}
