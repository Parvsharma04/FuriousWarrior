"use client";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PhoneInputComponent({ value, onChange }: PhoneInputProps) {
  const handlePhoneChange = (value: string, country: { dialCode: string }) => {
    // Split the value to format it as +{dialCode} {number}
    const countryCode = `+${country.dialCode}`;
    const remainingNumber = value.slice(country.dialCode.length);
    const formattedValue = `${countryCode} ${remainingNumber}`;

    // Update the parent component with the formatted value
    onChange(formattedValue);
  };

  return (
    <PhoneInput
      country={"us"}
      value={value.replace(/\s/g, '')} // Remove any spaces before setting initial value
      onChange={handlePhoneChange}
      containerClass="w-full"
      inputClass="form-control w-full"
      dropdownClass="custom-dropdown"
    />
  );
}
