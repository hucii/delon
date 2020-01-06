import { NgModule } from '@angular/core';
import { AddressDataKotService } from './data.service';

export * from './data.service';

@NgModule({
  providers: [AddressDataKotService],
})
export class AddressDataKotModule {}
