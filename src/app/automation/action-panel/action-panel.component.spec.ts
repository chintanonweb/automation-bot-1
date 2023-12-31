import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPanelComponent } from './action-panel.component';

describe('AutomationPanelComponent', () => {
  let component: ActionPanelComponent;
  let fixture: ComponentFixture<ActionPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionPanelComponent]
    });
    fixture = TestBed.createComponent(ActionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
