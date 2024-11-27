import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParseHtmlPipe } from '@pipes';
import { AdminService } from '@services';
import { Requirement } from '@types';
import { PrimeNgModule } from '@ui/primeng.module';

@Component({
  selector: 'app-requirements-list',
  standalone: true,
  imports: [PrimeNgModule, ParseHtmlPipe],
  templateUrl: './requirements-list.component.html',
  styles: ``,
})
export class RequirementsListComponent {
  private router = inject(Router);
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);

  courseId = this.route.snapshot.params['room_id'];

  loading = signal(true);

  requirements = signal<Requirement[]>([]);

  ngOnInit() {
    this.getRequirements();
  }

  getRequirements() {
    this.loading.set(true);
    this.adminService
      .getGeneratedRequirements(this.courseId)
      .subscribe((requirements) => {
        this.requirements.set(requirements);
        this.loading.set(false);
      });
  }

  navigateToAdminHome() {
    this.router.navigate(['admin']);
  }
}
