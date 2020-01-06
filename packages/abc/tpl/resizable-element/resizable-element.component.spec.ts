import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableElementComponent } from './resizable-element.component';

describe('ResizableElementComponent', () => {
  let component: ResizableElementComponent;
  let fixture: ComponentFixture<ResizableElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResizableElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizableElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
