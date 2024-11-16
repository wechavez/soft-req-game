import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DragDropModule } from 'primeng/dragdrop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@NgModule({
  imports: [
    MenubarModule,
    RippleModule,
    CardModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    MenuModule,
    AvatarModule,
    SkeletonModule,
    ToastModule,
    DragDropModule,
    ProgressSpinnerModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    InputNumberModule,
    TabViewModule,
    ChipModule,
    IconFieldModule,
    InputIconModule,
  ],
  exports: [
    MenubarModule,
    RippleModule,
    CardModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    MenuModule,
    AvatarModule,
    SkeletonModule,
    ToastModule,
    DragDropModule,
    ProgressSpinnerModule,
    ToolbarModule,
    TableModule,
    DialogModule,
    InputNumberModule,
    TabViewModule,
    ChipModule,
    IconFieldModule,
    InputIconModule,
  ],
  providers: [MessageService],
})
export class PrimeNgModule {}
