import {
	Box,
	BoxProps,
	Button,
	Card,
	CardContent,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	// Link,
	Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { LoginRequestDto } from 'api/services/auth';
import { useAppDispatch } from 'app/hooks';
import loginBg1 from 'assets/img/login-bg1.svg';
import loginBg2 from 'assets/img/login-bg2.svg';
import Icon from 'components/icon';
import { loginAsync } from 'context/auth/authSlice';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { deepOmit } from 'utils/object-helper';

import { validationSchema } from './validationSchema';

const Root = styled(Box)<BoxProps>(({ theme }) => ({
	maxWidth: 400,
	position: 'relative',
	'&:before': {
		zIndex: -1,
		top: -79,
		content: '""',
		left: -46,
		width: 238,
		height: 234,
		position: 'absolute',
		backgroundImage: `url('${loginBg1}')`,
	},
	'&:after': {
		zIndex: -1,
		content: '""',
		width: 180,
		right: -57,
		height: 180,
		bottom: -54,
		position: 'absolute',
		backgroundImage: `url('${loginBg2}')`,
	},
	'& .card-wrapper': {
		width: '25rem',
		'& .card-content': {
			padding: theme.spacing(10.5, 8, 8),
			'& .title': {
				display: 'flex',
				justifyContent: 'center',
				marginBottom: theme.spacing(8),
				'& h3': {
					fontWeight: 700,
				},
			},
		},
	},
}));

interface FormData {
	email: string;
	password: string;
	rememberMe: boolean;
}

export const Login = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const { mutate: login } = useMutation({
		mutationFn: (data: LoginRequestDto) => {
			return dispatch(loginAsync(data));
		},
	});

	const handleSubmit = (formData: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
		const data = deepOmit(formData, ['rememberMe']);
		login(data, {
			onSuccess: () => {
				toast.success(t('loginSuccess'));
				navigate(location.state?.from ?? '/');
			},
			onSettled: () => {
				setSubmitting(false);
			},
		});
	};

	const initialValues = {
		email: '',
		password: '',
		rememberMe: true,
	};

	const translatedValidationSchema = validationSchema(t);

	return (
		<Root>
			<Card className="card-wrapper">
				<CardContent className="card-content">
					<Box className="title">
						<Typography variant="h3">{import.meta.env.VITE_PROJECT_NAME}</Typography>
					</Box>
					<Box
						sx={{
							mb: (theme) => theme.spacing(6),
						}}
					>
						<Typography variant="h4">{t('signIn')}</Typography>
					</Box>
					<Formik
						initialValues={initialValues}
						validationSchema={translatedValidationSchema}
						onSubmit={handleSubmit}
					>
						{() => {
							return (
								<Form>
									<Grid container rowSpacing={4}>
										<Grid item xs={12}>
											<InputLabel>{t('email')}</InputLabel>
											<Field
												name="email"
												size="small"
												placeholder="example@gmail.com"
												component={TextField}
											/>
										</Grid>
										<Grid item xs={12}>
											<InputLabel>{t('password')}</InputLabel>
											<Field
												name="password"
												size="small"
												type={showPassword ? 'text' : 'password'}
												placeholder="············"
												component={TextField}
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<IconButton
																edge="end"
																onMouseDown={(e) => e.preventDefault()}
																onClick={() =>
																	setShowPassword((showPassword) => !showPassword)
																}
															>
																<Icon
																	fontSize="1.25rem"
																	icon={
																		showPassword ? 'tabler:eye' : 'tabler:eye-off'
																	}
																/>
															</IconButton>
														</InputAdornment>
													),
												}}
											/>
											{/* <Box
												sx={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													mb: (theme) => theme.spacing(1.75),
													mt: (theme) => theme.spacing(1.5),
												}}
											>
												<Field
													component={CheckboxWithLabel}
													type="checkbox"
													name="rememberMe"
													Label={{ label: t('rememberMe') }}
												/>
												<Link
													to="/forgot-password"
													variant="body1"
													component={RouterLink}
													sx={{ mb: (theme) => theme.spacing(1) }}
												>
													{t('forgotPassword')}
												</Link>
											</Box> */}
											<Button
												fullWidth
												type="submit"
												variant="contained"
												sx={{
													mt: (theme) => theme.spacing(6),
												}}
											>
												{t('login')}
											</Button>
										</Grid>
									</Grid>
								</Form>
							);
						}}
					</Formik>
				</CardContent>
			</Card>
		</Root>
	);
};
