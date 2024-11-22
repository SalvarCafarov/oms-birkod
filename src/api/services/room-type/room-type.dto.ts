// DTO for Add Room Type
export interface RoomTypeRequestDto {
	typeName: string;
	description: string;
}

// DTO for Update Room Type
export interface RoomTypeResponseDto {
	key: number;
	typeName: string;
	description: string;
}

// DTO for Delete Room Type
export interface DeleteRoomTypeDto {
	key: number;
}

// Response for add, update, and delete operations
export interface BasicResponseDto {
	success: boolean;
	message: string;
}
