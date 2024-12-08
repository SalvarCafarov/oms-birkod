// DTO for Add TravelAgency
export interface TravelAgencyRequestDto {
	agencyName: string;
	formNo: string;
	startDate: Date;
	endDate: Date;
	isActive: string;
	discountRate: number;
}
export interface TravelAgencyCreateRequestDto {
	agencyName: string;
	formNo: string;
	startDate: Date;
	endDate: Date;
	discountRate: number;
}
// DTO for Update TravelAgency
export interface TravelAgencyResponseDto {
	key: number;
	agencyName: string;
	formNo: string;
	startDate: Date;
	endDate: Date;
	isActive: string;
	discountRate: number;
}

// DTO for Delete TravelAgency
export interface DeleteTravelAgencyDto {
	key: number;
}

// Response for add, update, and delete operations
export interface BasicResponseDto {
	success: boolean;
	message: string;
}
