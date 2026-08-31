import { Component, input } from '@angular/core';

export type IconName =
  | 'settings'
  | 'sliders'
  | 'lock'
  | 'unlock'
  | 'folder-up'
  | 'trash'
  | 'download'
  | 'pencil'
  | 'check'
  | 'x'
  | 'crown'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'clock';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<number>(20);
}
