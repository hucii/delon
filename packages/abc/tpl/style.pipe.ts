import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'style' })
export class StylePipe implements PipeTransform {
  constructor(private dom: DomSanitizer) {}

  transform(style: string): string | SafeHtml {
    return style ? this.dom.bypassSecurityTrustStyle(style) : '';
  }
}
