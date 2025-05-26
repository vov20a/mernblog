import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { ROLES } from '../../config/roles';
import { IOption } from '../../types/IOption';

interface SelectedProps {
  validRolesClass: '' | 'form__input--incomplete';
  onChangeValue: Dispatch<SetStateAction<IOption[]>>;
  selectredRoles?: IOption[];
}

export type OptionType = {
  value: string;
  label: string;
};

const SelectedRoles = ({ validRolesClass, onChangeValue, selectredRoles }: SelectedProps) => {
  const options: OptionType[] = Object.values(ROLES).map((role) => {
    return { value: role, label: role };
  });

  const selectedRolesOptions = selectredRoles?.map((role) => {
    return { value: role, label: role };
  });

  const [selectedValue, setSelectedValue] = useState<MultiValue<OptionType>>([]);

  const handleChange = (selectedOption: MultiValue<OptionType>) => {
    setSelectedValue(selectedOption);
  };

  useEffect(() => {
    if (selectedValue.length) {
      let selectedRoles: IOption[] = [];
      for (let i = 0; i < selectedValue.length; ++i) {
        selectedRoles.push(selectedValue[i].value as IOption);
      }
      onChangeValue(selectedRoles);
    }
  }, [selectedValue, onChangeValue]);

  return (
    <Select
      id="flavor-selected"
      isMulti
      defaultValue={selectedRolesOptions}
      options={options as readonly { value: IOption; label: IOption }[]}
      onChange={handleChange}
      className={validRolesClass}
    />
  );
};

export default SelectedRoles;
