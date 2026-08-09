import {TestBed} from "@angular/core/testing";
import {HttpInterceptorFn} from "@angular/common/http";

import {errorHandlingInterceptorTsInterceptor} from "./error-handling.interceptor.ts-interceptor";

describe("errorHandlingInterceptorTsInterceptor", () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => errorHandlingInterceptorTsInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(interceptor).toBeTruthy();
    });
});
