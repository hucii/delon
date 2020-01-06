import { NgModule } from '@angular/core';
import { AddressDataMaService } from './data.service';

export * from './data.service';

@NgModule({
  providers: [AddressDataMaService],
})
export class AddressDataMaModule {}
