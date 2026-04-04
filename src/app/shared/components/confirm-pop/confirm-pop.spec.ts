import {ComponentFixture, TestBed} from "@angular/core/testing";

import {ConfirmPop} from "./confirm-pop";

describe("ConfirmPop", () => {
    let component: ConfirmPop;
    let fixture: ComponentFixture<ConfirmPop>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfirmPop],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmPop);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
