import { useEffect, useState } from 'react';
import Select from 'react-select';
import { ROLES } from '../../config/roles';

const SelectedRoles = ({ validRolesClass, selectredRoles, onChangeValue }) => {
  const rolesOptions = Object.values(ROLES).map((role) => {
    return { value: role, label: role };
  });
  const selectedRolesOptions = Object.values(selectredRoles).map((role) => {
    return { value: role, label: role };
  });

  const [selectedOption, setSelectedOption] = useState(null);
  const [defaultSelect] = useState(selectedRolesOptions);

  useEffect(() => {
    if (selectedOption?.option) {
      let selectedRoles = [];
      for (let i = 0; i < selectedOption?.option.length; ++i) {
        selectedRoles.push(selectedOption.option[i].label);
      }
      onChangeValue(selectedRoles);
    }
  }, [selectedOption, onChangeValue]);

  const handleChange = (option) => {
    // console.log(option);
    setSelectedOption({ option });
    // onCloseCount(false);
  };
  return (
    <Select
      isOptionSelected={selectedOption}
      isMulti
      defaultValue={defaultSelect}
      onChange={handleChange}
      options={rolesOptions}
      className={validRolesClass}
    />
  );
};

export default SelectedRoles;
