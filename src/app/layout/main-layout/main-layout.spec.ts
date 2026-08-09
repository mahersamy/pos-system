import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MainLayout} from "./main-layout";
import {provideRouter} from "@angular/router";

describe("MainLayoutComponent", () => {
    let component: MainLayout;
    let fixture: ComponentFixture<MainLayout>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MainLayout],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(MainLayout);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
