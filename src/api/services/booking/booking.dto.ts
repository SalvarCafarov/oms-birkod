export interface GuestDto {
	name: string;
	surname: string;
	fatherName: string;
	passportNo: string;
	birthday: string; // ISO date format
}

export interface BookingRequestDto {
	customerId: number;
	travelAgencyId?: number; // Opsiyonel
	startDate: string; // ISO 8601
	endDate?: string; // Opsiyonel - ISO 8601
	checkIn?: boolean; // Opsiyonel
	isHourly: boolean; // Zorunlu
	childCount?: number; // Opsiyonel
	description?: string; // Opsiyonel
	rooms: number[]; // Multi-select
	guests?:
		| {
				// Opsiyonel guests
				name: string;
				surname: string;
				fatherName?: string; // Opsiyonel
				passportNo?: string; // Opsiyonel
				birthday: string; // ISO 8601
		  }[]
		| null;
	roomExtras?: number[]; // Opsiyonel - Multi-select
	discountAmount: number; // Zorunlu (endirim faizi)
	discountReason: string; // Zorunlu (endirim səbəbi)
}

// UpdateBookingDto: Güncelleme isteğinde
// Örnek body:
/*
{
  "key": 0,
  "bookingNumber": "string",
  "bookingTypeId": 0,
  "isAvailable": true
}
*/
export interface UpdateBookingDto {
	key: number;
	bookingNumber: string;
	bookingTypeId: number;
	isAvailable: boolean;
}
