export interface SpecialDayPriceRequestDto {
	RoomTypeId: number;
	StartDate: Date;
	EndDate: Date;
	SpecialDailyRate: number;
	SpecialHourlyRate: number;
	Description: string;
}

export interface SpecialDayPriceResponseDto extends SpecialDayPriceRequestDto {
	key: number;
}
