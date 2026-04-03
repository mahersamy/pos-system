import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Sidebar} from "./sidebar";
import {provideRouter} from "@angular/router";

describe("SidebarComponent", () => {
    let component: Sidebar;
    let fixture: ComponentFixture<Sidebar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Sidebar],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(Sidebar);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
