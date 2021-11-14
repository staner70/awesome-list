import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBootstrapModule } from './modules/ngx-bootstrap.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SidenavComponent
  ],
  imports: [
    CommonModule,
    NgxBootstrapModule
  ],
  exports: [
    CommonModule,
    NgxBootstrapModule,
    SidenavComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
