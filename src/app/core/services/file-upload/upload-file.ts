import {Injectable} from "@angular/core";

export interface FileUploadConfig {
    allowedTypes: string[];
    maxFiles: number;
    maxSizeMB: number;
}

@Injectable({
    providedIn: "root",
})
export class UploadFileService {
    /**
     * Handles file selection from an input event.
     * @param event The file input change event
     * @param config Optional configuration for validation
     * @returns A promise resolving to an array of files and their Base64 previews
     */
    async onFileSelected(
        event: Event,
        config: Partial<FileUploadConfig> = {}
    ): Promise<{files: File[]; previews: string[]}> {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            return {files: [], previews: []};
        }

        const {allowedTypes = ["image/*"], maxFiles = 1, maxSizeMB = 5} = config;

        const filesArray = Array.from(input.files).slice(0, maxFiles);
        const validFiles: File[] = [];

        for (const file of filesArray) {
            const fileSizeMB = file.size / (1024 * 1024);

            const isTypeAllowed = allowedTypes.some((type) => {
                if (type.endsWith("/*")) {
                    const baseType = type.split("/")[0];
                    return file.type.startsWith(baseType);
                }
                return type === file.type;
            });

            if (!isTypeAllowed) {
                alert(
                    `File type ${file.type} not allowed. Please choose: ${allowedTypes.join(", ")}`
                );
                continue;
            }

            if (fileSizeMB > maxSizeMB) {
                alert(`File size too large. Maximum allowed is ${maxSizeMB}MB.`);
                continue;
            }

            validFiles.push(file);
        }

        // Generate previews
        const previewPromises = validFiles.map((file) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            });
        });

        const previews = await Promise.all(previewPromises);

        // Clear input value to allow re-selecting the same file if needed
        input.value = "";

        return {files: validFiles, previews};
    }
}
