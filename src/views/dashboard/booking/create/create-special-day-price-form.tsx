import { Autocomplete, Box, Button, Checkbox, Collapse, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { customer, CustomerResponseDto } from 'api/services/customer';
import { room } from 'api/services/room';
import { travelAgency } from 'api/services/travel-agency';
import dayjs, { Dayjs } from 'dayjs';
import React, { forwardRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
	actualCheckIn?: Dayjs;
	isHourly: boolean;
	childCount: number;
	description?: string;
	discountAmount: string;
	discountReason: string;
}

const CustomTextField = forwardRef((props, ref) => <TextField {...props} inputRef={ref} />);
CustomTextField.displayName = 'CustomTextField';

export const AddSpecialDayPriceForm = ({ handleDialogToggle }: { handleDialogToggle: () => void }) => {
	const { control, handleSubmit, setValue } = useForm<FormData>({
		defaultValues: {
			CustomerId: 0,
			startDate: dayjs(),
			isHourly: false,
			TravelAgencyId: undefined,
			childCount: 0,
			endDate: undefined,
			actualCheckIn: undefined,
			description: '', // Yeni default value
			discountAmount: '',
			discountReason: '',
		},
	});

	const [showTravelAgency, setShowTravelAgency] = useState(false);
	const [showEndDate, setShowEndDate] = useState(false);
	const [showActualCheckIn, setShowActualCheckIn] = useState(false);
	const [showChildCount, setShowChildCount] = useState(false);
	const [showDescription, setShowDescription] = useState(false);
	const [showDiscountFields, setShowDiscountFields] = useState(false);

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

	const onSubmit = (data: FormData) => {
		const filteredData: Partial<FormData> = {
			CustomerId: data.CustomerId,
			startDate: data.startDate,
			...(showTravelAgency && { TravelAgencyId: data.TravelAgencyId }),
			...(showEndDate && { endDate: data.endDate }),
			...(showActualCheckIn && { actualCheckIn: data.actualCheckIn }),
			...(showChildCount && { childCount: data.childCount }),
			...(showDescription && { description: data.description }), // Yeni description sahəsi əlavə olundu
			...(showDescription && { discountReason: data.description }), // Yeni description sahəsi əlavə olundu
			...(showDiscountFields && { discountAmount: data.discountAmount }), // Yeni description sahəsi əlavə olundu
			...(showDiscountFields && { discountReason: data.discountReason }), // Yeni description sahəsi əlavə olundu
			isHourly: data.isHourly,
		};

		console.log('Filtered Form Data:', filteredData);
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
									onChange={(_, data) => field.onChange(data?.key || 0)} // onChange doğru bağlanmış mı?
								/>
							)}
						/>
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
														<CustomTextField {...params} size="small" variant="outlined" />
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
								<Checkbox
									checked={showActualCheckIn}
									onChange={(e) => setShowActualCheckIn(e.target.checked)}
								/>
							</Grid>

							{/* Input */}
							<Grid item xs={11}>
								<InputLabel>Include Actual Check-In</InputLabel>
								<Controller
									name="actualCheckIn"
									control={control}
									render={({ field }) => (
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<MobileDateTimePicker
												{...field}
												disabled={!showActualCheckIn}
												value={field.value || null}
												slots={{
													textField: (params) => (
														<CustomTextField {...params} size="small" variant="outlined" />
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
								{/* <Grid item xs={6}>
									<InputLabel htmlFor="discount-reason">Discount Reason (Endirim Səbəbi)</InputLabel>
									<Controller
										name="discountReason"
										control={control}
										render={({ field }) => (
											<Autocomplete
												multiple
												disableCloseOnSelect
												id="checkboxes-tags-demo"
												options={top100Films}
												getOptionLabel={(option) => option.title}
												renderOption={(props, option, { selected }) => {
													const { key, ...optionProps } = props;

													return (
														<li key={key} {...optionProps}>
															<Checkbox
																icon={icon}
																checkedIcon={checkedIcon}
																style={{ marginRight: 8 }}
																checked={selected}
															/>
															{option.title}
														</li>
													);
												}}
												style={{ width: 500 }}
												renderInput={(params) => (
													<TextField {...params} label="Checkboxes" placeholder="Favorites" />
												)}
											/>
										)}
									/>
								</Grid> */}
							</Grid>
						</Collapse>
					</Grid>
				</Grid>

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
