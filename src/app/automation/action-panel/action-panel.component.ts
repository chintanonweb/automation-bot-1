
import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { predictElements } from "../automation.util";
import { AutomationStep } from "../automation-step.constant";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.css']
})
export class ActionPanelComponent {

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef
  ) { }

  readonly AutomationStep = AutomationStep;

  showRunBtn = false;

  populateTextControl = new FormControl('');
  currentStep: AutomationStep = AutomationStep.SELECT_ELEMENT;

  get elementSelectionAllowed(): boolean {
    return this.currentStep === AutomationStep.SELECT_ELEMENT;
  }

  get selectedElementsNumber(): number {
    return this.selectedElements.size;
  }

  get predictedElementsNumber(): number {
    return this.predictedElements.size;
  }

  get selectedAndPredictedElements(): HTMLElement[] {
    return [...this.selectedElements.values(), ...this.predictedElements.values()]
  }

  get resetButtonAllowed(): boolean {
    return this.currentStep !== AutomationStep.SELECT_ELEMENT;
  }

  private selectedElements: Set<HTMLElement> = new Set<HTMLElement>();
  private predictedElements: Set<HTMLElement> = new Set<HTMLElement>();

  @HostListener('document:mouseover', ['$event'])
  onMouseOver(e: any): void {
    const el: HTMLElement = e.target;

    if (this.isAutomationElement(el) || !this.elementSelectionAllowed) {
      return;
    }

    this.renderer.addClass(el, 'highlighted');

    el.addEventListener('click', this.clickInterceptor, true);
  }

  @HostListener('document:mouseout', ['$event'])
  onMouseOut(e: any): void {
    const el: HTMLElement = e.target;

    if (this.isAutomationElement(el) || !this.elementSelectionAllowed) {
      return;
    }

    this.renderer.removeClass(el, 'highlighted');
    el.removeEventListener('click', this.clickInterceptor, true);
  }

  private toggleClickedElement(el: HTMLElement): void {
    if (this.selectedElements.delete(el)) {
      this.renderer.removeClass(el, 'selected');
    } else {
      this.selectedElements.add(el);
      this.renderer.addClass(el, 'selected');
    }
  }

  private clickInterceptor = (e: MouseEvent) => {
    e.stopImmediatePropagation();

    this.toggleClickedElement(e.target as HTMLElement);

    const predictedElements = predictElements(this.selectedElements);
    this.predictedElements.forEach(el => this.renderer.removeClass(el, 'predicted'));
    this.predictedElements.clear();
    predictedElements.forEach(el => this.predictedElements.add(el));
    this.predictedElements.forEach(el => this.renderer.addClass(el, 'predicted'));
  };

  private isAutomationElement(el: HTMLElement) {
    return this.elRef.nativeElement.contains(el);
  }

  /* Click handlers */

  handleApproveSelectionClicked(): void {
    this.currentStep = AutomationStep.SELECT_ACTION
  }

  handleResetClicked(): void {
    this.selectedElements.forEach(el => this.renderer.removeClass(el, 'selected'));
    this.predictedElements.forEach(el => this.renderer.removeClass(el, 'predicted'));
    this.selectedElements.clear();
    this.predictedElements.clear();

    this.currentStep = AutomationStep.SELECT_ELEMENT;
  }

  handlePerformPopulateInputClicked(): void {
    const value = this.populateTextControl.value ?? '';
    this.selectedAndPredictedElements.forEach(el => {
      const input = el?.querySelector('input');
      if (input)
        this.renderer.setAttribute(input, 'value', value)
    });
    this.currentStep = AutomationStep.SELECT_ACTION;
  }

  applyClassesToElements(element: string): void {
    // Apply classes to child elements of selected elements
    this.selectedElements.forEach(parent => {
      parent.querySelectorAll(element)?.forEach(child => {
        this.renderer.addClass(child, 'selected');
      });
      this.renderer.removeClass(parent, 'selected');
    });

    // Apply classes to child elements of predicted elements
    this.predictedElements.forEach(parent => {
      parent.querySelectorAll(element)?.forEach(child => {
        this.renderer.addClass(child, 'predicted');
      });
      this.renderer.removeClass(parent, 'predicted');
    });


    if (element === 'input') {
      this.currentStep = AutomationStep.SELECT_INPUT;
    } else if (element === 'button') {
      this.showRunBtn = true;
      this.currentStep = AutomationStep.SELECT_ACTION;
    }
  }

  handleSelectActionClicked(): void {
    this.currentStep = AutomationStep.SELECT_ACTION;
  }

  buttonClickHandler() {
    this.selectedAndPredictedElements.forEach(element => {
      const button = element?.querySelector('button');
      if (button)
        button.click();
    })
    this.currentStep = AutomationStep.SELECT_ELEMENT;
  }
}