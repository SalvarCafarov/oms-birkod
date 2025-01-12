// src/views/dashboard/booking/create/CreateBookingForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, Checkbox, Collapse, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
// Our booking services & types
import { booking, BookingRequestDto } from 'api/services/booking';
import { customer, CustomerResponseDto } from 'api/services/customer';
import { room, RoomResponseDto } from 'api/services/room';
import { roomExtra, RoomExtraResponseDto } from 'api/services/room-extra';
import { travelAgency } from 'api/services/travel-agency';
import { Modal } from 'components/modal/modal';
import dayjs from 'dayjs';
// Additional components
import { queryClient } from 'main';
import { forwardRef, useState } from 'react';
// react-hook-form
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { AddCustomerForm } from 'views/dashboard/customer/create/create-customer-form';

import { getBookingSchema } from './validationSchema';

// The dynamic Zod schema

// Infer the form data type from Zod
// or you can do: export type FormData = ReturnType<typeof getBookingSchema>['_type'];
type FormData = ReturnType<typeof getBookingSchema>['_type'];

// A custom TextField that forwards ref (optional usage)
const CustomTextField = forwardRef((props, ref) => <TextField {...props} inputRef={ref} />);
CustomTextField.displayName = 'CustomTextField';

interface CreateBookingFormProps {
	handleDialogToggle: () => void;
}

export const CreateBookingForm = ({ handleDialogToggle }: CreateBookingFormProps) => {
	const { t } = useTranslation('home');

	// Local states for dynamic fields
	const [showDiscountFields, setShowDiscountFields] = useState(false);
	const [showGuests, setShowGuests] = useState(false);

	// Customer creation modal
	const [showCreateCustomerToggle, setShowCreateCustomerToggle] = useState(false);

	// react-hook-form with Zod
	const { control, handleSubmit, setValue } = useForm<FormData>({
		resolver: zodResolver(getBookingSchema(showDiscountFields, showGuests, t)),
		defaultValues: {
			CustomerId: undefined,
			TravelAgencyId: undefined,
			startDate: '',
			endDate: '',
			// checkIn is a boolean
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

	// Queries
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

	// Guests field array
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'guests',
	});

	// Toggle for create-customer modal
	const handleCreateCustomerToggle = () => {
		setShowCreateCustomerToggle((prev) => !prev);
	};

	// Booking mutation
	const { mutate: createBookingMutation } = useMutation({
		mutationFn: booking.add,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [booking.queryKey] });
			toast.success(t('home:bookingAddedSuccess') || 'added successfully!');
			handleDialogToggle();
		},
		onError: (error) => {
			toast.error(error?.message || t('home:bookingAddError') || 'Error while adding booking');
		},
	});

	// onSubmit
	const onSubmit = (data: FormData) => {
		// Transform form data into BookingRequestDto
		const dto: BookingRequestDto = {
			customerId: data.CustomerId,
			travelAgencyId: data.TravelAgencyId,
			startDate: data.startDate,
			endDate: data.endDate || undefined,
			checkIn: data.checkIn, // boolean
			isHourly: data.isHourly,
			childCount: data.childCount || undefined,
			description: data.description || undefined,
			discountAmount: Number(data.discountAmount),
			// IMPORTANT: "discountReason" in the interface is required
			// if your schema allows optional, be sure to fallback to '' or some default
			discountReason: data.discountReason || '',

			rooms: data.rooms,
			roomExtras: data.roomExtras || undefined,
			guests: data.guests
				? data.guests.map((g) => ({
						name: g.name,
						surname: g.surname,
						fatherName: g.fatherName || undefined,
						passportNo: g.passportNo || undefined,
						birthday: g.birthday,
					}))
				: [],
		};

		// Debug
		console.log('DTO:', dto);

		// Send the data to the backend
		createBookingMutation(dto);
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
					{/* CustomerId (required) */}
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

					{/* TravelAgencyId (optional) */}
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

					{/* Start Date (required) */}
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

					{/* End Date (optional) */}
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

					{/* CHECKBOXES for isHourly and checkIn */}
					<Grid
						item
						xs={6}
						sx={{
							mt: 4,
						}}
					>
						<Grid container spacing={4} alignItems="center">
							{/* isHourly (required) */}
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

							{/* checkIn (boolean, optional) */}
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

					{/* Child Count (optional) */}
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

					{/* Description (optional) */}
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

					{/* Discount checkbox + fields */}
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

					{/* Rooms (required) */}
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

					{/* Room Extras (optional) */}
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
									value={roomExtraList.filter((extra) => field.value?.includes(extra.key))}
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

					{/* Guests (optional) */}
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
										<Grid item xs={3}>
											<Button
												variant="contained"
												color="error"
												onClick={() => {
													if (fields.length === 1) {
														// reset the only row
														setValue(`guests.${index}`, {
															name: '',
															surname: '',
															fatherName: '',
															passportNo: '',
															birthday: '',
														});
													} else {
														remove(index);
													}
												}}
											>
												{t('clear') || 'Clear'}
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
												birthday: '',
											})
										}
									>
										{t('addGuest') || 'Add'}
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

				{/* Submit & Discard Buttons */}
				<Box sx={{ display: 'flex', justifyContent: 'start', mt: 2, width: '100%', gap: 2 }}>
					<Button type="submit" variant="contained">
						{t('submit') || 'Submit'}
					</Button>
					<Button type="button" variant="outlined" color="secondary" onClick={handleDialogToggle}>
						{t('discard') || 'Discard'}
					</Button>
				</Box>
			</Box>
		</form>
	);
};
