import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import {InputLabel} from '@mui/material';
import NativeSelect from '@mui/material/NativeSelect';
import Button from '@mui/material/Button';

export const Form = () => {
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
    type: '',
  });
  const handleSubmit = e => {
    e.preventDefault();
    const {name, size, type} = e.target.elements;

    if (!name.value) {
      setFormErrors(prevState => ({...prevState, name: 'Name is required'}));
    }
    if (!size.value) {
      setFormErrors(prevState => ({...prevState, size: 'Size is required'}));
    }
    if (!type.value) {
      setFormErrors(prevState => ({...prevState, type: 'Type is required'}));
    }
  };

  return (
    <>
      <h1>create Product</h1>
      <form onSubmit={handleSubmit}>
        <TextField label="name" id="name" helperText={formErrors.name} />
        <TextField label="size" id="size" helperText={formErrors.size} />
        <InputLabel htmlFor="type">type</InputLabel>
        <NativeSelect
          defaultValue=""
          inputProps={{
            name: 'type',
            id: 'type',
          }}
        >
          <option value="">Select one Option</option>
          <option value="electronic">electronic</option>
          <option value="furniture">furniture</option>
          <option value="clothing">clothing</option>
        </NativeSelect>
        {formErrors.type.length && <p>{formErrors.type}</p>}

        <Button type="submit">Submit</Button>
      </form>
    </>
  );
};

export default Form;
