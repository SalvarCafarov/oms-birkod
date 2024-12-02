// DTO for Add TravelAgency
export interface TravelAgencyRequestDto {
	agencyName: string;
	discountRate: number;
}

// DTO for Update TravelAgency
export interface TravelAgencyResponseDto {
	key: number;
	agencyName: string;
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
