import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MorphicInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          // Transform response data to match frontend conventions
          if (event.body) {
            const transformedBody = this.transformApiResponse(event.body);
            return event.clone({
              body: transformedBody
            });
          }
        }
        return event;
      })
    );
  }

  private transformApiResponse(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformApiResponse(item));
    } else if (obj !== null && typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const transformedKey = this.transformKey(key);
          // Recursively transform nested objects/arrays
          newObj[transformedKey] = this.transformApiResponse(obj[key]);
        }
      }
      return newObj;
    }
    return obj;
  }

  private transformKey(key: string): string {
    // Handle specific ID field transformation
    if (key === 'id_') {
      return 'id';
    }
    
    // Convert snake_case to camelCase
    return this.toCamelCase(key);
  }

  private toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }
}