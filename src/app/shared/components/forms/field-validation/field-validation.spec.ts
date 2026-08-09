import {ComponentFixture, TestBed} from "@angular/core/testing";

import {FieldValidation} from "./field-validation";

describe("FieldValidation", () => {
    let component: FieldValidation;
    let fixture: ComponentFixture<FieldValidation>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FieldValidation],
        }).compileComponents();

        fixture = TestBed.createComponent(FieldValidation);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
