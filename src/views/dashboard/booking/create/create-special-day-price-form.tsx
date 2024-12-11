import { Autocomplete, Box, Button, Checkbox, Grid, InputLabel, TextField } from '@mui/material';
import { LocalizationProvider, MobileDatePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import React, { forwardRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface FormData {
	CustomerId: number;
	TravelAgencyId?: number;
	startDate: Dayjs;
	endDate: Dayjs;
}

const customerOptions = [
	{ id: 1, name: 'John', surname: 'Doe' },
	{ id: 2, name: 'Jane', surname: 'Smith' },
	{ id: 3, name: 'Alice', surname: 'Johnson' },
];

const travelAgencyOptions = [
	{ id: 1, name: 'Global Travels' },
	{ id: 2, name: 'Sunny Tours' },
	{ id: 3, name: 'Adventure Co.' },
];
const CustomTextField = forwardRef((props, ref) => <TextField {...props} inputRef={ref} />);
CustomTextField.displayName = 's';

export const AddSpecialDayPriceForm = ({ handleDialogToggle }: { handleDialogToggle: () => void }) => {
	const { control, handleSubmit, setValue, watch } = useForm<FormData>({
		defaultValues: {
			CustomerId: 0,
			startDate: dayjs(),
			endDate: dayjs(),
		},
	});

	const [showTravelAgency, setShowTravelAgency] = useState(false);

	const onSubmit = (data: FormData) => {
		console.log('Form Data:', data);
		// handleDialogToggle(); // Kapatma işlemi
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
					<Grid item xs={6}>
						<InputLabel required>Customer</InputLabel>
						<Controller
							name="CustomerId"
							control={control}
							rules={{ required: 'Customer is required' }}
							render={({ field, fieldState }) => (
								<Autocomplete
									{...field}
									size="small"
									options={customerOptions}
									getOptionLabel={(option) => `${option.name} ${option.surname}` || ''}
									isOptionEqualToValue={(option, value) => option.id === value.id} // Burada `id` ile karşılaştırıyoruz.
									value={customerOptions.find((option) => option.id === field.value) || null} // `field.value` değerine göre eşleşen öğeyi buluyoruz.
									renderInput={(params) => (
										<TextField
											{...params}
											error={Boolean(fieldState.error)}
											helperText={fieldState.error?.message}
											variant="outlined"
										/>
									)}
									onChange={(_, data) => setValue('CustomerId', data?.id || 0)} // Seçilen id'yi kaydediyoruz.
								/>
							)}
						/>
					</Grid>

					{/* TravelAgencyId */}
					<Grid item xs={6}>
						<Grid container spacing={2} alignItems="center">
							{/* Checkbox: 2 birim */}
							<Grid item xs={1}>
								<Checkbox
									checked={showTravelAgency}
									onChange={(e) => setShowTravelAgency(e.target.checked)}
								/>
							</Grid>

							{/* InputLabel ve Autocomplete: 10 birim */}
							{showTravelAgency && (
								<Grid item xs={11}>
									<InputLabel>Include Travel Agency</InputLabel>
									<Controller
										name="TravelAgencyId"
										control={control}
										render={({ field }) => (
											<Autocomplete
												{...field}
												size="small"
												options={travelAgencyOptions}
												getOptionLabel={(option) => option.name || ''}
												isOptionEqualToValue={(option, value) => option.id === value.id}
												value={
													travelAgencyOptions.find((option) => option.id === field.value) ||
													null
												}
												renderInput={(params) => <TextField {...params} variant="outlined" />}
												onChange={(_, data) =>
													setValue('TravelAgencyId', data?.id || undefined)
												}
											/>
										)}
									/>
								</Grid>
							)}
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
						<InputLabel required>End Date</InputLabel>
						<Controller
							name="endDate"
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
