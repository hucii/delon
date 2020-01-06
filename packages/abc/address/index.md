---
title: ad-address
subtitle: 地址下拉选择
cols: 1
module: AdAddressModule
---

地址下拉选择控件

## API

### [options]

参数配置项，参数的变更（指整个 `options` 对象变更而非对象下某个属性）会使组件重新初始化，见[Options](#options-interface)。

### [values]

设置默认地址值，传递值可是**字符串编号**或与 _options.types.length_ 等同数量的**字符串数组**。

默认 ad-address 实现了一套以国家标准地址区域代码信息规则。

_标准市县区规则_

310105：表示【上海-长宁】，最终会解析成：[ '310000', '310100', '310105' ]

_标准市县区街道规则_

310105001：表示【上海-长宁-某街道】，最终会解析成：[ '310000', '310100', '310105', '310105001' ]

如果你使用的 `id` 编号是以上两种规则之一的话，那么 `(values)` 完全可以**忽略**，因为 `[(ngModel)]` 本身是双向绑定，ad-address 会自动根据外部变化重新选择.

### (onSelected)

每一次选择会触一次，接收一个 `Result` 参数，见[Result](#result-interface)。

由于默认ad-address组件并不包括地址数据，所以需要定义 `options`，可以自定义获取或使用[内置的地址库](#address-library)。

```ts
let types = ['区域', '公司', '部门'];
this.custom = {
  id: '',
  result: {},
  options: {
    placeholder: '请选择区域、公司、部门',
    types: types,
    http: (index: number, id: string) => {
      return new Observable(observer => {
        if (customData.findIndex(w => w.index === index) === -1) {
          customData.push(...Array.from({
            length: Math.floor(Math.random() * 10) + 1
          }).map((item, idx) => {
            return {
              index: index,
              id: (index + 1) + idx,
              name: types[index] + '-' + idx
            }
          }))
        }
        const _tmp: Data = {
          type: DataType.list,
          list: customData.filter(w => w.index === index)
        };
        observer.next(_tmp);
        observer.complete();
      });
    }
  }
};

onCustomSelected(value: any) {
  this.custom.result = value;
}
```

### Options Interface

| 名称    | 类型           | 默认值  | 描述 |
| ------- | ------------- | ----- | ----- |
| placeholder | string | 请选择省市区 | 提示信息 ||
| separator | string | / | 提示分隔符信息 ||
| types | string[] | [ '省份', '城市', '县区' ] | 数据类型集合 ||
| jumps | string[] |  | 可被跳过的面板，以 `id` 为判断标准 |
| data | Function |  | 调用时会传递 `index` （当前面板下标位，从0开始）、`id`（上一个面板选择的编号，如果第一个面板传递 `''`），返回 `Observable<Data>` 类型。 |
| http | Function |  | 调用时会传递 `index` （当前面板下标位，从0开始）、`id`（上一个面板选择的编号，如果第一个面板传递 `''`），返回 `Observable<Data>` 类型。 |
| setAddress | Function |  | 返回 `Observable<string[]>` 类型（数组数量必须与 {types.length} 一致） 。 |
| className | string |  | 面板样式，同 `class`。 |
| offset | { x: number, y: number } | { x: 0, y: 25 } | 面板偏移值 |

### Result Interface

| 名称    | 类型           | 默认值  | 描述 |
| ------- | ------------- | ----- | ----- |
| id | string |  | 编号 |
| name | string |  | 名称 |
| paths | any[] |  | 已选择路径项 |

## Address Library

ad-address 还内置几种地址库，所有中国地址库都是按[国家标准地址区域代码信息](http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/201703/t20170310_1471429.html)为准，地址库与 ad-address 属于独立模块，需要单独引入。

```ts
import { AddressDataChinaModule } from '@lemon/abc';

@NgModule({
  imports: [BrowserModule, AddressDataChinaModule ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```ts
constructor(private china: AddressDataChinaService) {
  this.options = {
    types: this.china.getTypes(),
    jumps: this.china.getJumps(),
    // 务必需要 `.bind` 来保证内部 `this` 指针。
    data: this.china.getData.bind(this.china)
  }
}
```

### List

| Module Name | 名称 |  描述 |
| ------- | ------------- | ----- |
| AddressDataChinaModule | 中国（含港澳） | 最小县区级 |
| AddressDataCNModule | 中国（不含港澳） | 最小县区级 |
| AddressDataKotModule | 港澳 | 最小县区级 |
| AddressDataTWModule | 台湾 | 最小县区级 |
| AddressDataMaModule | 马来西亚 | 最小城市级 |

_以上地址库将会持续更新_

### User Defined

通过实现 `IExternalData` 接口，创建属于自己地址库，有关细节可以参考 `address/data/china/data.service.ts`。

| 名称    | 类型           | 默认值  | 描述 |
| ------- | ------------- | ----- | ----- |
| getTypes | Array<string> |  | 数据类型集合 |
| getJumps | Array<string> |  | 可跳过数据，以 `id` 为判断标准 |
| getData | Function |  | 调用时会传递 `index` （当前面板下标位，从0开始）、`id`（上一个面板选择的编号，如果第一个面板传递 `''`），返回 `Observable<Data>` 类型。 |
| setAddress | Function |  | 返回 `Observable<string[]>` 类型（数组数量必须与 {types.length} 一致） 。 |

### NOTE

ad-address 提供静态数据 `data` 和 远程数据 `http` 两个参数，且二者按 `data` > `http` 的顺序执行（当 `data` 结果返回 `null` 或 `undefined` 时尝试调用 `http` 请求）。

因此，可以使用内置地址库配合远程的街道数据一起使用.
