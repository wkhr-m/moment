import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { mergeMap, Observable, of } from 'rxjs';
import { AuthService } from './../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.getAuthState().pipe(
      mergeMap((user: User | null) => {
        return user ? of(true) : this.router.navigateByUrl('/login');
      })
    );
  }
}
