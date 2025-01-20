// src/views/dashboard/booking/edit/EditBookingForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, Checkbox, Collapse, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
// Servisler & tipler
import { booking, UpdateBookingDto } from 'api/services/booking';
import { customer, CustomerResponseDto } from 'api/services/customer';
import { room, RoomResponseDto } from 'api/services/room';
import { roomExtra, RoomExtraResponseDto } from 'api/services/room-extra';
import { travelAgency } from 'api/services/travel-agency';
import { Modal } from 'components/modal/modal';
import { Spinner } from 'components/spinner';
import dayjs from 'dayjs';
import { queryClient } from 'main';
import { forwardRef, useEffect, useState } from 'react';
// react-hook-form
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-router-dom';
import { AddCustomerForm } from 'views/dashboard/customer/create/create-customer-form';

import { getBookingSchema } from './validationSchema';

type FormData = ReturnType<typeof getBookingSchema>['_type'];

// Opsiyonel TextField
const CustomTextField = forwardRef((props, ref) => <TextField {...props} inputRef={ref} />);
CustomTextField.displayName = 'CustomTextField';

interface EditBookingFormProps {
	handleDialogToggle: () => void;
	keyProp: number;
}

export const EditBookingForm = ({ handleDialogToggle, keyProp }: EditBookingFormProps) => {
	const { t } = useTranslation('home');

	// Local state
	const [showDiscountFields, setShowDiscountFields] = useState(false);
	const [showGuests, setShowGuests] = useState(false);

	// Modal (Yeni müşteri oluşturma)
	const [showCreateCustomerToggle, setShowCreateCustomerToggle] = useState(false);
	const handleCreateCustomerToggle = () => setShowCreateCustomerToggle((prev) => !prev);

	// react-hook-form
	const { control, handleSubmit, reset, setValue } = useForm<FormData>({
		resolver: zodResolver(getBookingSchema(showDiscountFields, showGuests, t)),
		defaultValues: {
			CustomerId: undefined,
			TravelAgencyId: undefined,
			startDate: '',
			endDate: '',
			checkIn: false,
			isHourly: false,
			childCount: 0,
			description: '',
			discountAmount: 0,
			discountReason: '',
			rooms: [],
			roomExtras: [],
			guests: [
				{
					name: '',
					surname: '',
					fatherName: '',
					passportNo: '',
					birthday: '',
				},
			],
		},
	});

	// Saha listeleri
	const { data: travelAgencyOptions = [] } = useQuery({
		queryKey: ['travelAgency'],
		queryFn: () => travelAgency.getListNonPaging(),
		placeholderData: keepPreviousData,
		staleTime: Infinity,
	});

	const { data: bookingDataByKey, isLoading: isBookingLoading } = useQuery({
		queryKey: ['getBookingByKey', keyProp],
		queryFn: () => booking.getFormByKey(keyProp),
		placeholderData: undefined,
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

	// guests array
	const { fields, append } = useFieldArray({
		control,
		name: 'guests',
	});

	// Query verisi geldikten sonra formu doldur
	useEffect(() => {
		// Eğer loading biterse ve data geldiyse:
		if (!isBookingLoading && bookingDataByKey) {
			// Eğer discountAmount varsa discount field'ları aç
			setShowDiscountFields(!!bookingDataByKey.discountAmount);

			// Eğer guests varsa misafir alanını aç
			setShowGuests(!!(bookingDataByKey.guests && bookingDataByKey.guests.length > 0));

			// react-hook-form verilerini doldur
			reset({
				CustomerId: bookingDataByKey.customerId,
				TravelAgencyId: bookingDataByKey.travelAgencyId || undefined,
				startDate: bookingDataByKey.startDate || '',
				endDate: bookingDataByKey.endDate || '',
				checkIn: bookingDataByKey.checkIn ?? false,
				isHourly: bookingDataByKey.isHourly ?? false,
				childCount: bookingDataByKey.childCount ?? 0,
				description: bookingDataByKey.description || '',
				discountAmount: bookingDataByKey.discountAmount ?? 0,
				discountReason: bookingDataByKey.discountReason || '',
				rooms: bookingDataByKey.rooms || [],
				roomExtras: bookingDataByKey.roomExtras || [],
				guests: bookingDataByKey.guests?.map((g) => ({
					name: g.name,
					surname: g.surname,
					fatherName: g.fatherName || '',
					passportNo: g.passportNo || '',
					birthday: g.birthday || '',
				})) || [
					{
						name: '',
						surname: '',
						fatherName: '',
						passportNo: '',
						birthday: '',
					},
				],
			});
		}
	}, [isBookingLoading, bookingDataByKey, reset]);

	// Update mutation
	const { mutate: updateMutation } = useMutation({
		mutationFn: (dto: UpdateBookingDto) => booking.update(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getBookingByKey', keyProp] });
			toast.success(t('home:bookingUpdatedSuccess') || 'Booking updated successfully!');
			handleDialogToggle();
		},
		onError: (error: any) => {
			toast.error(error?.message || t('home:bookingUpdateError') || 'Error while updating booking');
		},
	});

	// Form submit
	const onSubmit = (data: FormData) => {
		// Dto'ya dönüştür
		const dto: UpdateBookingDto = {
			key: Number(keyProp),
			customerId: data.CustomerId!,
			travelAgencyId: data.TravelAgencyId,
			startDate: data.startDate,
			endDate: data.endDate || undefined,
			checkIn: data.checkIn,
			isHourly: data.isHourly,
			childCount: data.childCount || undefined,
			description: data.description || undefined,
			discountAmount: Number(data.discountAmount),
			discountReason: data.discountReason || '',
			rooms: data.rooms,
			roomExtras: data.roomExtras || undefined,
			guests: data.guests.map((g) => ({
				name: g.name,
				surname: g.surname,
				fatherName: g.fatherName || undefined,
				passportNo: g.passportNo || undefined,
				birthday: g.birthday,
			})),
		};

		updateMutation(dto);
	};

	// Data yüklenirken spinner göster
	if (isBookingLoading || !bookingDataByKey) {
		return <Spinner />;
	}

	// Data yüklendikten sonra form
	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
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
								<Typography variant="subtitle1">{t('home:Customer')} *</Typography>
								<Controller
									name="CustomerId"
									control={control}
									render={({ field, fieldState }) => (
										<Autocomplete
											{...field}
											options={customerOptions}
											size="small"
											value={customerOptions.find((opt) => opt.key === field.value) || null}
											getOptionLabel={(option: CustomerResponseDto) =>
												`${option.name} ${option.surname} - ${option.passportNo}`
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
											onChange={(_, selected) => {
												field.onChange(selected?.key ?? undefined);
											}}
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
						<InputLabel>{t('TravelAgency') || 'Travel Agency'}</InputLabel>
						<Controller
							name="TravelAgencyId"
							control={control}
							render={({ field, fieldState }) => (
								<Autocomplete
									{...field}
									size="small"
									options={travelAgencyOptions}
									value={travelAgencyOptions.find((opt) => opt.key === field.value) || null}
									getOptionLabel={(opt) => opt.agencyName}
									isOptionEqualToValue={(option, value) => option.key === value.key}
									renderInput={(params) => (
										<TextField
											{...params}
											variant="outlined"
											error={!!fieldState.error}
											helperText={fieldState.error?.message}
										/>
									)}
									onChange={(_, selected) => {
										field.onChange(selected?.key ?? undefined);
									}}
								/>
							)}
						/>
					</Grid>

					{/* Start Date */}
					<Grid item xs={6}>
						<InputLabel required>{t('startDate') || 'Start Date'}</InputLabel>
						<Controller
							name="startDate"
							control={control}
							render={({ field, fieldState }) => (
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<MobileDateTimePicker
										value={field.value ? dayjs(field.value) : null}
										slots={{
											textField: (params) => (
												<CustomTextField
													{...params}
													size="small"
													variant="outlined"
													error={!!fieldState.error}
													helperText={fieldState.error?.message}
													inputRef={field.ref}
												/>
											),
										}}
										onChange={(val) => field.onChange(val ? val.toISOString() : '')}
									/>
								</LocalizationProvider>
							)}
						/>
					</Grid>

					{/* End Date */}
					<Grid item xs={6}>
						<InputLabel>{t('endDate') || 'End Date'}</InputLabel>
						<Controller
							name="endDate"
							control={control}
							render={({ field, fieldState }) => (
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<MobileDateTimePicker
										value={field.value ? dayjs(field.value) : null}
										slots={{
											textField: (params) => (
												<CustomTextField
													{...params}
													size="small"
													variant="outlined"
													error={!!fieldState.error}
													helperText={fieldState.error?.message}
												/>
											),
										}}
										onChange={(val) => field.onChange(val ? val.toISOString() : '')}
									/>
								</LocalizationProvider>
							)}
						/>
					</Grid>

					{/* CHECKBOX: isHourly / checkIn */}
					<Grid
						item
						xs={6}
						sx={{
							mt: 4,
						}}
					>
						<Grid container spacing={4} alignItems="center">
							{/* isHourly */}
							<Grid item>
								<Controller
									name="isHourly"
									control={control}
									render={({ field, fieldState }) => (
										<>
											<Checkbox
												{...field}
												checked={field.value}
												onChange={(e) => field.onChange(e.target.checked)}
											/>
											<Typography variant="body1" component="span">
												{t('isHourly') || 'isHourly'}
											</Typography>
											{fieldState.error && (
												<Typography color="error" variant="caption" sx={{ ml: 1 }}>
													{fieldState.error?.message}
												</Typography>
											)}
										</>
									)}
								/>
							</Grid>

							{/* checkIn */}
							<Grid item>
								<Controller
									name="checkIn"
									control={control}
									render={({ field, fieldState }) => (
										<>
											<Checkbox
												{...field}
												checked={field.value}
												onChange={(e) => field.onChange(e.target.checked)}
											/>
											<Typography variant="body1" component="span">
												{t('checkIn') || 'Check-In'}
											</Typography>
											{fieldState.error && (
												<Typography color="error" variant="caption" sx={{ ml: 1 }}>
													{fieldState.error?.message}
												</Typography>
											)}
										</>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					{/* Child Count */}
					<Grid item xs={6}>
						<InputLabel>{t('childCount') || 'Child Count'}</InputLabel>
						<Controller
							name="childCount"
							control={control}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									fullWidth
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
						<InputLabel>{t('description') || 'Description'}</InputLabel>
						<Controller
							name="description"
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

					{/* Discount Fields */}
					<Grid item xs={12}>
						<Grid container spacing={2} alignItems="center">
							<Grid item>
								<Checkbox
									checked={showDiscountFields}
									onChange={(e) => setShowDiscountFields(e.target.checked)}
								/>
								<Typography variant="body1" component="span">
									{t('youWantDiscount') || 'You want discount'}
								</Typography>
							</Grid>
						</Grid>

						<Collapse unmountOnExit in={showDiscountFields} timeout="auto">
							<Grid container columnSpacing={5} mt={2}>
								<Grid item xs={6}>
									<InputLabel>{t('discountAmount') || 'Discount Amount'}</InputLabel>
									<Controller
										name="discountAmount"
										control={control}
										render={({ field, fieldState }) => (
											<TextField
												{...field}
												fullWidth
												size="small"
												variant="outlined"
												type="number"
												error={!!fieldState.error}
												helperText={fieldState.error?.message}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={6}>
									<InputLabel>{t('discountReason') || 'Discount Reason'}</InputLabel>
									<Controller
										name="discountReason"
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
							</Grid>
						</Collapse>
					</Grid>

					{/* Rooms */}
					<Grid item xs={6}>
						<InputLabel>{t('rooms') || 'Rooms'}</InputLabel>
						<Controller
							name="rooms"
							control={control}
							render={({ field, fieldState }) => (
								<Autocomplete
									{...field}
									multiple
									options={roomList}
									size="small"
									getOptionLabel={(opt: RoomResponseDto) => `${opt.roomNumber} - ${opt.roomStatus}`}
									isOptionEqualToValue={(option, value) => option.key === value.key}
									value={roomList.filter((r) => field.value.includes(r.key))}
									renderInput={(params) => (
										<TextField
											{...params}
											variant="outlined"
											size="small"
											error={!!fieldState.error}
											helperText={fieldState.error?.message}
										/>
									)}
									onChange={(_, selected) => {
										const keys = selected.map((x) => x.key);
										field.onChange(keys);
									}}
								/>
							)}
						/>
					</Grid>

					{/* Room Extras */}
					<Grid item xs={6}>
						<InputLabel>{t('roomExtras') || 'Room Extras'}</InputLabel>
						<Controller
							name="roomExtras"
							control={control}
							render={({ field, fieldState }) => (
								<Autocomplete
									{...field}
									multiple
									options={roomExtraList}
									size="small"
									getOptionLabel={(opt: RoomExtraResponseDto) => `${opt.extraName} - ${opt.price}`}
									isOptionEqualToValue={(option, value) => option.key === value.key}
									value={roomExtraList.filter((extra) => (field.value ?? []).includes(extra.key))}
									renderInput={(params) => (
										<TextField
											{...params}
											variant="outlined"
											size="small"
											error={!!fieldState.error}
											helperText={fieldState.error?.message}
										/>
									)}
									onChange={(_, selected) => field.onChange(selected.map((x) => x.key))}
								/>
							)}
						/>
					</Grid>

					{/* Guests */}
					<Grid item xs={12}>
						<Checkbox checked={showGuests} onChange={(e) => setShowGuests(e.target.checked)} />
						{t('enableGuests') || 'Enable Guests'}
						<Collapse unmountOnExit in={showGuests} timeout="auto">
							<Grid container spacing={2}>
								{fields.map((item, index) => (
									<Grid key={item.id} container spacing={2} alignItems="center">
										<Grid item xs={6}>
											<InputLabel>{t('guestName') || 'Name'}</InputLabel>
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
											<InputLabel>{t('guestSurname') || 'Surname'}</InputLabel>
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
											<InputLabel>{t('guestFatherName') || 'Father Name'}</InputLabel>
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
											<InputLabel>{t('guestPassportNo') || 'Passport No'}</InputLabel>
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
											<InputLabel>{t('guestBirthday') || 'Birthday'}</InputLabel>
											<Controller
												name={`guests.${index}.birthday`}
												control={control}
												render={({ field, fieldState }) => (
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<MobileDateTimePicker
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
															onChange={(val) =>
																field.onChange(val ? val.toISOString() : '')
															}
														/>
													</LocalizationProvider>
												)}
											/>
										</Grid>
										{/* İsterseniz "Clear" veya "Remove" butonu ekleyebilirsiniz */}
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
												birthday: '',
											})
										}
									>
										{t('addGuest') || 'Add Guest'}
									</Button>
								</Grid>
							</Grid>
						</Collapse>
					</Grid>
				</Grid>

				{/* CreateCustomer Modal */}
				<Modal
					title={t('createCustomer') || 'Create Customer'}
					maxWidth="lg"
					open={showCreateCustomerToggle}
					onClose={handleCreateCustomerToggle}
				>
					<AddCustomerForm handleDialogToggle={handleCreateCustomerToggle} />
				</Modal>

				{/* Butonlar */}
				<Box sx={{ display: 'flex', justifyContent: 'start', mt: 2, width: '100%', gap: 2 }}>
					<Button type="submit" variant="contained">
						{t('submit') || 'Submit'}
					</Button>
					<Button type="button" variant="outlined" color="secondary" onClick={handleDialogToggle}>
						{t('discard') || 'Discard'}
					</Button>
				</Box>
			</Box>
		</Form>
	);
};
