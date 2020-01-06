import { NgModule } from '@angular/core';

import { AddressDataCNService } from './data.service';

export * from './data.service';

@NgModule({
  providers: [AddressDataCNService],
})
export class AddressDataCNModule {}
