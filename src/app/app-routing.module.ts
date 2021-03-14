import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BoardComponent} from './board/board.component';
import {HostComponent} from './host/host.component';

const routes: Routes = [
  {path: 'board', component: BoardComponent},
  {path: '**', component: HostComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
