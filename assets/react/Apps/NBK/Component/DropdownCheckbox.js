import React, { useState, useEffect} from 'react';



const DropdownCheckbox = ({ options, onChange, valueObj, labelObj, selectedData, label, className, idPrefix }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen); // Toggle isOpen state on button click
    };

    const handleChange = (event) => {
        const { value, checked } = event.target;
        let newSelectedValues;
    
        if (value === 'none') {
          newSelectedValues = checked ? ['none'] : [];
        } else {
          newSelectedValues = checked
            ? [...selectedValues.filter(val => val !== 'none'), value]
            : selectedValues.filter((item) => item !== value);
        }
    
        setSelectedValues(newSelectedValues);
        onChange(newSelectedValues);
      };

    useEffect(() => {
        setSelectedValues(selectedData);
    }, [selectedData]);

    const getSelectedLabels = () => {
        return selectedData?.length;
    };

    return (
        <div className={`dropdown-checkbox ${className}`} >
            <button type="button" onClick={toggleDropdown} className="dropdown-button">
                {selectedValues.length > 0 ? getSelectedLabels()+' Selected' : label}
            </button>
            {isOpen && (
                <ul className={isOpen ? 'dropdown-list open' : 'dropdown-list'}>
                    {options && options.map((option, index) => (
                        <li key={index} className="dropdown-item">
                            <input
                                type="checkbox"
                                id={`${idPrefix}-${option[valueObj]}`}
                                value={option[valueObj]}
                                onChange={handleChange}
                                className="dropdown-checkbox-input"
                                checked={selectedValues.includes(option[valueObj])}
                            />
                            <label htmlFor={`${idPrefix}-${option[valueObj]}`} className="dropdown-label">
                                {option[labelObj]}
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownCheckbox;

