export interface RoomRequestDto {
	roomNumber: string;
	roomTypeId: number;
	// roomStatus: number;
}

export interface RoomResponseDto {
	key: number;
	roomNumber: string;
	roomTypeId: number;
	roomStatus: number;
}
