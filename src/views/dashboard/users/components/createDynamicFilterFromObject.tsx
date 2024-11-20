import { Filter, Logic, Operator } from 'api/services/types';

// Varsayılan operator ve logic
const defaultOperator: Operator = 'contains';
const logicAnd: Logic = 'and';
const logicOr: Logic = 'or';

// Statik ana filtre
const staticMainFilter: Filter = {
	field: 'isDeleted',
	operator: 'eq',
	value: 'false',
	logic: logicAnd,
	filters: [],
};

// Fonksiyonu güncelledik: Yalnızca belirtilen alanlar için filtre oluşturur
export function createDynamicFilterFromObject(
	obj: Record<string, string | number | (string | number)[]> | unknown,
	operatorOverrides: Record<string, Operator> = {}, // Varsayılan operatör geçersiz kılma
	namesToReturn: string[] = [], // Filtrelenecek alan adları
): Filter {
	if (obj && typeof obj === 'object' && obj !== null) {
		const newObj: Record<string, string | number | (string | number)[]> = {};

		// Null veya boş olan ve uzunluğu 0 olan değerleri çıkar
		for (const [key, value] of Object.entries(obj)) {
			if (
				value !== null &&
				value !== '' &&
				((!Array.isArray(value) && value !== undefined) || (Array.isArray(value) && value.length > 0))
			) {
				newObj[key] = value;
			}
		}

		const keys = Object.keys(newObj);

		// Eğer belirtilen alanlardan biri yoksa sadece statik ana filtre döndür
		if (keys.length === 0) {
			return staticMainFilter;
		}

		const createFilter = (field: string, value: string | number, logic: Logic, filters: Filter[] = []): Filter => ({
			field,
			operator: operatorOverrides[field] || defaultOperator, // Özel operatör kullanımı
			value: value.toString(), // Number'ı stringe çevir
			logic,
			filters,
		});

		const mainFilters: Filter[] = [];

		for (const key of keys) {
			// Sadece belirtilen alan adlarını kontrol et
			if (!namesToReturn.includes(key)) continue;

			const value = newObj[key];

			if (Array.isArray(value)) {
				// Array değerler için iç içe filtreler oluştur
				let nestedFilter: Filter | null = null;
				for (let i = value.length - 1; i >= 0; i--) {
					nestedFilter = createFilter(
						key,
						value[i] as string | number,
						logicOr,
						nestedFilter ? [nestedFilter] : [],
					);
				}
				if (nestedFilter) {
					mainFilters.push(nestedFilter);
				}
			} else if (typeof value === 'string' || typeof value === 'number') {
				// String veya number değerler için tekil filtre oluştur
				mainFilters.push(createFilter(key, value, logicOr));
			}
		}

		return {
			...staticMainFilter,
			filters: mainFilters,
		};
	}

	return staticMainFilter; // Boş veya geçersiz veri durumunda sadece statik ana filtre döndür
}
