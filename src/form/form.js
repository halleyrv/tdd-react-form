import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import {InputLabel} from '@mui/material';
import NativeSelect from '@mui/material/NativeSelect';
import Button from '@mui/material/Button';

export const Form = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
    type: '',
  });
  const handleSubmit = async e => {
    e.preventDefault();
    const {name, size, type} = e.target.elements;

    setIsSaving(true);
    if (!name.value) {
      setFormErrors(prevState => ({...prevState, name: 'Name is required'}));
    }
    if (!size.value) {
      setFormErrors(prevState => ({...prevState, size: 'Size is required'}));
    }
    if (!type.value) {
      setFormErrors(prevState => ({...prevState, type: 'Type is required'}));
    }
    await fetch('/products', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    setIsSaving(false);
  };

  const handleBlur = e => {
    const {name, value} = e.target;
    setFormErrors({
      ...formErrors,
      [name]: value.length ? '' : `${name} is required`,
    });
  };

  return (
    <>
      <h1>create Product</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="name"
          id="name"
          name="name"
          helperText={formErrors.name}
          onBlur={handleBlur}
        />
        <TextField
          label="size"
          id="size"
          name="size"
          helperText={formErrors.size}
          onBlur={handleBlur}
        />
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

        <Button disabled={isSaving} type="submit">
          Submit
        </Button>
      </form>
    </>
  );
};

export default Form;
