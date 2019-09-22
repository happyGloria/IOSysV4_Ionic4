import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BorrowRepayListPage } from './borrow-repay-list.page';

const routes: Routes = [
  {
    path: '',
    component: BorrowRepayListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BorrowRepayListPage],
  entryComponents: []
})
export class BorrowRepayListPageModule {}
