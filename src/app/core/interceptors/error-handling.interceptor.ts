import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

     switch(error.status){
      case 401:
        errorMessage = 'Unauthorized';
        break;
      case 403:
        errorMessage = 'Forbidden';
        break;
      case 404:
        errorMessage = 'Not Found';
        break;
      case 500:
        errorMessage = 'Internal Server Error';
        break;
     }

      // Display via PrimeNG Toast
      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000,
      });
   
      return throwError(() => error);
    })
  );
};
