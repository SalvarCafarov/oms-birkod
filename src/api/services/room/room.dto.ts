export interface RoomRequestDto {
	roomNumber: string;
	roomTypeId: number;
	isAvailable: boolean;
}

export interface RoomResponseDto extends RoomRequestDto {
	key: number;
}
