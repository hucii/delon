import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DndElementComponent } from './dnd-element.component';

describe('DndElementComponent', () => {
  let component: DndElementComponent;
  let fixture: ComponentFixture<DndElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DndElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DndElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
