import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { PrintTemplateItemType, TplElement, TplElementType } from '../interface';
import { TplEditService } from '../tpl-edit.service';
import { TplPrintService } from '../tpl-print.service';

@Component({
  selector: 'lm-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.less'],
})
export class ToolBarComponent {
  @ViewChild('tplPrint', { static: false }) tplPrint: ElementRef;

  _fieldObj: TplElement = {
    area: PrintTemplateItemType.表头,
    title: '',
    value: '',
    style: '',
    always: false,
    selected: false,
    type: TplElementType.标签,
  };

  types = [
    {
      title: TplElementType[TplElementType.标签],
      value: TplElementType.标签,
    },
    {
      title: TplElementType[TplElementType.输入],
      value: TplElementType.输入,
    },
  ];

  areas = [
    {
      title: PrintTemplateItemType[PrintTemplateItemType.表头],
      value: PrintTemplateItemType.表头,
    },
    {
      title: PrintTemplateItemType[PrintTemplateItemType.表体],
      value: PrintTemplateItemType.表体,
    },
    {
      title: PrintTemplateItemType[PrintTemplateItemType.数据合计],
      value: PrintTemplateItemType.数据合计,
    },
    {
      title: PrintTemplateItemType[PrintTemplateItemType.表尾],
      value: PrintTemplateItemType.表尾,
    },
  ];
  @ViewChild('fieldTpl', { static: false }) fieldTpl: TemplateRef<any>;

  isFieldRequired = true;
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    public srv: TplEditService,
    private printSrv: TplPrintService,
    private modalSrv: NzModalService,
  ) {
    this.form = this.fb.group({
      area: [PrintTemplateItemType.表头, Validators.required],
      title: ['', Validators.required],
      field: ['', Validators.required],
      value: [],
      always: [false, Validators.required],
      selected: [false],
      type: [TplElementType.标签, Validators.required],
    });
  }

  preview($event) {
    // console.log(this.tplPrint);
    const pObj = this.srv.convertPreviewPrint();
    this.printSrv.convert(pObj);
    this.printSrv.getPages();
    setTimeout(() => {
      this.printSrv.print(this.tplPrint.nativeElement.innerHTML);
    }, 100);
  }

  save($event) {
    this.srv.save();
  }

  areaChange(e: any) {
    this.setValidators(e);
  }

  typeChange(e: any) {
    switch (e) {
      case TplElementType.标签:
        this.setValidators(this.form.get('area').value);
        this.form.get('value').clearValidators();
        break;
      case TplElementType.输入:
        this.setValidators(this.form.get('area').value);
        this.form.get('value').setValidators([Validators.required]);
        break;
    }
  }

  setValidators(e) {
    switch (e) {
      case PrintTemplateItemType.表头:
        this.isFieldRequired = !this.isShowInput();
        break;
      case PrintTemplateItemType.表尾:
        this.isFieldRequired = false;
        break;
      case PrintTemplateItemType.数据合计:
        this.isFieldRequired = true;
        break;
    }
    if (this.isFieldRequired) {
      this.form.get('field').patchValue(this.form.get('field').value);
      this.form.get('field').setValidators([Validators.required]);
    } else {
      this.form.get('field').clearValidators();
    }
  }

  reset() {
    this.form.reset();
    this.form.get('area').patchValue(PrintTemplateItemType.表头);
    this.form.get('always').patchValue(false);
    this.form.get('selected').patchValue(false);
    this.form.get('type').patchValue(TplElementType.标签);
  }

  isShowInput() {
    return this.form.get('type').value === TplElementType.输入;
  }

  addField() {
    this.reset();
    this.modalSrv.create({
      nzTitle: '新增数据源字段',
      nzContent: this.fieldTpl,
      nzOnCancel: e => {
        this.reset();
      },
      nzOnOk: e => {
        // tslint:disable-next-line:forin
        for (const key in this.form.controls) {
          this.form.controls[key].markAsDirty();
          this.form.controls[key].updateValueAndValidity();
        }
        if (!this.form.valid) {
          return false;
        }
        this.srv.addField(this.form.value);
        this.reset();
      },
    });
  }

  goBack() {
    this.srv.goBack();
  }
}
