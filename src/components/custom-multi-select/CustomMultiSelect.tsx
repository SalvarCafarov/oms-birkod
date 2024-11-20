import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { VirtualScroller } from 'primereact/virtualscroller';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StyledMultiSelect } from './StyledMultiSelect';

interface MultiSelectProps {
	name: string;
	options: string[];
	onChange: (selectedOptions: string[] | string) => void;
	error?: boolean;
	values?: string[] | string;
	singleSelect?: boolean;
	disabled?: boolean;
	noData?: string;
}

const CustomMultiSelect = ({
	options,
	onChange,
	values,
	error = false,
	singleSelect = false,
	disabled = false,
	noData = 'Məlumat yoxdur',
}: MultiSelectProps) => {
	const initialSelectedOptions = singleSelect
		? typeof values === 'string'
			? [values]
			: []
		: Array.isArray(values)
		  ? values
		  : [];

	const [selectedOptions, setSelectedOptions] = useState<string[]>(initialSelectedOptions);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [checked, setChecked] = useState<boolean>(false);
	const [visibleOptions, setVisibleOptions] = useState<string[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation();

	useEffect(() => {
		setVisibleOptions(options);
	}, [options]);

	useEffect(() => {
		const updatedOptions = singleSelect
			? typeof values === 'string'
				? [values]
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

	const toggleOption = (option: string) => {
		if (disabled) return;

		let updatedOptions: string[];

		if (singleSelect) {
			// If the option is already selected, unselect it; otherwise, select it.
			updatedOptions = selectedOptions.includes(option) ? [] : [option];
		} else {
			const isSelected = selectedOptions.includes(option);
			if (isSelected) {
				updatedOptions = selectedOptions.filter((selectedOption) => selectedOption !== option);
			} else {
				updatedOptions = [...selectedOptions, option];
			}
		}

		setSelectedOptions(updatedOptions);
		onChange(singleSelect ? updatedOptions[0] : updatedOptions);
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const filteredOptions = options.filter((option) =>
			option.toLowerCase().includes(event.target.value.toLowerCase()),
		);
		setVisibleOptions(filteredOptions);
	};

	const handleSelectAll = () => {
		if (disabled) return;

		const allSelected = visibleOptions.every((option) => selectedOptions.includes(option));
		let updatedOptions: string[];

		if (allSelected) {
			updatedOptions = selectedOptions.filter((selectedOption) => !visibleOptions.includes(selectedOption));
		} else {
			updatedOptions = [
				...selectedOptions,
				...visibleOptions.filter((option) => !selectedOptions.includes(option)),
			];
		}

		setSelectedOptions(updatedOptions);
		onChange(singleSelect ? updatedOptions[0] : updatedOptions);
	};

	const itemTemplate = (option: string) => (
		<div
			key={option}
			className={`option ${selectedOptions.includes(option) ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
			onClick={() => toggleOption(option)}
		>
			<Checkbox
				checked={selectedOptions.includes(option)}
				disabled={disabled}
				onChange={() => toggleOption(option)}
			/>
			<p className="option-name">{option}</p>
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
					value={selectedOptions.join(', ')}
					disabled={disabled}
					title={selectedOptions.join(', ')} // Fallback for tooltip
					onClick={toggleOpen}
				/>
				{/* Tooltip with overflow text */}
				<div className="tooltip">{selectedOptions.join(', ')}</div>
			</div>
			{error && <span className="error-message">{t('validation:selectValue')}</span>}
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

export default CustomMultiSelect;
