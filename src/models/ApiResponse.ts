import {ApplicationStatus} from "../rest/models";

export class ApiError {
    field: string;
    code: string;
}

export class ApiResponse {
    status: ApplicationStatus;
    data?: any;
    message?: string;
    errors?: ApiError[];
}