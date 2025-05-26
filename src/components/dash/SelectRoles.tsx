import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';

// Define the interface for the options
interface OptionType {
  value: string;
  label: string;
}

const options: OptionType[] = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const SelectRoles = () => {
  const [selectedValue, setSelectedValue] = useState<SingleValue<OptionType>>(null);

  const handleChange = (selectedOption: SingleValue<OptionType>) => {
    setSelectedValue(selectedOption);
  };
  return (
    <Select
      id="flavor-select"
      options={options}
      value={selectedValue}
      onChange={handleChange}
      placeholder="Select..."
    />
  );
};

export default SelectRoles;
