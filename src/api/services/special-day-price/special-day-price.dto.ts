export interface SpecialDayPriceRequestDto {
	roomTypeId: number;
	startDate: Date;
	endDate: Date;
	specialDailyRate: number;
	specialHourlyRate: number;
	description: string;
}

export interface SpecialDayPriceResponseDto {
	roomTypeName: string;
	startDate: Date;
	endDate: Date;
	specialDailyRate: number;
	specialHourlyRate: number;
	description: string;
	key: number;
}
