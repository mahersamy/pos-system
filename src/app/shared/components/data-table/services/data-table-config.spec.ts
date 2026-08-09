import {TestBed} from "@angular/core/testing";

import {DataTableConfig} from "./data-table-config";

describe("DataTableConfig", () => {
    let service: DataTableConfig<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DataTableConfig);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
