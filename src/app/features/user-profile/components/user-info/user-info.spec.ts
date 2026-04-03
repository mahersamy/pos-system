import {ComponentFixture, TestBed} from "@angular/core/testing";

import {UserInfo} from "./user-info";

describe("UserInfo", () => {
    let component: UserInfo;
    let fixture: ComponentFixture<UserInfo>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserInfo],
        }).compileComponents();

        fixture = TestBed.createComponent(UserInfo);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
