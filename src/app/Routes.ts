import { GalleryComponent } from './components/gallery/gallery.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';

export const route = [{
  path: '',
  redirectTo: 'login',
  pathMatch: 'full',
},
{
  path: 'login',
  component: LoginComponent,
},
{
  path: 'gallery',
  canActivate: [AuthGuard],
  component: GalleryComponent,
}, {
  path: '**',
  redirectTo: 'login',
  pathMatch: 'full',
}]