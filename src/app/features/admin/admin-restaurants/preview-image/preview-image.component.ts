import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss']
})
export class PreviewImageComponent implements OnChanges {
  @Input() src: string | null | undefined;
  @Input() alt: string | null | undefined;

  safeSrc: SafeUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    const value = (this.src || '').trim();
    this.safeSrc = value ? this.sanitizer.bypassSecurityTrustUrl(value) : null;
  }
}
