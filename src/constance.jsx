export const DevelopMood = true;

export const apiURL = DevelopMood ? "http://192.168.0.184/Projects/Laravel/dayteme/public/api/" : "https://laraveltz.thedevelopment.in/jk/dayteme/public/api";

export const imageUlr = "/dayteme";

export const DateFormat = "DD/MM/YYYY";

// HTTP Codes Success
export const HTTP_CODE_SUCCESS = 200; // OK
export const HTTP_CODE_CREATED = 201; // Resource created
export const HTTP_CODE_NO_CONTENT = 204; // No response body

// HTTP Codes Client Errors
export const HTTP_CODE_BAD_REQUEST = 400; // Invalid input
export const HTTP_CODE_UNAUTHORIZED = 401; // Token missing / invalid
export const HTTP_CODE_FORBIDDEN = 403; // No permission
export const HTTP_CODE_NOT_FOUND = 404; // Resource not found
export const HTTP_CODE_CONFLICT = 409; // Duplicate entry
export const HTTP_CODE_VALIDATION_ERROR = 422; // Validation failed
export const HTTP_CODE_TOO_MANY_REQUESTS = 429; // Rate limiting

// HTTP Codes Server Errors
export const HTTP_CODE_INTERNAL_SERVER_ERROR = 500; // Generic server error
export const HTTP_CODE_BAD_GATEWAY = 502; // Microservice error
export const HTTP_CODE_SERVICE_UNAVAILABLE = 503; // Server down / maintenance

export const NAME_REGEX = /^[A-Za-z0-9]+([ \-'][A-Za-z0-9]+)*$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])(?=\S+$).{8,}$/;
export const PHONE_NUMBER_REGEX = /^[0-9]\d{9}$/;

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const ColorCards = [
	{key: "primary", label: "Primary"},
	{key: "secondary", label: "Secondary"},
	{key: "info", label: "Info"},
	{key: "success", label: "Success"},
	{key: "warning", label: "Warning"},
	{key: "error", label: "Error"},
];
