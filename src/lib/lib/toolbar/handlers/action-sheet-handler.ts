import { merge, Observable, Subject } from 'rxjs';

import { ActionSheetConfig, ActionConfig } from '../help';

import { Dropdown } from './utils/dropdown';
import { Handler } from './help';
import { Matcher } from '../../matcher/matcher';
import { Commander } from '../../commands/commander';

export class ActionSheetHandler {
  readonly elementRef: HTMLElement;
  options: ActionSheetOptionHandler[] = [];

  constructor(private config: ActionSheetConfig) {

    const dropdownButton = document.createElement('span');
    dropdownButton.classList.add(...config.classes || []);

    const menu = document.createElement('div');
    menu.classList.add('tanbo-editor-toolbar-menu');

    config.actions.forEach(option => {
      const item = new ActionSheetOptionHandler(option);
      menu.appendChild(item.elementRef);
      this.options.push(item);
    });

    this.elementRef = new Dropdown(
      dropdownButton,
      menu,
      merge(...this.options.map(item => item.onApply)),
      config.tooltip
    ).elementRef;
  }
}

export class ActionSheetOptionHandler implements Handler {
  readonly elementRef = document.createElement('button');
  onApply: Observable<void>;
  onMatched: Observable<ActionConfig>;
  matcher: Matcher;
  execCommand: Commander;
  priority: number;
  private eventSource = new Subject<void>();
  private matchedEvent = new Subject<ActionConfig>();

  constructor(private option: ActionConfig) {
    this.priority = option.priority;
    this.onApply = this.eventSource.asObservable();
    this.onMatched = this.matchedEvent.asObservable();
    this.elementRef.classList.add('tanbo-editor-toolbar-menu-item');
    this.elementRef.type = 'button';
    if (option.classes) {
      this.elementRef.classList.add(...(option.classes || []));
    }
    this.elementRef.innerText = option.label;
    this.elementRef.addEventListener('click', () => {
      this.eventSource.next();
    });
    this.execCommand = option.execCommand;
    this.matcher = new Matcher(option.match);
  }

  updateStatus(h: boolean): void {

  }
}