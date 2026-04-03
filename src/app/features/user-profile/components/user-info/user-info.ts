import {Component, signal} from "@angular/core";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: "app-user-info",
    imports: [InputTextModule, PasswordModule, NgOptimizedImage],
    templateUrl: "./user-info.html",
    styleUrl: "./user-info.scss",
})
export class UserInfo {
    imageUrl = signal<string>(
        "https://ui-avatars.com/api/?name=John+Doe&background=fac1d9&color=111"
    );

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const fileSize = file.size / 1024 / 1024; // MB

            if (!file.type.startsWith("image/")) {
                alert("Please select an image file.");
                return;
            }

            if (fileSize > 5) {
                alert("File size must be less than 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.imageUrl.set(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }
}
