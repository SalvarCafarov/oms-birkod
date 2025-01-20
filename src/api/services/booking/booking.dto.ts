// src/api/services/booking/BookingRequestDto.ts

export interface GuestDto {
	name: string;
	surname: string;
	fatherName?: string; // optional
	passportNo?: string; // optional
	birthday: string; // ISO date format
}

export interface BookingRequestDto {
	customerId: number;
	travelAgencyId?: number; // optional
	startDate: string; // ISO 8601
	endDate?: string; // optional - ISO 8601
	checkIn?: boolean; // optional (boolean)
	isHourly: boolean; // required
	childCount?: number; // optional
	description?: string; // optional
	rooms: number[]; // multi-select
	guests?: GuestDto[] | null; // optional array (null or empty)

	roomExtras?: number[]; // optional - multi-select

	discountAmount: number; // required (discount percentage or amount)
	discountReason: string; // required (reason for discount)
}

// UpdateBookingDto - example for a different endpoint
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
	customerId: number;
	travelAgencyId?: number; // optional
	startDate: string; // ISO 8601
	endDate?: string; // optional - ISO 8601
	checkIn?: boolean; // optional (boolean)
	isHourly: boolean; // required
	childCount?: number; // optional
	description?: string; // optional
	rooms: number[]; // multi-select
	guests?: GuestDto[] | null; // optional array (null or empty)

	roomExtras?: number[]; // optional - multi-select

	discountAmount: number; // required (discount percentage or amount)
	discountReason: string; // required (reason for discount)
}

export interface BookingDynamicDto {
	customerName: string;
	travelAgencyName?: string; // optional
	startDate: string; // ISO 8601
	endDate?: string; // optional - ISO 8601
	checkIn?: boolean; // optional (boolean)
	checkOut?: boolean; // optional (boolean)
	finalPrice: number; // required
	key: number; // required
}
