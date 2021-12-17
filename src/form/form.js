import React from 'react';
import TextField from '@mui/material/TextField';
import {InputLabel} from '@mui/material';
import NativeSelect from '@mui/material/NativeSelect';
import Button from '@mui/material/Button';

export const Form = () => (
  <>
    <h1>create Product</h1>
    <form>
      <TextField label="name" id="name" />
      <TextField label="size" id="size" />
      <InputLabel htmlFor="type">type</InputLabel>
      <NativeSelect
        defaultValue={30}
        inputProps={{
          name: 'type',
          id: 'type',
        }}
      >
        <option value="electronic">electronic</option>
        <option value="furniture">furniture</option>
        <option value="clothing">clothing</option>
      </NativeSelect>

      <Button>Submit</Button>
    </form>
  </>
);

export default Form;
