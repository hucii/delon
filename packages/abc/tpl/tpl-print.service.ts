import { Injectable } from '@angular/core';
import { mmToPx } from './dpi.util';
import { TplElement } from './interface';

@Injectable({
  providedIn: 'root',
})
export class TplPrintService {
  paperHeader = 0;
  paperHeaderText = '';
  paperFooter = 0;
  paperFooterText = '';
  paperWidth = mmToPx(210);
  paperHeight = mmToPx(297);
  padding = 15;
  rowHeight = 40;
  // 表头高度
  headerHeight = 100;
  // 表尾高度
  footerHeight = 80;
  // 是否连续打印
  isContinuousPrinting = false;
  // 每页打印表头
  paginalHeader = false;
  // 每页打印表尾
  paginalFooter = false;
  // 尾部锁定底部
  fixedFooter = false;

  formPics: TplElement[] = [];
  formHeaders: TplElement[] = [];
  formBodys: TplElement[] = [];
  formData: any[] = [];
  formFooters: TplElement[] = [];

  // 表头 表尾
  hbfHeight = 0;
  // 表头
  hbHeight = 0;
  // 表尾
  bfHeight = 0;
  // 表内容
  bHeight = 0;

  // 表格head高度
  tableHeaderHeight = 24;

  hbfRow = 0;
  hbRow = 0;
  bfRow = 0;
  bRow = 0;

  printData = [];

  private printHTML: any;
  private printWindow: Window;
  private printDoc: Document;

