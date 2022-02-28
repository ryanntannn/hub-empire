export function numberWithCommas(x: number) {
	return formatDecimal(x, 2)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDecimal(value: number, decimalPlaces: number) {
	return Number(
		Math.round(parseFloat(value + 'e' + decimalPlaces)) +
			'e-' +
			decimalPlaces
	);
}
