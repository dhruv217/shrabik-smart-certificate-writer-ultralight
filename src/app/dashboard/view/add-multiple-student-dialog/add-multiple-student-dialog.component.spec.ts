import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMultipleStudentDialogComponent } from './add-multiple-student-dialog.component';

describe('AddMultipleStudentDialogComponent', () => {
  let component: AddMultipleStudentDialogComponent;
  let fixture: ComponentFixture<AddMultipleStudentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMultipleStudentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMultipleStudentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
