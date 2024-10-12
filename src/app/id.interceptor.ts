import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class IdInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          // Modify the response data if it's the expected format
          if (event.body) {
            const transformedBody = this.transformIds(event.body);
            return event.clone({
              body: transformedBody
            });
          }
        }
        return event; // Ensure you return the event for other types
      })
    );
  }

  private transformIds(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformIds(item)); // Recursively handle arrays
    } else if (obj !== null && typeof obj === 'object') {
      // Create a new object to avoid mutating the original
      const newObj: any = { ...obj };
      for (const key in newObj) {
        if (newObj.hasOwnProperty(key)) {
          // Check if the key is id_ and convert it
          if (key === 'id_') {
            newObj.id = newObj[key];
            delete newObj[key];  // Remove id_ if you want
          } else {
            // Recursively check nested objects
            newObj[key] = this.transformIds(newObj[key]);
          }
        }
      }
      return newObj; // Return the transformed object
    }
    return obj; // Return the original value if it's neither an array nor an object
  }
}
