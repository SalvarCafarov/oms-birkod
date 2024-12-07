export interface CustomerRequestDto {
	name: string;
	surName: string;
	fatherName: string;
	telephoneNo: string;
	passportNo: string;
	email: string;
	birthday: Date;
}

export interface CustomerResponseDto {
	name: string;
	surName: string;
	fatherName: string;
	telephoneNo: string;
	passportNo: string;
	email: string;
	birthday: Date;
	key: number;
}
