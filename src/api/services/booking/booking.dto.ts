export interface BookingRequestDto {
	customerId: number;
	travelAgencyId?: number;
	startDate: string; // ISO date format
	endDate?: string; // Optional ISO date format
	checkIn: boolean;
	isHourly: boolean;
	childCount: number;
	description: string;
	rooms: number[]; // Array of room IDs
	guests: GuestDto[];
	roomExtras: number[]; // Array of extra IDs
	discountAmount: number;
	discountReason: string;
}

export interface GuestDto {
	name: string;
	surname: string;
	fatherName: string;
	passportNo: string;
	birthday: string; // ISO date format
}
