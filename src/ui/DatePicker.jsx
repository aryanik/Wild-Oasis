/* eslint-disable react/prop-types */
// import { useState } from "react";
import Button from "./Button";
import Form from "./Form";
import FormRow from "./FormRow";
import Input from "./Input";

export default function DatePicker({ onDateChange }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());
    formValues.startDate = `${formValues.startDate} 00:00:00`;
    formValues.endDate = `${formValues.endDate} 00:00:00`;
    onDateChange(formValues);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Number of Guests">
        <Input id="numGuests" type="number" name="numGuests" />
      </FormRow>
      <FormRow label="start-date">
        <Input id="startDate" type="date" name="startDate" />
      </FormRow>
      <FormRow label="end-date">
        <Input id="end-date" type="date" name="endDate" />
      </FormRow>
      <FormRow>
        <Button>Apply</Button>
      </FormRow>
    </Form>
  );
}
