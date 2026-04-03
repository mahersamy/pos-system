import {Injectable, signal} from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class LayoutService {
    title = signal<string>("Dashboard");

    setTitle(newTitle: string) {
        this.title.set(newTitle);
    }
}
