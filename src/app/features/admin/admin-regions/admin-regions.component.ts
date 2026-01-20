import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../../../shared/components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { TranslationService } from '../../../core/services/translation.service';
import { RegionService } from '../../../core/services/region.service';
import { Region } from '../../../core/models';

interface RegionWithCount extends Region {
  restaurantCount?: number;
}

@Component({
  selector: 'app-admin-regions',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent, HeaderComponent],
  templateUrl: './admin-regions.component.html',
  styleUrl: './admin-regions.component.css'
})
export class AdminRegionsComponent implements OnInit {
  t = inject(TranslationService);
  private regionService = inject(RegionService);

  searchQuery = '';
  statusFilter = '';
  showForm = signal(false);
  editingRegion = signal<RegionWithCount | null>(null);
  loading = signal(false);

  formData = {
    name: '',
    code: '',
    description: '',
    isActive: true
  };

  regions = signal<RegionWithCount[]>([]);
  filteredRegions = signal<RegionWithCount[]>([]);

  ngOnInit(): void {
    this.loadRegions();
  }

  loadRegions(): void {
    this.loading.set(true);
    this.regionService.getAll().subscribe({
      next: (data) => {
        const regionsWithCount = data.map(r => ({ ...r, restaurantCount: 0 }));
        this.regions.set(regionsWithCount);
        this.filterRegions();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load regions:', err);
        this.loading.set(false);
      }
    });
  }

  filterRegions(): void {
    let result = this.regions();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.code.toLowerCase().includes(query) ||
        (r.description || '').toLowerCase().includes(query)
      );
    }

    if (this.statusFilter) {
      const isActive = this.statusFilter === 'active';
      result = result.filter(r => r.isActive === isActive);
    }

    this.filteredRegions.set(result);
  }

  openAddForm(): void {
    this.editingRegion.set(null);
    this.formData = { name: '', code: '', description: '', isActive: true };
    this.showForm.set(true);
  }

  openEditForm(region: RegionWithCount): void {
    this.editingRegion.set(region);
    this.formData = {
      name: region.name,
      code: region.code,
      description: region.description || '',
      isActive: region.isActive
    };
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingRegion.set(null);
    this.formData = { name: '', code: '', description: '', isActive: true };
  }

  saveRegion(): void {
    if (!this.formData.name || !this.formData.code) return;

    const editing = this.editingRegion();
    if (editing) {
      this.regionService.update(editing.id, {
        name: this.formData.name,
        code: this.formData.code.toUpperCase(),
        description: this.formData.description,
        isActive: this.formData.isActive
      }).subscribe({
        next: () => {
          this.loadRegions();
          this.closeForm();
        },
        error: (err) => console.error('Failed to update region:', err)
      });
    } else {
      this.regionService.create({
        name: this.formData.name,
        code: this.formData.code.toUpperCase(),
        description: this.formData.description,
        isActive: this.formData.isActive
      }).subscribe({
        next: () => {
          this.loadRegions();
          this.closeForm();
        },
        error: (err) => console.error('Failed to create region:', err)
      });
    }
  }

  toggleStatus(region: RegionWithCount): void {
    this.regionService.toggleStatus(region.id).subscribe({
      next: () => this.loadRegions(),
      error: (err) => console.error('Failed to toggle status:', err)
    });
  }

  deleteRegion(region: RegionWithCount): void {
    if ((region.restaurantCount || 0) > 0) {
      alert(`Cannot delete "${region.name}" because it has ${region.restaurantCount} restaurants assigned.`);
      return;
    }
    if (confirm(`Are you sure you want to delete "${region.name}"?`)) {
      this.regionService.delete(region.id).subscribe({
        next: () => this.loadRegions(),
        error: (err) => console.error('Failed to delete region:', err)
      });
    }
  }

  getTotalRestaurants(): number {
    return this.regions().reduce((sum, r) => sum + (r.restaurantCount || 0), 0);
  }

  getActiveRegionsCount(): number {
    return this.regions().filter(r => r.isActive).length;
  }
}
