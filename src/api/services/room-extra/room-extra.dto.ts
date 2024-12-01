export interface RoomExtraRequestDto {
	extraName: string;
	description: string;
	price: number;
}

export interface RoomExtraResponseDto extends RoomExtraRequestDto {
	key: number;
}
