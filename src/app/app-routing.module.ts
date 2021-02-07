import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HostComponent} from './host/host.component';
import {BoardComponent} from './board/board.component';
import {AppComponent} from './app.component';

const routes: Routes = [
  {path: 'host', component: HostComponent},
  {path: 'board', component: BoardComponent},
  {path: '**', component: AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
