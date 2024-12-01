export interface RoomPriceRequestDto {
	roomTypeId: number;
	dailyRate: number;
	hourlyRate: number;
}

export interface RoomPriceResponseDto extends RoomPriceRequestDto {
	key: number;
}
