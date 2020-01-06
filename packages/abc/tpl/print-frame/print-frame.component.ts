import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TplPrintService } from '../tpl-print.service';

@Component({
  selector: 'lm-print-frame',
  templateUrl: './print-frame.component.html',
  styleUrls: ['./print-frame.component.less'],
})
export class PrintFrameComponent implements OnInit {
  constructor(public srv: TplPrintService) {}

  ngOnInit() {}
}
