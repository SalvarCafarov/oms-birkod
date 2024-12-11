export interface CustomerRequestDto {
	name: string;
	surname: string;
	fatherName: string;
	telephoneNo: string;
	passportNo: string;
	email: string;
	birthday: Date;
}

export interface CustomerResponseDto {
	name: string;
	surname: string;
	fatherName: string;
	telephoneNo: string;
	passportNo: string;
	email: string;
	birthday: Date;
	key: number;
}
