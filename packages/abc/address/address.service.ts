import { forkJoin, Observable, pipe, of } from 'rxjs';
import { Data, DataItem, DataType, Options, Result } from './interface';
import { map } from 'rxjs/operators';

export class AddressService {
  private options: Options;

  public inited: boolean = false;
  public opened: boolean = false;

  public hd: any[] = [];
  public bd: any[] = [];
  public title: string;
  public result: Result;
  public max: number = 0;

  constructor() {}

  /**
   * 初始化数据
   */
  initData(options: Options) {
    this.inited = false;

    this.title = '';
    this.result = {
      id: '',
      name: '',
      paths: [],
    };
    this.options = {
      separator: '/',
      placeholder: '请选择省市区',
      types: ['省份', '城市', '县区'],
      offset: { x: 0, y: 25 },
      jumps: [],
      ...options,
    };

    if (!this.options.data && !this.options.http) {
      throw new Error('数据源 `data` 或 `http` 至少必须指定一项');
    }

    this.hd = [];
    this.bd = [];
    if (Array.isArray(this.options.types)) {
      this.options.types.forEach((value, index) => {
        this.hd.push({ name: value, index, selected: index === 0 });
        this.bd.push({
          index,
          selected: index === 0,
          data: {},
        });
      });
      this.max = this.options.types.length;
    }

    this.load(0, this.result.id).subscribe(() => {
      this.inited = true;
    });

    return this.options;
  }

  /**
   * 设置选项卡选中状态
   */
  setHead(index: number) {
    this.hd.forEach(i => {
      i.selected = index === i.index;
    });
    this.bd.forEach(i => {
      i.selected = index === i.index;
    });
  }

  private findItem(index: number, id: string): DataItem {
    const items = this.bd[index].data.items;
    let res;
    // tslint:disable-next-line:forin
    for (const key in items) {
      res = items[key].find((i: any) => id === i.id);
      if (res) {
        break;
      }
    }
    return res;
  }

  private parseAddress(data: string): string[] {
    // xx xx xx 不含街道
    const notStree = data.length === 6;
    // xx xx xx xxx 含街道
    const hasStree = data.length === 9;
    if (!notStree && !hasStree) {
      return [];
    }

    // let res: string[];
    if (notStree) {
      return Array(3)
        .fill('')
        .map((v, index) => {
          return (data.substr(0, (index + 1) * 2) + '000000').substr(0, 6);
        });
    } else if (hasStree) {
      return Array(4)
        .fill('')
        .map((v, index) => {
          return index > 2 ? data : (data.substr(0, (index + 1) * 2) + '000000').substr(0, 6);
        });
    }

    return [];
  }

  private putResult(bdIndex: number, id: string, item: DataItem, isClear: boolean = true) {
    const items = this.bd[bdIndex].data.items;
    // tslint:disable-next-line:forin
    for (const key in items) {
      items[key].forEach((i: any) => {
        i.selected = id === i.id;
      });
    }

    item = { ...item };
    this.result.id = id;
    this.result.name = item.name;
    this.result.paths = this.result.paths.slice(0, bdIndex);
    delete item.selected;
    this.result.paths.push(item);
    this.title = this.result.paths.map((i: DataItem) => i.name).join(`<i class="separator">${this.options.separator}</i>`);
    if (isClear) {
      this.bd.forEach(i => {
        if (i.index > bdIndex) {
          i.data = {};
        }
      });
    }
  }

  /**
   * 设置地址
   */
  setAddress(data: any) {
    if (!data) {
      return;
    }

    const that = this;
    let addresss: string[];
    if (typeof data === 'string') {
      addresss = that.parseAddress(data.toString());
    } else {
      addresss = data instanceof Array ? data : [];
    }
    if (Array.isArray(that.options.types)) {
      const max = that.options.types.length;
      const load$: Observable<any>[] = [];
      addresss.forEach((value, index) => {
        if (index >= max) {
          return;
        }
        load$.push(that.load(index, index > 0 ? addresss[index - 1] : '', value));
      });
      // 检查下一个面板是否存在，存在还需要加载数据
      const isLimit = max > addresss.length;
      if (isLimit) {
        load$.push(that.load(addresss.length, addresss[addresss.length - 1]));
      }
      forkJoin(load$)
        .pipe(map(x => x))
        .subscribe(ls => {
          for (const item of ls) {
            this.putResult(item.index, item.value, this.findItem(item.index, item.value), false);
          }
          if (isLimit) {
            this.setHead(addresss.length);
          }
        });
    }
  }

  onSelected(bdIndex: number, id: string, item: DataItem) {
    const that = this;
    that.putResult(bdIndex, id, item);
    // 自动关闭
    ++bdIndex;
    if (bdIndex >= that.max) {
      that.opened = false;
    } else {
      that.setHead(bdIndex);
      that.load(bdIndex, that.result.id).subscribe(() => {
        if (bdIndex < that.max) {
          that.jump(bdIndex);
        }
      });
    }
  }

  private load(index: number, id: string, defaultValue?: string): Observable<{ index: number; value: any }> {
    return new Observable(obs => {
      const fn = this.options.data || this.options.http;
      fn(index, id).subscribe(
        (res: Data) => {
          const returnValue = {
            index,
            value: defaultValue,
          };
          if (res) {
            this._renderData(index, res, defaultValue);
            obs.next(returnValue);
            obs.complete();
            return;
          }

          // 当只有HTTP请求时不再处理
          if (this.options.data && this.options.http) {
            this.options.http(index, id).subscribe(
              (httpRes: Data) => {
                this._renderData(index, httpRes, defaultValue);
                obs.next(returnValue);
                obs.complete();
              },
              err => {
                obs.error(err);
                obs.complete();
              },
            );
          }
        },
        err => {
          obs.error(err);
          obs.complete();
        },
      );
    });
  }

  private _renderData(index: number, res: Data, defaultValue?: string) {
    if (!res) {
      res = { type: DataType.list, list: [], group: {} };
    }
    const items = res.type === DataType.list ? { '': res.list } : { ...res.group };
    const tips: any[] = [];
    let count: number = 0;
    // tslint:disable-next-line:forin
    for (const key in items) {
      items[key].forEach((i: any) => {
        ++count;
        i.selected = defaultValue === i.id;
        if (i.tips === true) {
          tips.push(i);
        }
      });
      items[key] = items[key].filter((i: any) => i.tips !== true);
    }
    this.bd[index].data = {
      type: res.type,
      items,
      tips: tips || [],
    };

    if (count === 0) {
      this.opened = false;
    }
  }

  private jump(index: number) {
    // jumps
    const items = this.bd[index].data.items;
    // tslint:disable-next-line:forin
    for (const key in items) {
      const jumpItem = items[key].find((i: DataItem) => {
        if (Array.isArray(this.options.jumps)) return ~this.options.jumps.indexOf(i.id);
      });
      if (jumpItem) {
        this.onSelected(index, jumpItem.id, jumpItem);
      }
    }
  }
}
