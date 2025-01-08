// src/views/dashboard/booking/create/CreateBookingForm.tsx

import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Box, Button, Checkbox, Collapse, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { booking, BookingRequestDto } from 'api/services/booking';
import { customer, CustomerResponseDto } from 'api/services/customer';
import { room, RoomResponseDto } from 'api/services/room';
import { roomExtra, RoomExtraResponseDto } from 'api/services/room-extra';
import { travelAgency } from 'api/services/travel-agency';
import { Modal } from 'components/modal/modal';
import dayjs from 'dayjs';
import { queryClient } from 'main';
import { forwardRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { AddCustomerForm } from 'views/dashboard/customer/create/create-customer-form';
import * as Yup from 'yup';

import bookingSchema from './validationSchema';

// FormData arayüzü
export interface FormData {
	CustomerId: number;
	TravelAgencyId?: number;
	startDate: string; // ISO 8601 olarak tutacağız
	endDate?: string | null; // ISO 8601 veya null
	checkIn?: boolean | null; // ISO 8601 veya null
	isHourly: boolean;
	childCount?: number | null; // sayısal (varsayılan: 0)
	description?: string | null;
	discountAmount: number; // sayısal (Yup'ta transform ile string -> number)
	discountReason?: string | null;
	rooms: number[];
	roomExtras?: number[] | null;
	guests:
		| {
				name: string;
				surname: string;
				fatherName?: string | null;
				passportNo?: string | null;
				birthday: string; // ISO 8601 string
		  }[]
		| null;
}

// Basit bir CustomTextField örneği
const CustomTextField = forwardRef((props, ref) => <TextField {...props} inputRef={ref} />);
CustomTextField.displayName = 'CustomTextField';

export const CreateBookingForm = ({ handleDialogToggle }: { handleDialogToggle: () => void }) => {
	const { t } = useTranslation();

	// useForm: bookingSchema ile Yup doğrulaması
	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>({
		resolver: yupResolver<Yup.AnyObjectSchema>(bookingSchema),
		defaultValues: {
			CustomerId: 0,
			startDate: dayjs().toISOString(),
			isHourly: false,
			TravelAgencyId: undefined,
			childCount: null,
			endDate: null,
			checkIn: null,
			description: null,
			discountAmount: 0, // numeric default
			discountReason: null,
			rooms: [],
			roomExtras: null,
			guests: [
				{
					name: '',
					surname: '',
					fatherName: null,
					passportNo: null,
					birthday: dayjs().toISOString(),
				},
			],
		},
	});

	// Local states
	const [showDiscountFields, setShowDiscountFields] = useState(false);
	const [showGuests, setShowGuests] = useState(false);
	const [showCreateCustomerToggle, setShowCreateCustomerToggle] = useState(false);

	// TanStack React Query - data fetch
	const { data: travelAgencyOptions = [] } = useQuery({
		queryKey: ['travelAgency'],
		queryFn: () => travelAgency.getListNonPaging(),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	const { data: customerOptions = [] } = useQuery({
		queryKey: ['customer'],
		queryFn: () => customer.getListNonPaging(),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	const { data: roomList = [] } = useQuery({
		queryKey: ['room'],
		queryFn: () => room.getListNonPaging(),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	const { data: roomExtraList = [] } = useQuery({
		queryKey: ['roomExtra'],
		queryFn: () => roomExtra.getListNonPaging(),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	// guests alanı için useFieldArray
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'guests',
	});

	// Modal açma/kapama
	function handleCreateCustomerToggle() {
		setShowCreateCustomerToggle((prev) => !prev);
	}

	// Mutation (Booking ekleme)
	const { mutate: createBooking } = useMutation({
		mutationFn: booking.add,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [booking.queryKey] });
			toast.success(t('home:bookingAddedSuccess') || 'Booking added successfully!');
			handleDialogToggle();
		},
		onError: (error: any) => {
			toast.error(error?.message || t('home:bookingAddError') || 'Error while adding booking');
		},
	});

	// Form Submit
	const onSubmit = (data: FormData) => {
		// Gerekirse ek manipülasyon yapabilirsiniz.
		// Örneğin dayjs çevrimleri:
		//   - Biz zaten ISO string tutuyoruz,
		//   - API'ye de ISO string göndermek isteyebiliriz.
		// Bu nedenle ek bir dönüşüm yapmaya gerek yok.
		// Yine de misal:
		const dto: BookingRequestDto = {
			customerId: data.CustomerId,
			travelAgencyId: data.TravelAgencyId,
			startDate: data.startDate,
			endDate: data.endDate ?? undefined,
			checkIn: data.checkIn ?? undefined,
			isHourly: data.isHourly,
			childCount: data.childCount ?? undefined,
			description: data.description ?? undefined,
			discountAmount: data.discountAmount,
			discountReason: data.discountReason ?? '',
			rooms: data.rooms,
			roomExtras: data.roomExtras ?? undefined,
			guests: [
				{
					name: '',
					surname: '',
					fatherName: undefined, // undefined olarak ayarlandı
					passportNo: undefined, // undefined olarak ayarlandı
					birthday: dayjs().toISOString(),
				},
			],
		};

		createBooking(dto);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Box
				sx={{
					mt: 4,
					mx: 'auto',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					gap: 3,
				}}
			>
				<Grid container columnSpacing={5} rowSpacing={3}>
					{/* CustomerId */}
					<Grid item xs={12}>
						<Grid container alignItems="center">
							<Grid item xs={9}>
								<Typography variant="subtitle1">
									{t('home:Customer') || 'Customer'} (Required)
								</Typography>
								<Controller
									name="CustomerId"
									control={control}
									render={({ field, fieldState }) => (
										<Autocomplete
											{...field}
											size="small"
											options={customerOptions}
											getOptionLabel={(option: CustomerResponseDto) =>
												`${option.name} ${option.surname} - ${option.passportNo}`
											}
											isOptionEqualToValue={(option, value) => option.key === value.key}
											value={customerOptions.find((option) => option.key === field.value) || null}
											renderInput={(params) => (
												<TextField
													{...params}
													variant="outlined"
													error={Boolean(fieldState.error)}
													helperText={fieldState.error?.message}
												/>
											)}
											onChange={(_, data) => field.onChange(data?.key || 0)}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center' }}>
								<Button
									type="button"
									variant="contained"
									sx={{ mt: 4 }}
									onClick={handleCreateCustomerToggle}
								>
									{t('home:createCustomer') || 'Create Customer'}
								</Button>
							</Grid>
						</Grid>
					</Grid>

					{/* TravelAgencyId */}
					<Grid item xs={6}>
						<InputLabel>{t('home:TravelAgency') || 'Travel Agency'}</InputLabel>
						<Controller
							name="TravelAgencyId"
							control={control}
							render={({ field }) => (
								<Autocomplete
									{...field}
									size="small"
									options={travelAgencyOptions}
									getOptionLabel={(option) => option.agencyName}
									isOptionEqualToValue={(option, value) => option.key === value.key}
									value={travelAgencyOptions.find((option) => option.key === field.value) || null}
									renderInput={(params) => <TextField {...params} variant="outlined" />}
									onChange={(_, data) => setValue('TravelAgencyId', data?.key)}
								/>
							)}
						/>
					</Grid>

					{/* Start Date */}
					<Grid item xs={6}>
						<InputLabel required>{t('home:startDate') || 'Start Date'}</InputLabel>
						<Controller
							name="startDate"
							control={control}
							render={({ field, fieldState }) => (
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<MobileDateTimePicker
										{...field}
										value={field.value ? dayjs(field.value) : null}
										slots={{
											textField: (params) => (
												<CustomTextField
													ref={params.inputRef}
													{...params}
													size="small"
													error={!!fieldState.error}
													helperText={fieldState.error?.message}
													variant="outlined"
													inputRef={field.ref}
												/>
											),
										}}
										onChange={(value) => field.onChange(value ? value.toISOString() : '')}
									/>
								</LocalizationProvider>
							)}
						/>
					</Grid>

					{/* End Date */}
					<Grid item xs={6}>
						<InputLabel>{t('home:endDate') || 'End Date'}</InputLabel>
						<Controller
							name="endDate"
							control={control}
							render={({ field, fieldState }) => (
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<MobileDateTimePicker
										{...field}
										value={field.value ? dayjs(field.value) : null}
										slots={{
											textField: (params) => (
												<CustomTextField
													ref={params.inputRef}
													{...params}
													size="small"
													variant="outlined"
													error={!!fieldState.error}
													helperText={fieldState.error?.message}
												/>
											),
										}}
										onChange={(value) => field.onChange(value ? value.toISOString() : null)}
									/>
								</LocalizationProvider>
							)}
						/>
					</Grid>

					{/* Actual Check-In */}
					<Grid item xs={6}>
						<InputLabel>{t('home:actualCheckIn') || 'Actual Check-In'}</InputLabel>
						<Controller
							name="checkIn"
							control={control}
							render={({ field, fieldState }) => (
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<MobileDateTimePicker
										{...field}
										value={field.value ? dayjs(field.value) : null}
										slots={{
											textField: (params) => (
												<CustomTextField
													ref={params.inputRef}
													{...params}
													size="small"
													variant="outlined"
													error={!!fieldState.error}
													helperText={fieldState.error?.message}
												/>
											),
										}}
										onChange={(value) => field.onChange(value ? value.toISOString() : null)}
									/>
								</LocalizationProvider>
							)}
						/>
					</Grid>

					{/* Child Count */}
					<Grid item xs={6}>
						<InputLabel htmlFor="child-count">{t('home:childCount') || 'Child Count'}</InputLabel>
						<Controller
							name="childCount"
							control={control}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									fullWidth
									id="child-count"
									size="small"
									variant="outlined"
									type="number"
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
					</Grid>

					{/* Description */}
					<Grid item xs={6}>
						<InputLabel htmlFor="description">{t('home:description') || 'Description'}</InputLabel>
						<Controller
							name="description"
							control={control}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									fullWidth
									id="description"
									size="small"
									variant="outlined"
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
					</Grid>

					{/* Discount + isHourly Checkboxlar */}
					<Grid item xs={12}>
						<Grid container spacing={2} alignItems="center">
							{/* Discount Checkbox */}
							<Grid item>
								<Checkbox
									checked={showDiscountFields}
									onChange={(e) => setShowDiscountFields(e.target.checked)}
								/>
								<Typography variant="body1" component="span">
									{t('home:youWantDiscount') || 'You want discount'}
								</Typography>
							</Grid>

							{/* isHourly Checkbox */}
							<Grid item>
								<Controller
									name="isHourly"
									control={control}
									render={({ field }) => (
										<>
											<Checkbox
												{...field}
												checked={field.value}
												onChange={(e) => field.onChange(e.target.checked)}
											/>
											<Typography variant="body1" component="span">
												{t('home:isHourly') || 'isHourly'}
											</Typography>
										</>
									)}
								/>
							</Grid>
						</Grid>

						{/* Collapsible Fields for Discount */}
						<Collapse unmountOnExit in={showDiscountFields} timeout="auto">
							<Grid container columnSpacing={5} mt={2}>
								{/* DiscountAmount Input */}
								<Grid item xs={6}>
									<InputLabel htmlFor="discount-amount">
										{t('home:discountAmount') || 'Discount Amount'}
									</InputLabel>
									<Controller
										name="discountAmount"
										control={control}
										render={({ field, fieldState }) => (
											<TextField
												{...field}
												fullWidth
												id="discount-amount"
												size="small"
												variant="outlined"
												type="number"
												error={!!fieldState.error}
												helperText={fieldState.error?.message}
											/>
										)}
									/>
								</Grid>

								{/* DiscountReason Input */}
								<Grid item xs={6}>
									<InputLabel htmlFor="discount-reason">
										{t('home:discountReason') || 'Discount Reason'}
									</InputLabel>
									<Controller
										name="discountReason"
										control={control}
										render={({ field, fieldState }) => (
											<TextField
												{...field}
												fullWidth
												id="discount-reason"
												size="small"
												variant="outlined"
												error={!!fieldState.error}
												helperText={fieldState.error?.message}
											/>
										)}
									/>
								</Grid>
							</Grid>
						</Collapse>
					</Grid>

					{/* Rooms */}
					<Grid item xs={6}>
						<InputLabel>{t('home:rooms') || 'Rooms'}</InputLabel>
						<Controller
							name="rooms"
							control={control}
							render={({ field, fieldState }) => (
								<Autocomplete
									{...field}
									multiple
									options={roomList}
									getOptionLabel={(option: RoomResponseDto) =>
										`${option.roomNumber} - ${option.roomStatus}`
									}
									isOptionEqualToValue={(option, value) => option.key === value.key}
									renderInput={(params) => (
										<TextField
											{...params}
											variant="outlined"
											error={!!fieldState.error}
											helperText={fieldState.error?.message}
										/>
									)}
									onChange={(_, selectedOptions) => {
										// selectedOptions => RoomResponseDto[]
										// room.key => number
										// Dikkat: room.key eğer undefined olabiliyorsa, filter(Boolean) vs. yapabilirsiniz
										const keys = selectedOptions.map((room) => room.key);
										// Artık keys => number[] olmalı
										field.onChange(keys);
									}}
									size="small"
									// Aşağıda 'value' ve 'onChange' uyumlu olması çok önemli!
									value={
										// field.value bir number[]
										// roomList içindeki "option.key" ile eşleşeni buluyoruz
										roomList.filter((room) => field.value.includes(room.key))
									}
								/>
							)}
						/>
					</Grid>

					{/* Room Extras */}
					<Grid item xs={6}>
						<InputLabel>{t('home:roomExtras') || 'Room Extras'}</InputLabel>
						<Controller
							name="roomExtras"
							control={control}
							render={({ field, fieldState }) => (
								<Autocomplete
									{...field}
									multiple
									options={roomExtraList}
									getOptionLabel={(option: RoomExtraResponseDto) =>
										`${option.extraName} - ${option.price}`
									}
									size="small"
									value={roomExtraList.filter((extra) => field.value?.includes(extra.key))}
									isOptionEqualToValue={(option, value) => option.key === value.key}
									renderInput={(params) => (
										<TextField
											{...params}
											fullWidth
											variant="outlined"
											error={!!fieldState.error}
											helperText={fieldState.error?.message}
										/>
									)}
									onChange={(_, data) => field.onChange(data.map((item) => item.key))}
								/>
							)}
						/>
					</Grid>

					{/* Guests */}
					<Grid item xs={12}>
						<Checkbox checked={showGuests} onChange={(e) => setShowGuests(e.target.checked)} />{' '}
						{t('home:enableGuests') || 'Enable Guests'}
						<Collapse unmountOnExit in={showGuests} timeout="auto">
							<Grid container spacing={2}>
								{fields.map((item, index) => (
									<Grid key={item.id} container spacing={2} alignItems="center">
										<Grid item xs={6}>
											<InputLabel>{t('home:name') || 'Name'}</InputLabel>
											<Controller
												name={`guests.${index}.name`}
												control={control}
												render={({ field, fieldState }) => (
													<TextField
														{...field}
														fullWidth
														size="small"
														variant="outlined"
														error={!!fieldState.error}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={6}>
											<InputLabel>{t('home:surname') || 'Surname'}</InputLabel>
											<Controller
												name={`guests.${index}.surname`}
												control={control}
												render={({ field, fieldState }) => (
													<TextField
														{...field}
														fullWidth
														size="small"
														variant="outlined"
														error={!!fieldState.error}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={6}>
											<InputLabel>{t('home:fatherName') || 'Father Name'}</InputLabel>
											<Controller
												name={`guests.${index}.fatherName`}
												control={control}
												render={({ field, fieldState }) => (
													<TextField
														{...field}
														fullWidth
														size="small"
														variant="outlined"
														error={!!fieldState.error}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={6}>
											<InputLabel>{t('home:passportNo') || 'Passport No'}</InputLabel>
											<Controller
												name={`guests.${index}.passportNo`}
												control={control}
												render={({ field, fieldState }) => (
													<TextField
														{...field}
														fullWidth
														size="small"
														variant="outlined"
														error={!!fieldState.error}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
										</Grid>
										<Grid item xs={6}>
											<InputLabel>{t('home:birthday') || 'Birthday'}</InputLabel>
											<Controller
												name={`guests.${index}.birthday`}
												control={control}
												render={({ field, fieldState }) => (
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<MobileDateTimePicker
															{...field}
															value={field.value ? dayjs(field.value) : null}
															slots={{
																textField: (params) => (
																	<TextField
																		{...params}
																		fullWidth
																		variant="outlined"
																		size="small"
																		error={!!fieldState.error}
																		helperText={fieldState.error?.message}
																	/>
																),
															}}
															onChange={(value) =>
																field.onChange(value ? value.toISOString() : '')
															}
														/>
													</LocalizationProvider>
												)}
											/>
										</Grid>
										<Grid item xs={3}>
											<Button
												variant="contained"
												color="error"
												onClick={() => {
													if (fields.length === 1) {
														// Sadece bir satır kalmışsa boş değerlere reset
														setValue(`guests.${index}`, {
															name: '',
															surname: '',
															fatherName: '',
															passportNo: '',
															birthday: dayjs().toISOString(),
														});
													} else {
														// Birden çok satır varsa direkt kaldır
														remove(index);
													}
												}}
											>
												{t('home:clear') || 'Clear'}
											</Button>
										</Grid>
									</Grid>
								))}
								<Grid item xs={12}>
									<Button
										variant="contained"
										onClick={() =>
											append({
												name: '',
												surname: '',
												fatherName: '',
												passportNo: '',
												birthday: dayjs().toISOString(),
											})
										}
									>
										{t('home:addGuest') || 'Add'}
									</Button>
								</Grid>
							</Grid>
						</Collapse>
					</Grid>
				</Grid>

				{/* CreateCustomer Modal */}
				<Modal
					title={t('home:createCustomer') || 'Create Customer'}
					maxWidth="lg"
					open={showCreateCustomerToggle}
					onClose={handleCreateCustomerToggle}
				>
					<AddCustomerForm handleDialogToggle={handleCreateCustomerToggle} />
				</Modal>

				{/* Submit & Discard Buttons */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						mt: 2,
						width: '100%',
					}}
				>
					<Button type="submit" variant="contained">
						{t('home:submit') || 'Submit'}
					</Button>
					<Button type="button" variant="outlined" color="secondary" onClick={handleDialogToggle}>
						{t('home:discard') || 'Discard'}
					</Button>
				</Box>
			</Box>
		</form>
	);
};