  styleStr = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-size: 14px;
  }
  table {
    width: 100%;
    font-size: 14px;
    border-top: 1px solid #000;
    border-left: 1px solid #000;
  }
  td,
  th {
    padding-left: 2px;
    line-height: 1.5;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .page-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    margin: 0;
    padding: 0;
    padding-left: 10px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    border-bottom: 1px dashed transparent;
    opacity: 0.9;
    padding-top: 8px;
  }
  .page-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    margin: 0;
    padding: 0;
    padding-left: 10px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    background-color: transparent;
    border-top: 1px dashed transparent;
    opacity: 0.9;
    margin-bottom: 8px;
  }
  .placeholder {
    position: absolute;
  }
  .header {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    padding: 15px 0;
    border: 1px dashed transparent;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    -webkit-box-align: center;
    -ms-flex-align: center;
  }
  table {
    border-collapse: separate;
    border-spacing: 0;
  }
  th{
    text-align: center;
  }
  td div{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .footer {
    position: absolute;
    width: 100%;
    border: 1px dashed transparent;
    border-top: 1px dashed transparent;
  }  
  `;

  constructor() {
    this.mockData();
  }

  mockData() {
    this.paperHeaderText = '汇智浩达科技有限公司';
    this.paperFooterText = '第1页，共2页';
    this.formPics = [
      {
        title: '',
        value: 'http://sta.dingshang123.com/static/other/18/1/1/21390769176_25831.jpg?width=500&height=500',
        style:
          'height: 48px; width: 48px; transform: translate3d(361px, 25px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '',
        value: 'http://sta.dingshang123.com/static/other/18/1/1/21390769176_25831.jpg?width=500&height=500',
        style:
          'height: 48px; width: 48px; transform: translate3d(755px, 211px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
    ];
    this.formHeaders = [
      {
        title: '汇智浩达订货单',
        style:
          'height: 56px; width: 162.825px; transform: translate3d(367px, -27px, 0px); font-size: 20px; font-weight: bold; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '地区',
        value: '123区',
        style:
          'height: 30px; width: 100px; transform: translate3d(169px, 17px, 0px); font-size: 13px; font-weight: bold; font-style: normal; position: relative; text-decoration: underline;',
      },
      {
        title: '客户名称',
        value: '客户01',
        style:
          'height: 24px; width: 100px; transform: translate3d(147px, -32px, 0px); font-size: 13px; font-weight: bold; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '公司名称',
        value: '汇智浩达科技有限公司',
        style:
          'height: 30px; width: 100px; transform: translate3d(169px, 17px, 0px); font-size: 13px; font-weight: bold; font-style: normal; position: relative; text-decoration: underline;',
      },
      {
        title: '下单时间',
        value: '2019-01-25',
        style:
          'height: 30px; width: 100px; transform: translate3d(289px, -16px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '联系电话',
        value: '13568521452',
        style:
          'height: 30px; width: 100px; transform: translate3d(408px, 22px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '地区',
        value: '1234区',
        style:
          'height: 30px; width: 100px; transform: translate3d(562px, -20px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '地区',
        value: '12345区',
        style:
          'height: 30px; width: 100px; transform: translate3d(712px, -4px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
    ];
    this.formBodys = [
      { title: '商品名称', style: 'width: 54.825px;' },
      { title: '单价', style: 'width: 117px; position: relative;' },
      { title: '单位', style: 'width: 138px; position: relative;' },
      { title: '数量', style: 'width: 134px; position: relative;' },
      { title: '已发货数量', style: 'width: 137px; position: relative;' },
      { title: '仓库名', style: 'width: 132px; position: relative;' },
      { title: '小计', style: 'width: 133px; position: relative;' },
      { title: '商品分类', style: 'width: 131px; position: relative;' },
    ];

    this.formFooters = [
      {
        title: '备注',
        value: '备注1',
        style:
          'height: 30px; width: 100px; transform: translate3d(12px, 0px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '优惠金额',
        value: '10',
        style:
          'height: 33px; width: 100px; transform: translate3d(57px, 29px, 0px) translate3d(5px, 5px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '配送方式',
        value: '顺丰快递',
        style:
          'height: 30px; width: 100px; transform: translate3d(206px, 29px, 0px) translate3d(5px, 5px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '操作时间',
        value: '2018-10-25',
        style:
          'height: 30px; width: 100px; transform: translate3d(240px, -6px, 0px) translate3d(5px, 5px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '特批价',
        value: '62',
        style:
          'height: 30px; width: 100px; transform: translate3d(240px, -6px, 0px) translate3d(5px, 5px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '交货时间',
        value: '2019-20.55',
        style:
          'height: 30px; width: 100px; transform: translate3d(400px, 4px, 0px) translate3d(5px, 5px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '',
        value: '自定义字段32323',
        style:
          'height: 30px; width: 91px; transform: translate3d(496px, 10px, 0px) translate3d(5px, 5px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
      {
        title: '操作员',
        value: '刘亚飞',
        style:
          'height: 30px; width: 100px; transform: translate3d(587px, 44px, 0px) translate3d(5px, 5px, 0px); font-size: 13px; font-weight: normal; font-style: normal; text-decoration: none; position: relative;',
      },
    ];
  }

  /**
   * 创建iframe
   */
  private createIframe(srcdoc: string) {
    const oldFrame: any = document.getElementsByClassName('print-frame');
    if (oldFrame.length > 0) {
      oldFrame[0].parentNode.removeChild(oldFrame[0]);
    }
    try {
      const printIframe: any = document.createElement('iframe');
      document.body.appendChild(printIframe);
      printIframe.style.position = 'absolute';
      printIframe.style.border = '0';
      printIframe.style.width = '1000px';
      printIframe.style.height = '1000px';
      printIframe.style.left = '0';
      printIframe.style.top = '0';
      printIframe.style.zIndex = '-1';
      printIframe.style.display = 'none';
      printIframe.className = 'print-frame';
      this.printWindow = printIframe.contentWindow;
      this.printDoc = printIframe.contentDocument
        ? printIframe.contentDocument
        : printIframe.contentWindow
        ? printIframe.contentWindow.document
        : printIframe.document;
    } catch (e) {
      throw new Error(e + '. iframes may not be supported in this browser.');
    }

    if (!this.printWindow) {
      throw new Error('Cannot find window.');
    }

    if (!this.printDoc) {
      throw new Error('Cannot find document.');
    }
  }

  /**
   * 写入文档
   */
  private write(): any {
    this.printDoc.open();
    this.printDoc.write(this.printHTML);
    const style = this.printDoc.createElement('style');
    style.type = 'text/css';
    style.innerHTML = this.styleStr;
    this.printDoc.head.appendChild(style);
    this.printDoc.close();
  }

  /**
   * 开始打印
   */
  private startPrint() {
    const timeoutId: any = setTimeout(() => {
      this.printWindow.focus();
      if (!!window['ActiveXObject'] || 'ActiveXObject' in window) {
        // IE浏览器
        try {
          this.printWindow['PrintWB'].ExecWB(7, 1); // IE下增加打印预览
        } catch (e) {
          console.error(e);
        }
      } else {
        this.printWindow.print();
      }
      const id: any = setTimeout(() => {
        clearTimeout(id);
        this.printWindow.close();
      }, 500);

      clearTimeout(timeoutId);
    }, 500);
  }

  /**
   * 开始打印
   */
  print(srcdoc) {
    this.printHTML = srcdoc;
    this.createIframe(srcdoc);
    this.write();
    this.startPrint();
  }

  reset() {
    this.paperHeaderText = '';
    this.paperHeader = 0;
    this.paperFooterText = '';
    this.paperFooter = 0;
    this.paperWidth = mmToPx(210);
    this.paperHeight = mmToPx(297);
    this.padding = 15;
    this.rowHeight = 40;
    // 表头高度
    this.headerHeight = 100;
    // 表尾高度
    this.footerHeight = 80;
    // 尾部锁定底部
    this.fixedFooter = false;

    this.formPics = [];
    this.formHeaders = [];
    this.formBodys = [];
    this.formFooters = [];
  }

  convert(obj) {
    this.reset();
    Object.assign(this, obj);
  }

  convertPaper() {}

  getPages() {
    // this.formBodys
    this.printData = [];
    // 总高度
    const allHeight = this.paperHeight;
    let pageHeight = allHeight;
    // 减页眉页脚
    // 减padding
    pageHeight = pageHeight - (this.padding >= 30 ? this.padding : 30) * 2;
    this.hbfHeight = pageHeight - this.headerHeight - this.footerHeight;
    this.hbfRow = Math.floor((this.hbfHeight - this.tableHeaderHeight) / (this.rowHeight + 1));
    this.hbHeight = pageHeight - this.headerHeight;
    this.hbRow = Math.floor((this.hbHeight - this.tableHeaderHeight) / (this.rowHeight + 1));
    this.bfHeight = pageHeight - this.footerHeight;
    this.bfRow = Math.floor((this.bfHeight - this.tableHeaderHeight) / (this.rowHeight + 1));
    this.bHeight = pageHeight;
    this.bRow = Math.floor((this.bHeight - this.tableHeaderHeight) / (this.rowHeight + 1));
    this.paginalHeader = false;
    this.paginalFooter = false;
    if (this.paginalHeader && this.paginalFooter) {
      const totlePage = Math.ceil(this.formData.length / this.hbfRow);
      for (let index = 0; index < totlePage; index++) {
        this.printData.push({
          showHeader: true,
          formData: this.formData.slice(index * this.hbfRow, (index + 1) * this.hbfRow),
          showFooter: true,
          baseIndex: index * this.hbfRow,
        });
      }
    } else if (this.paginalHeader && !this.paginalFooter) {
      this.singleHF(this.formData, 'header');
    } else if (!this.paginalHeader && this.paginalFooter) {
      this.singleHF(this.formData, 'footer');
    } else if (!this.paginalHeader && !this.paginalFooter) {
      this.singleHF(this.formData, 'body');
    }
  }
  getPageTips(index) {
    let text = '';
    switch (this.paperFooter) {
      case 0:
        text = '';
        break;
      case 1:
        text = `第${index + 1}页`;
        break;
      case 2:
        text = `共${this.printData.length}页,第${index + 1}页`;
        break;
    }
    return text;
  }

  singleHF(data: any[], tType: 'header' | 'footer' | 'body', index = 0) {
    if (tType === 'header') {
      if (data.length <= this.hbfRow) {
        this.printData.push({
          showHeader: true,
          formData: data,
          showFooter: true,
          baseIndex: index,
        });
      } else {
        this.printData.push({
          showHeader: true,
          formData: data.slice(0, this.hbRow),
          showFooter: false,
          baseIndex: index,
        });
        index = index === 0 ? this.hbRow : index + this.hbRow;
        this.singleHF(data.slice(this.hbRow), 'header', index);
      }
    } else if (tType === 'footer') {
      if (data.length <= this.hbfRow) {
        this.printData.push({
          showHeader: index === 0,
          formData: data,
          showFooter: true,
          baseIndex: index,
        });
      } else {
        this.printData.push({
          showHeader: index === 0,
          formData: data.slice(0, index === 0 ? this.hbfRow : this.bfRow),
          showFooter: true,
          baseIndex: index,
        });
        index = index === 0 ? this.hbfRow : index + this.bfRow;
        this.singleHF(data.slice(this.bfRow), 'footer', index);
      }
    } else if (tType === 'body') {
      if (data.length <= this.hbfRow) {
        this.printData.push({
          showHeader: index === 0,
          formData: data,
          showFooter: true,
          baseIndex: index,
        });
      } else {
        this.printData.push({
          showHeader: index === 0,
          formData: data.slice(0, index === 0 ? this.hbRow : this.bRow),
          showFooter: false,
          baseIndex: index,
        });
        index = index === 0 ? this.hbRow : index + this.bRow;
        this.singleHF(data.slice(this.bRow), 'body', index);
      }
    }
  }
}
