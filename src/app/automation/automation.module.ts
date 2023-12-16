import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionPanelComponent } from './action-panel/action-panel.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ActionPanelComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    ActionPanelComponent
  ]
})
export class AutomationModule { }
