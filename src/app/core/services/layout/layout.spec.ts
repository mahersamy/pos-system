import {TestBed} from "@angular/core/testing";
import {LayoutService} from "./layout";

describe("LayoutService", () => {
    let service: LayoutService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LayoutService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
