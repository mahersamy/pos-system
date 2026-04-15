import {Component, inject, OnInit, signal, DestroyRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {StaffService} from "../../services/staff.service";
import {StaffAdaptModel} from "../../models/staff-adapt.model";
import {CommonModule} from "@angular/common";
import {SkeletonModule} from "primeng/skeleton";
import {UploadFileService} from "../../../../core/services/file-upload/upload-file";
import {ConfirmationService} from "../../../../core/services/confirmation/confirmation";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ErrorState} from "../../../../shared/components/error-state/error-state";

@Component({
    selector: "app-staff-details",
    imports: [CommonModule, SkeletonModule, ErrorState],
    templateUrl: "./staff-details.html",
    styleUrl: "./staff-details.scss",
})
export class StaffDetails implements OnInit {
    private readonly _route = inject(ActivatedRoute);
    private readonly _staffService = inject(StaffService);
    private readonly _router = inject(Router);
    private readonly _uploadFileService = inject(UploadFileService);
    private readonly _confirmationService = inject(ConfirmationService);
    private readonly _destroyRef = inject(DestroyRef);

    /** Current staff data loaded from the API */
    staff = signal<StaffAdaptModel | null>(null);

    /** Loading state for the component */
    loading = signal<boolean>(true);

    /** Error state for handling API failures */
    isError = signal<boolean>(false);

    ngOnInit() {
        const staffId = this._route.snapshot.paramMap.get("id");
        if (staffId) {
            this.getStaffDetails(staffId);
        }
    }

    /**
     * Fetches details for a specific staff member by their ID
     * @param {string} staffId - The unique identifier of the staff member
     */
    getStaffDetails(staffId: string) {
        this.loading.set(true);
        this.isError.set(false);

        this._staffService
            .getStaff(staffId)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (staffData) => {
                    this.staff.set(staffData);
                    this.loading.set(false);
                },
                error: (error) => {
                    console.error("Failed to fetch staff details:", error);
                    this.loading.set(false);
                    this.isError.set(true);
                },
            });
    }

    /**
     * Re-triggers the data fetching protocol for the active staff ID
     */
    retryConnection() {
        const staffId = this._route.snapshot.paramMap.get("id");
        if (staffId) {
            this.getStaffDetails(staffId);
        }
    }

    /**
     * Handles file selection for updating the staff's profile picture
     * @param {Event} event - The HTML file input change event
     */
    async onFileSelected(event: Event) {
        const {previews} = await this._uploadFileService.onFileSelected(event, {
            allowedTypes: ["image/jpeg", "image/png", "image/webp"],
            maxFiles: 1,
            maxSizeMB: 5,
        });

        if (previews.length > 0) {
            const currentStaff = this.staff();
            if (currentStaff && currentStaff.staffProfile) {
                this.staff.set({
                    ...currentStaff,
                    staffProfile: {
                        ...currentStaff.staffProfile,
                        image: previews[0],
                    },
                });
            }
        }
    }

    /**
     * Triggers a confirmation popup to delete the current staff profile
     * Navigates back to the staff list upon successful deletion
     */
    deleteProfile() {
        const currentStaff = this.staff();
        if (!currentStaff) return;

        this._confirmationService.confirm({
            header: "Delete Profile",
            message: "Are you sure you want to delete this staff profile?",
            type: "delete",
            btn1Text: "Delete",
            btn2Text: "Cancel",
            btn1Action: () => {
                this._confirmationService.isBtn1Loading.set(true);
                this._staffService
                    .deleteStaff(currentStaff._id!)
                    .pipe(takeUntilDestroyed(this._destroyRef))
                    .subscribe({
                        next: () => {
                            this._confirmationService.isBtn1Loading.set(false);
                            this._confirmationService.close();
                            this._router.navigate(["/main/staff"]);
                        },
                        error: (error) => {
                            this._confirmationService.isBtn1Loading.set(false);
                            console.error("Error deleting staff:", error);
                        },
                    });
            },
        });
    }

    /**
     * Navigates back to the main staff list
     */
    goBack() {
        this._router.navigate(["/main/staff"]);
    }
}
