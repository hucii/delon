---
title:
  zh-CN: 基础样例
  en-US: Basic Usage
order: 0
---


## zh-CN

最简单的用法。

## en-US

Simplest of usage.

```ts
import { Component } from '@angular/core';
import { AddressDataChinaService } from '@lemon/abc';

@Component({
  selector: 'demo',
  template: `
    <ad-address
    [(ngModel)]="id"
    [options]="opt"></ad-address>
  `,
 providers:[
   AddressDataChinaService
 ]

})
export class DemoComponent {
  public id: any;
  public opt: any;
  constructor(private china: AddressDataChinaService) {
    this.opt = {
      jumps: this.china.getJumps(),
      data: this.china.getData.bind(this.china)
    };
  }
}
```
