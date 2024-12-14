import { Autocomplete, Box, Button, Checkbox, Collapse, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { customer, CustomerResponseDto } from 'api/services/customer';
import { room, RoomResponseDto } from 'api/services/room';
import { roomExtra, RoomExtraResponseDto } from 'api/services/room-extra';
import { travelAgency } from 'api/services/travel-agency';
import { Modal } from 'components/modal/modal';
import dayjs, { Dayjs } from 'dayjs';
import { forwardRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AddCustomerForm } from 'views/dashboard/customer/create/create-customer-form';

export interface TravelAgencyResponseDto {
	key: number;
	agencyName: string;
	discountRate: number;
}

interface FormData {
	CustomerId: number;
	TravelAgencyId?: number;
	startDate: Dayjs;
	endDate?: Dayjs;
	checkIn?: Dayjs;
	isHourly: boolean;
	childCount: number;
	description?: string;
	discountAmount: string;
	discountReason: string;
	rooms: number[];
	roomExtras: number[];
	guests: {
		name: string;
		surname: string;
		fatherName: string;
		passportNo: string;
		birthday: Dayjs;
	}[];
}

const CustomTextField = forwardRef((props, ref) => <TextField {...props} inputRef={ref} />);
CustomTextField.displayName = 'CustomTextField';

export const CreateBookingForm = ({ handleDialogToggle }: { handleDialogToggle: () => void }) => {
	const { control, handleSubmit, setValue } = useForm<FormData>({
		defaultValues: {
			CustomerId: 0,
			startDate: dayjs(),
			isHourly: false,
			TravelAgencyId: undefined,
			childCount: 0,
			endDate: undefined,
			checkIn: undefined,
			description: '',
			discountAmount: '',
			discountReason: '',
			rooms: [],
			roomExtras: [],
			guests: [],
		},
	});

	const [showTravelAgency, setShowTravelAgency] = useState(false);
	const [showEndDate, setShowEndDate] = useState(false);
	const [showCheckIn, setShowCheckIn] = useState(false);
	const [showChildCount, setShowChildCount] = useState(false);
	const [showDescription, setShowDescription] = useState(false);
	const [showDiscountFields, setShowDiscountFields] = useState(false);
	const [showCreateCustomerToggle, setShowCreateCustomerToggle] = useState(false);
	const [guests, setGuests] = useState<FormData['guests']>([]); // Guests array state
	const [showGuests, setShowGuests] = useState(false); // Guests bölümü görünürlüğü

	const { t } = useTranslation();

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

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'guests',
	});

	const handleAddInput = () => {
		setGuests([
			...guests,
			{
				name: '',
				surname: '',
				fatherName: '',
				passportNo: '',
				birthday: dayjs(),
			},
		]);
	};

	const handleRemoveInput = (index: number) => {
		setGuests(guests.filter((_, i) => i !== index));
	};

	const onSubmit = (data: FormData) => {
		const filteredData: Partial<FormData> = {
			CustomerId: data.CustomerId,
			startDate: data.startDate,
			guests: data.guests,
			...(data.rooms.length && { rooms: data.rooms }),
			...(data.roomExtras.length && { roomExtras: data.roomExtras }),
			...(showTravelAgency && { TravelAgencyId: data.TravelAgencyId }),
			...(showEndDate && { endDate: data.endDate }),
			...(showCheckIn && { checkIn: data.checkIn }),
			...(showChildCount && { childCount: data.childCount }),
			...(showDescription && { description: data.description }), // Yeni description sahəsi əlavə olundu
			...(showDescription && { discountReason: data.description }), // Yeni description sahəsi əlavə olundu
			...(showDiscountFields && { discountAmount: data.discountAmount }), // Yeni description sahəsi əlavə olundu
			...(showDiscountFields && { discountReason: data.discountReason }), // Yeni description sahəsi əlavə olundu
			isHourly: data.isHourly,
		};

		console.log('Filtered Form Data:', filteredData);
	};

	function handleCreateCustomerToggle() {
		return setShowCreateCustomerToggle(!showCreateCustomerToggle);
	}

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
							<Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center' }}>
								<Button
									type="button"
									variant="contained"
									onClick={() => {
										handleCreateCustomerToggle();
										console.log('s');
									}}
								>
									{t('home:createCustomer')}
								</Button>
							</Grid>

							<Grid item xs={9}>
								<Controller
									name="CustomerId"
									control={control}
									rules={{ required: 'Customer is required' }}
									render={({ field, fieldState }) => (
										<Autocomplete
											{...field}
											size="small"
											options={customerOptions}
											getOptionLabel={(option: CustomerResponseDto) => {
												return `${option.name} ${option.surname} - ${option.passportNo}`;
											}}
											isOptionEqualToValue={(option, value) => option.key === value.key}
											value={customerOptions.find((option) => option.key === field.value) || null}
											renderInput={(params) => (
												<TextField
													{...params}
													error={Boolean(fieldState.error)}
													helperText={fieldState.error?.message}
													variant="outlined"
												/>
											)}
											onChange={(_, data) => field.onChange(data?.key || 0)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					{/* TravelAgencyId */}
					<Grid item xs={6}>
						<Grid container spacing={2} alignItems="center">
							{/* Checkbox */}
							<Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
								<Checkbox
									checked={showTravelAgency}
									onChange={(e) => setShowTravelAgency(e.target.checked)}
								/>
							</Grid>

							{/* Input */}
							<Grid item xs={11}>
								<InputLabel>Include Travel Agency</InputLabel>
								<Controller
									name="TravelAgencyId"
									control={control}
									render={({ field }) => (
										<Autocomplete
											{...field}
											size="small"
											disabled={!showTravelAgency}
											options={travelAgencyOptions}
											getOptionLabel={(option: TravelAgencyResponseDto) => option.agencyName}
											isOptionEqualToValue={(option, value) => option.key === value.key}
											value={
												travelAgencyOptions.find((option) => option.key === field.value) || null
											}
											renderInput={(params) => <TextField {...params} variant="outlined" />}
											onChange={(_, data) => setValue('TravelAgencyId', data?.key || undefined)}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					{/* Start Date */}
					<Grid item xs={6}>
						<InputLabel required>Start Date</InputLabel>
						<Controller
							name="startDate"
							control={control}
							render={({ field, fieldState }) => (
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<MobileDateTimePicker
										{...field}
										value={field.value}
										slots={{
											textField: (params) => (
												<CustomTextField
													ref={params.inputRef}
													{...params}
													size={'small'}
													error={!!fieldState.error}
													helperText={fieldState.error?.message}
													variant="outlined"
													inputRef={field.ref}
												/>
											),
										}}
										onChange={(value) => field.onChange(value)}
									/>
								</LocalizationProvider>
							)}
						/>
					</Grid>

					{/* End Date */}
					<Grid item xs={6}>
						<Grid container spacing={2} alignItems="center">
							{/* Checkbox */}
							<Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
								<Checkbox checked={showEndDate} onChange={(e) => setShowEndDate(e.target.checked)} />
							</Grid>

							{/* Input */}
							<Grid item xs={11}>
								<InputLabel>Include End Date</InputLabel>
								<Controller
									name="endDate"
									control={control}
									render={({ field }) => (
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<MobileDateTimePicker
												{...field}
												disabled={!showEndDate}
												value={field.value || null}
												slots={{
													textField: (params) => (
														<CustomTextField
															ref={params.inputRef}
															{...params}
															size="small"
															variant="outlined"
														/>
													),
												}}
												onChange={(value) => field.onChange(value)}
											/>
										</LocalizationProvider>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>

					{/* Actual Check-In */}
					<Grid item xs={6}>
						<Grid container spacing={2} alignItems="center">
							{/* Checkbox */}
							<Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
								<Checkbox checked={showCheckIn} onChange={(e) => setShowCheckIn(e.target.checked)} />
							</Grid>

							{/* Input */}
							<Grid item xs={11}>
								<InputLabel>Include Actual Check-In</InputLabel>
								<Controller
									name="checkIn"
									control={control}
									render={({ field }) => (
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<MobileDateTimePicker
												{...field}
												disabled={!showCheckIn}
												value={field.value || null}
												slots={{
													textField: (params) => (
														<CustomTextField
															ref={params.inputRef}
															{...params}
															size="small"
															variant="outlined"
														/>
													),
												}}
												onChange={(value) => field.onChange(value)}
											/>
										</LocalizationProvider>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={6}>
						<Grid container spacing={2} alignItems="center">
							{/* Checkbox */}
							<Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
								<Checkbox
									checked={showChildCount}
									inputProps={{ 'aria-label': 'Include Actual Check-In' }} // Accessible label
									onChange={(e) => setShowChildCount(e.target.checked)}
								/>
							</Grid>

							{/* Input */}
							<Grid item xs={11}>
								<InputLabel htmlFor="child-count">Include Child Count</InputLabel>
								<Controller
									name="childCount"
									control={control}
									render={({ field }) => (
										<TextField
											{...field} // Connects Controller to TextField
											fullWidth
											id="child-count" // Matches with InputLabel for accessibility
											size="small"
											variant="outlined"
											type="number"
											disabled={!showChildCount} // Disable input if checkbox is unchecked
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={6}>
						<Grid container spacing={2} alignItems="center">
							{/* Checkbox */}
							<Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
								<Checkbox
									checked={showDescription}
									onChange={(e) => setShowDescription(e.target.checked)}
								/>
							</Grid>

							{/* Input */}
							<Grid item xs={11}>
								<InputLabel htmlFor="description">Include Description</InputLabel>
								<Controller
									name="description"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											id="description"
											size="small"
											variant="outlined"
											disabled={!showDescription}
										/>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Grid container columnSpacing={5} alignItems="center">
							{/* Checkbox */}
							<Grid item sx={{ display: 'flex', alignItems: 'center' }}>
								<Checkbox
									checked={showDiscountFields}
									onChange={(e) => setShowDiscountFields(e.target.checked)}
								/>
								<Typography variant="body1">You want discount</Typography>
							</Grid>
						</Grid>

						{/* Collapsible Fields */}
						<Collapse unmountOnExit in={showDiscountFields} timeout="auto">
							<Grid container columnSpacing={5} mt={2}>
								{/* DiscountAmount Input */}
								<Grid item xs={6}>
									<InputLabel htmlFor="discount-amount">Discount Amount (Endirim Faizi)</InputLabel>
									<Controller
										name="discountAmount"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												fullWidth
												id="discount-amount"
												size="small"
												variant="outlined"
												type="number"
											/>
										)}
									/>
								</Grid>

								{/* DiscountReason Input */}
								<Grid item xs={6}>
									<InputLabel htmlFor="discount-reason">Discount Reason (Endirim Səbəbi)</InputLabel>
									<Controller
										name="discountReason"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												fullWidth
												id="discount-reason"
												size="small"
												variant="outlined"
											/>
										)}
									/>
								</Grid>
							</Grid>
						</Collapse>
					</Grid>
					<Grid item xs={6}>
						<InputLabel>Rooms</InputLabel>

						<Controller
							name="rooms"
							control={control}
							render={({ field }) => (
								<Autocomplete
									{...field}
									multiple
									options={roomList}
									getOptionLabel={(option: RoomResponseDto) =>
										`${option.roomNumber} - ${option.roomStatus}`
									}
									size="small"
									value={roomList.filter((room) => field.value?.includes(room.key))}
									isOptionEqualToValue={(option, value) => option.key === value.key}
									renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
									onChange={(_, data) => field.onChange(data.map((item) => item.key))}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={6}>
						<InputLabel>Room Extras</InputLabel>
						<Controller
							name="roomExtras"
							control={control}
							render={({ field }) => (
								<Autocomplete
									multiple
									options={roomExtraList}
									getOptionLabel={(option: RoomExtraResponseDto) =>
										`${option.extraName} - ${option.price}`
									}
									size="small"
									isOptionEqualToValue={(option, value) => option.key === value.key}
									value={roomExtraList.filter((extra) => field.value?.includes(extra.key))}
									renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
									onChange={(_, data) => field.onChange(data.map((item) => item.key))}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Checkbox checked={showGuests} onChange={(e) => setShowGuests(e.target.checked)} /> Enable
						Guests
						<Collapse unmountOnExit in={showGuests} timeout="auto">
							<Grid container spacing={2}>
								{fields.map((item, index) => (
									<Grid key={item.id} container spacing={2} alignItems="center">
										<Grid item xs={6}>
											<Controller
												name={`guests.${index}.name`}
												control={control}
												render={({ field }) => (
													<TextField {...field} fullWidth label="Name" variant="outlined" />
												)}
											/>
										</Grid>
										<Grid item xs={6}>
											<Controller
												name={`guests.${index}.surname`}
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														fullWidth
														label="Surname"
														variant="outlined"
													/>
												)}
											/>
										</Grid>
										<Grid item xs={6}>
											<Controller
												name={`guests.${index}.fatherName`}
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														fullWidth
														label="Father Name"
														variant="outlined"
													/>
												)}
											/>
										</Grid>
										<Grid item xs={6}>
											<Controller
												name={`guests.${index}.passportNo`}
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														fullWidth
														label="Passport No"
														variant="outlined"
													/>
												)}
											/>
										</Grid>
										<Grid item xs={6}>
											<Controller
												name={`guests.${index}.birthday`}
												control={control}
												render={({ field }) => (
													<LocalizationProvider dateAdapter={AdapterDayjs}>
														<MobileDateTimePicker
															{...field}
															slots={{
																textField: (params) => (
																	<TextField
																		{...params}
																		fullWidth
																		label="Birthday"
																		variant="outlined"
																	/>
																),
															}}
															onChange={(value) => field.onChange(value)}
														/>
													</LocalizationProvider>
												)}
											/>
										</Grid>
										<Grid item xs={3}>
											<Button variant="contained" color="error" onClick={() => remove(index)}>
												Clear
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
												birthday: dayjs(),
											})
										}
									>
										Add
									</Button>
								</Grid>
							</Grid>
						</Collapse>
					</Grid>
				</Grid>
				<Modal
					title="CreateCustomer"
					maxWidth="lg"
					open={showCreateCustomerToggle}
					onClose={handleCreateCustomerToggle}
				>
					<AddCustomerForm handleDialogToggle={handleCreateCustomerToggle} />
				</Modal>

				{/* Submit and Discard Buttons */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						mt: 2,
						width: '100%',
					}}
				>
					<Button type="submit" variant="contained">
						Submit
					</Button>
					<Button type="button" variant="outlined" color="secondary" onClick={handleDialogToggle}>
						Discard
					</Button>
				</Box>
			</Box>
		</form>
	);
};
