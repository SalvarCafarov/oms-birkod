import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { VirtualScroller } from 'primereact/virtualscroller';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StyledMultiSelect } from './StyledMultiSelect';

interface MultiSelectProps {
	name: string;
	options: { label: string; value: string; imgUrl?: string }[];
	onChange: (selectedOptions: { value: string; imgUrl?: string }[] | { value: string; imgUrl?: string }) => void;
	error?: boolean;
	values?: { value: string; imgUrl?: string }[] | { value: string; imgUrl?: string };
	singleSelect?: boolean;
	disabled?: boolean;
	noData?: string;
}

const CustomMultiSelect2 = ({
	options,
	onChange,
	values,
	error = false,
	singleSelect = false,
	disabled = false,
	noData = 'Məlumat yoxdur',
}: MultiSelectProps) => {
	const initialSelectedOptions = singleSelect
		? Array.isArray(values)
			? values[0]
				? [values[0]]
				: []
			: []
		: Array.isArray(values)
		  ? values
		  : [];

	const [selectedOptions, setSelectedOptions] =
		useState<{ value: string; imgUrl?: string }[]>(initialSelectedOptions);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [checked, setChecked] = useState<boolean>(false);
	const [visibleOptions, setVisibleOptions] = useState<{ label: string; value: string; imgUrl?: string }[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		setVisibleOptions(options);
	}, [options]);

	useEffect(() => {
		const updatedOptions = singleSelect
			? Array.isArray(values)
				? [values[0]]
				: []
			: Array.isArray(values)
			  ? values
			  : [];
		setSelectedOptions(updatedOptions);
	}, [values, singleSelect]);

	useEffect(() => {
		if (isOpen) {
			const handleOutsideClick = (event: MouseEvent) => {
				if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
					setIsOpen(false);
				}
			};

			document.addEventListener('mousedown', handleOutsideClick);

			return () => {
				document.removeEventListener('mousedown', handleOutsideClick);
			};
		}
	}, [isOpen]);

	const toggleOpen = () => {
		if (!disabled) {
			if (isOpen && singleSelect && selectedOptions.length > 0) {
				setIsOpen(false);
			} else {
				setIsOpen(!isOpen);
			}
		}
	};

	const toggleOption = (option: { value: string; imgUrl?: string }) => {
		if (disabled) return;

		let updatedOptions: { value: string; imgUrl?: string }[];

		if (singleSelect) {
			updatedOptions = selectedOptions[0]?.value === option.value ? [] : [option];
		} else {
			const isSelected = selectedOptions.some((selectedOption) => selectedOption.value === option.value);
			if (isSelected) {
				updatedOptions = selectedOptions.filter((selectedOption) => selectedOption.value !== option.value);
			} else {
				updatedOptions = [...selectedOptions, option];
			}
		}

		setSelectedOptions(updatedOptions);
		onChange(singleSelect ? updatedOptions[0] : updatedOptions);
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const filteredOptions = options.filter((option) =>
			option.label.toLowerCase().includes(event.target.value.toLowerCase()),
		);
		setVisibleOptions(filteredOptions);
	};

	const handleSelectAll = () => {
		if (disabled) return;

		const allSelected = visibleOptions.every((option) =>
			selectedOptions.some((selectedOption) => selectedOption.value === option.value),
		);
		let updatedOptions: { value: string; imgUrl?: string }[];

		if (allSelected) {
			updatedOptions = selectedOptions.filter(
				(selectedOption) => !visibleOptions.some((option) => option.value === selectedOption.value),
			);
		} else {
			updatedOptions = [
				...selectedOptions,
				...visibleOptions.filter(
					(option) => !selectedOptions.some((selectedOption) => selectedOption.value === option.value),
				),
			];
		}

		setSelectedOptions(updatedOptions);
		onChange(singleSelect ? updatedOptions[0] : updatedOptions);
	};

	const itemTemplate = (option: { label: string; value: string; imgUrl?: string }) => (
		<div
			key={option.value}
			className={`option ${
				selectedOptions.some((selectedOption) => selectedOption.value === option.value) ? 'selected' : ''
			} ${disabled ? 'disabled' : ''}`}
			onClick={() => toggleOption(option)}
		>
			<Checkbox
				checked={selectedOptions.some((selectedOption) => selectedOption.value === option.value)}
				disabled={disabled}
				onChange={() => toggleOption(option)}
			/>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				{option.imgUrl && (
					<img src={option.imgUrl} alt={option.label} style={{ width: 20, height: 20, marginRight: 8 }} />
				)}
				<p className="option-name">{option.label}</p>
			</div>
		</div>
	);

	return (
		<StyledMultiSelect ref={containerRef} error={error}>
			<div style={{ position: 'relative' }}>
				<input
					readOnly
					type="text"
					className={`multi-select-input ${error ? 'error' : ''}`}
					placeholder={t('common:select')}
					value={selectedOptions.map((option) => option.value).join(', ')}
					disabled={disabled}
					title={selectedOptions.map((option) => option.value).join(', ')} // Fallback for tooltip
					onClick={toggleOpen}
				/>
				{/* Tooltip with overflow text */}
				<div className="tooltip">{selectedOptions.map((option) => option.value).join(', ')}</div>
			</div>
			{error && <span className="error-message">Please select a value.</span>}
			{isOpen && (
				<div className="options-container">
					<div className="search-box">
						{!singleSelect && (
							<Checkbox
								checked={checked}
								disabled={disabled}
								onChange={() => {
									setChecked(!checked);
									handleSelectAll();
								}}
							></Checkbox>
						)}
						<InputText
							className="searchInput"
							style={{ width: '100%' }}
							disabled={disabled}
							onChange={handleSearch}
						/>
						<i className="pi pi-times" onClick={toggleOpen}></i>
					</div>
					{visibleOptions.length > 0 ? (
						<VirtualScroller
							items={visibleOptions}
							itemSize={38}
							itemTemplate={itemTemplate}
							className="border-1 surface-border border-round"
							style={{ width: '100%', height: '250px' }}
						/>
					) : (
						<div className="no-data">{noData}</div>
					)}
				</div>
			)}
		</StyledMultiSelect>
	);
};

export default CustomMultiSelect2;
