import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFrameComponent } from './print-frame.component';

describe('PrintFrameComponent', () => {
  let component: PrintFrameComponent;
  let fixture: ComponentFixture<PrintFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
