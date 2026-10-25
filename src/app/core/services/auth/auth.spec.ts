import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { AuthFacade } from "./auth.facade";

describe("AuthFacade", () => {
    let facade: AuthFacade;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                AuthFacade,
            ],
        });
        facade = TestBed.inject(AuthFacade);
    });

    it("should be created", () => {
        expect(facade).toBeTruthy();
    });
});
