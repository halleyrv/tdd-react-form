import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import {InputLabel} from '@mui/material';
import NativeSelect from '@mui/material/NativeSelect';
import Button from '@mui/material/Button';

import {saveProduct} from '../services/productServices';
import {CREATED_STATUS, ERROR_SERVER_STATUS} from '../consts/httpStatus';

export const Form = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
    type: '',
  });

  const validateField = ({name, value}) => {
    setFormErrors(prevState => ({
      ...prevState,
      [name]: value.length ? '' : `${name} is required`,
    }));
  };

  const validateForm = ({name, size, type}) => {
    validateField({name: 'name', value: name});
    validateField({name: 'size', value: size});
    validateField({name: 'type', value: type});
  };

  const getFormValues = ({name, size, type}) => ({
    name: name.value,
    size: size.value,
    type: type.value,
  });

  const handleSubmit = async e => {
    e.preventDefault();
    const {name, size, type} = e.target.elements;

    setIsSaving(true);
    validateForm(getFormValues({name, size, type}));
    const response = await saveProduct(getFormValues({name, size, type}));
    if (response.status === CREATED_STATUS) {
      e.target.reset();
      setIsSuccess(true);
    }
    if (response.status === ERROR_SERVER_STATUS) {
      setErrorMessage('unexpected error');
    }
    setIsSaving(false);
  };

  const handleBlur = e => {
    const {name, value} = e.target;
    validateField({name, value});
  };

  return (
    <>
      <h1>Create Product</h1>
      {isSuccess && <p>Product stored</p>}
      <p>{errorMessage}</p>
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
