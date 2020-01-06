import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlainThemeModule } from '@delon/theme';
import { AddressComponent } from './address.component';
import { OffClickDirective } from './off-click';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule, CommonModule, AlainThemeModule],
  declarations: [AddressComponent, OffClickDirective],
  exports: [AddressComponent],
})
export class AdAddressModule {}
