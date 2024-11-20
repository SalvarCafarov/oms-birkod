import './index.css';
import 'i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from 'app/store';
import { ReactHotToast } from 'components/react-hot-toast';
import { ConfirmationProvider } from 'configs/context/confirmationContext';
import { SettingsConsumer, SettingsProvider } from 'configs/context/settingsContext';
import ThemeComponent from 'configs/theme/ThemeComponent';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from 'routes';

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<Provider store={store}>
			<SettingsProvider>
				<SettingsConsumer>
					{({ settings }) => {
						return (
							<ThemeComponent settings={settings}>
								<ConfirmationProvider>
									<RouterProvider router={router} />
								</ConfirmationProvider>
								<ReactHotToast>
									<Toaster
										position={settings.toastPosition}
										toastOptions={{ className: 'react-hot-toast' }}
									/>
								</ReactHotToast>
							</ThemeComponent>
						);
					}}
				</SettingsConsumer>
			</SettingsProvider>
		</Provider>
	</QueryClientProvider>,
);
