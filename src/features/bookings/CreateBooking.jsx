/* eslint-disable react/prop-types */
import { useState } from "react";
import { useCountriesList } from "../../hooks/useCountriesList";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useNewGuest } from "./useNewGuest";
import Spinner from "../../ui/Spinner";
import { useSearchParams } from "react-router-dom";

function CreateBooking({onShowChange}) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { countriesList } = useCountriesList();
  const { createGuest, isPending } = useNewGuest();

  const countryList =
    countriesList?.map((country) => ({
      name: country.name.common,
      flagcode: country.flags.svg, // Ensure the API provides a PNG flag URL
    })) || [];

  // Handle country selection and store the corresponding flagcode
  const handleCountryChange = (event) => {
    const selectedCountryName = event.target.value;
    const selectedCountryData = countryList.find(
      (country) => country.name === selectedCountryName
    );
    setSelectedCountry(selectedCountryData);
  };

  function handleSubmit(event) {
    event.preventDefault();
    // Get form data
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries()); // Converts to an object
    if (selectedCountry) {
      formValues.countryFlag = selectedCountry.flagcode;
    }
    createGuest(formValues, {
      onSuccess: (createdGuest) => {
        console.log(createdGuest);
        if (createdGuest[0]?.id) {
            // console.log(createdGuest[0]?.id);
            searchParams.set("guestId", createdGuest[0]?.id);
            setSearchParams(searchParams);
            onShowChange();
        }
      },
    });
    
  }
  if (isPending) <Spinner />;

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormRow label="Full name">
          <Input type="text" id="fullName" name="fullName" />
        </FormRow>

        <FormRow label="Email address">
          <Input type="email" id="email" name="email" />
        </FormRow>

        <FormRow label="Nationality">
          <select
            id="nationality"
            name="nationality"
            defaultValue=""
            onChange={handleCountryChange}
          >
            <option value="" disabled>
              Select your country
            </option>
            {countryList.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow label="National Id">
          <Input type="text" id="nationalID" name="nationalID" />
        </FormRow>

        <FormRow>
          {/* type is an HTML attribute! */}
          <Button variation="secondary" type="reset">
            Cancel
          </Button>
          <Button>Next</Button>
        </FormRow>
      </Form>
    </>
  );
}
export default CreateBooking;
