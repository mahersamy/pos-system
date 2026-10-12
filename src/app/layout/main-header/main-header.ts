import { Component, inject, OnInit, DestroyRef, output, computed } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LayoutService } from "../../core/services/layout/layout";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { Location } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth/auth";
import { TranslationService } from "../../core/services/translation/translation";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-main-header",
    imports: [RouterLink, TranslateModule],
    templateUrl: "./main-header.html",
    styleUrl: "./main-header.scss",
})
export class MainHeader implements OnInit {
    private readonly _layoutService = inject(LayoutService);
    private readonly _router = inject(Router);
    readonly _authService = inject(AuthService);
    readonly _translationService = inject(TranslationService);

    private readonly _location = inject(Location);
    private readonly _destroyRef = inject(DestroyRef);

    /** Active title value managed by the layout state */
    title = this._layoutService.title;

    /** Safely resolved avatar URL that handles objects, strings, and fallback */
    avatarUrl = computed(() => {
        const u = this._authService.currentUser();
        if (!u) return "https://ui-avatars.com/api/?name=User&background=fac1d9&color=111&bold=true";
        const pic: any = u.profilePicture;
        if (typeof pic === "string" && pic.trim()) return pic;
        if (typeof pic === "object" && pic?.secure_url) return pic.secure_url;
        const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "User";
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fac1d9&color=111&bold=true`;
    });

    onAvatarError(event: Event) {
        const target = event.target as HTMLImageElement;
        if (target) {
            const u = this._authService.currentUser();
            const name = u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "User";
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=fac1d9&color=111&bold=true`;
        }
    }

    ngOnInit() {
        this.updateTitle();

        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(() => {
                this.updateTitle();
            });
    }

    /**
     * Resolves the deepest active route property to update the layout title dynamically.
     * Overrides with predefined route snapshots if accessible.
     */
    private updateTitle() {
        let activeRoute = this._router.routerState.root;
        while (activeRoute.firstChild) {
            activeRoute = activeRoute.firstChild;
        }
        const title = activeRoute.snapshot.data["title"];
        if (title) {
            this._layoutService.setTitle(title);
        }
    }

    /**
     * Reverts navigation back recursively through the browser location stack matrix
     */
    goBack() {
        this._location.back();
    }

    toggleLanguage() {
        this._translationService.toggleLanguage();
    }
}
