import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RepoDetailsFacade } from './repo-details.facade';
import { ScreenService } from '../../core/services/screen.service';

@Component({
  selector: 'app-repo-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './repo-detail.component.html',
  styleUrls: ['./repo-detail.component.scss'],
})
export class RepoDetailComponent implements OnInit, OnChanges {
  private route = inject(ActivatedRoute);
  protected facade = inject(RepoDetailsFacade);
  protected screen = inject(ScreenService);

  @Input() fullName?: string | null = null;

  ngOnInit(): void {
    if (!this.fullName) {
      const fromRoute = this.route.snapshot.paramMap.get('fullName');

      if (fromRoute) {
        this.facade.load(fromRoute);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fullName'] && changes['fullName'].currentValue) {
      this.facade.load(changes['fullName'].currentValue);
    }
  }
}
