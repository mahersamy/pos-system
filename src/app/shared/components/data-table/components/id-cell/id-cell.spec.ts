import {ComponentFixture, TestBed} from "@angular/core/testing";

import {IdCell} from "./id-cell";

describe("IdCell", () => {
    let component: IdCell;
    let fixture: ComponentFixture<IdCell>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IdCell],
        }).compileComponents();

        fixture = TestBed.createComponent(IdCell);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
