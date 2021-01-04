import { GalleryComponent } from "./components/gallery/gallery.component";
import { LoginComponent } from "./components/login/login.component";

export const route = [{
  path: "",
  redirectTo: "login",
  pathMatch: 'full',
},
{
  path: "login",
  component: LoginComponent,
},
{
  path: "gallery",
  component: GalleryComponent,
}, {
  path: "**",
  redirectTo: "login",
  pathMatch: 'full',
}]