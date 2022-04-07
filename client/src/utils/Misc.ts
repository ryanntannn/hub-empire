import React from 'react';
import { Dropdown, DropdownItem } from 'reactstrap';
import { EnumType } from 'typescript';

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

const StringIsNumber = (value: string) => isNaN(Number(value)) === false;

// Turn enum into array
export function enumToArray(enumme: any) {
	return Object.keys(enumme)
		.filter(StringIsNumber)
		.map((key) => enumme[key]);
}
