import { Observable } from 'rxjs';

export interface DataItem {
  [key: string]: any;
  /**
   * 编号
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 提醒
   */
  tips?: boolean;
}

/**
 * 数据类型
 */
export enum DataType {
  list = 1,
  group = 2,
}

export interface Data {
  /**
   * 数据类型
   */
  type: DataType;

  /**
   * 列表
   */
  list?: Array<DataItem>;

  /**
   * 组
   */
  group?: any;
}

export interface IExternalData {
  /**
   * 数据类型
   */
  getTypes(): Array<string>;

  /**
   * 可跳过数据，以 `id` 为判断标准
   */
  getJumps(): Array<string>;

  /**
   * 数据源
   *
   * @param {number} 面板下标
   * @param {string} 数据编号
   * @returns {Observable<Data>}
   */
  getData(index: number, id: string): Observable<Data>;

  /**
   * 设置地址
   *
   * @param {*} data
   * @returns {Observable<string[]>} 字符串数组，数组数量必须与 {types.length} 一致
   */
  setAddress(data: any): Observable<string[]>;
}

/**
 * 配置项
 */
export interface Options {
  /**
   * 提示信息
   */
  placeholder: string;
  /**
   * 分隔符 default '/'
   */
  separator: string;
  /**
   * 数据类型
   * @name 数据类型
   * @default [ '省份', '城市', '县区' ]
   */
  types?: string[];
  /**
   * 可跳过数据
   * @name 可跳过数据
   */
  jumps?: string[];

  /**
   * 面板样式
   * @name 面板样式
   */
  className: string;
  /**
   * 面板偏移值
   * @name 面板偏移值
   * @default { x: 0, y: 25 }
   */
  offset: { x: number; y: number };
  /**
   * 数据源
   *
   */
  data(index: number, id: string): Observable<Data>;

  /**
   * 远程数据源，当 data 返回 null或undefined 时调用
   *
   */
  http(index: number, id: string): Observable<Data>;

  /**
   * 设置地址
   *
   * @param {*} data
   * @returns {Observable<string[]>} 字符串数组，数组数量必须与 {types.length} 一致
   */
  setAddress(data: any): Observable<string[]>;
}

export interface Result {
  /**
   * 编号
   */
  id: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 已选择路径项
   */
  paths: any[];
}

export interface TabItem {
  text: string;
  selected: boolean;
  items: any;
}
