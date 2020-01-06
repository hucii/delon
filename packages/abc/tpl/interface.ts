export enum BillType {
  订货单 = 1,
  发货单 = 2,
  退货单 = 3, // 销售退货单
  入库单 = 4,
  补货单 = 5,
  盘点单 = 6,
  付款 = 7,
  收款 = 8,
  出库单 = 9,
  成本调价单 = 10,
  调拨单 = 11,
  采购订单 = 12,
  采购退货 = 13,
}

export enum HeaderType {
  无 = 0,
  公司名 = 1,
}

export enum FooterType {
  无 = 0,
  第1页 = 1,
  第1页_总n页 = 2,
}

export enum PrintTemplateItemType {
  表头 = 1,
  表体 = 2,
  表尾 = 3,
  数据合计 = 4,
  图片 = 5,
}

export enum TplElementType {
  标签 = 1,
  输入 = 2,
}

export enum IncludesKey {
  height = 'height',
  width = 'width',
  position = 'position',
  transform = 'transform',
  fontSize = 'font-size',
  fontWeight = 'font-weight',
  fontStyle = 'font-style',
  textDecoration = 'text-decoration',
  textAlign = 'text-align',
}

export enum StyleKey {
  fontWeight = 'fontWeight',
  fontStyle = 'fontStyle',
  textDecoration = 'textDecoration',
  textAlign = 'textAlign',
}

export enum StyleValue {
  bold = 'bold',
  italic = 'italic',
  underline = 'underline',
  left = 'left',
  center = 'center',
  right = 'right',
  initial = 'initial',
  none = 'none',
}

export interface TplData {
  printObj: any;
  tplName: string;
  paperType?: any;
  // 纸张宽度 px
  paperWidth: number;
  // 纸张高度 px
  paperHeight: number;
  // 表格行高
  rowHeight: number;
  padding: number;
  headerHeight: number;
  footerHeight: number;
  // 页眉
  paperHeaderText?: string;
  paperHeader?: any;
  // 页脚
  paperFooterText?: string;
  paperFooter?: any;
  // 是否连续打印
  isContinuousPrinting: boolean;
  // 每页打印表头
  paginalHeader: boolean;
  // 每页打印表尾
  paginalFooter: boolean;
  // 尾部锁定底部
  fixedFooter: boolean;

  data: TplDataSource;
}
export interface TplDataSource {
  formHeaders: TplElement[];
  selectedFormHeaders?: TplElement[];
  formBodys: TplElement[];
  selectedFormBodys?: TplElement[];
  formCounts: TplElement[];
  selectedFormCounts?: TplElement[];
  formFooters: TplElement[];
  selectedFormFooters?: TplElement[];
  formPic: TplElement[];
}
export interface TplElement {
  title: string;
  value?: any;
  style: string;
  selected?: boolean;
  type?: TplElementType;
  always?: boolean;
  order?: number;
  field?: string;
  area?: PrintTemplateItemType;
  overflow?: boolean;
}
