import React from "react";
import {
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

export const CurrencyInput = ({
  data,
  type,
  currency,
  inputValue,
  onCurrencyChange,
}) => {
  const dropDown = Object.keys(data).map((curr, index) => (
    <Dropdown.Item key={index} eventKey={curr}>
      {curr}
    </Dropdown.Item>
  ));

  const handleInputChange = (e) => {
    try {
      let val = e.target.value;
      onCurrencyChange(val, currency, true);
    } catch {
      onCurrencyChange(inputValue, e, false);
    }
  };

  const selectText = () => {
    let id = type + "Form";
    const input = document.getElementById(id);
    input.focus();
    input.select();
  };

  return (
    <div>
      <InputGroup>
        {type === "Fiat" ? (
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">
              {data[currency].symbol}
            </InputGroup.Text>
          </InputGroup.Prepend>
        ) : null}
        <FormControl
          id={type + "Form"}
          placeholder={type}
          aria-label={type}
          aria-describedby="basic-addon2"
          onClick={selectText}
          value={inputValue}
          onChange={handleInputChange}
        />

        <DropdownButton
          as={InputGroup.Append}
          title={currency}
          id="input-group-dropdown-2"
          onSelect={handleInputChange}
        >
          {dropDown}
        </DropdownButton>
      </InputGroup>
    </div>
  );
};
