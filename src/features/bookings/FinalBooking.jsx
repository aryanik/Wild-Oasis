import { useForm } from "react-hook-form";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Textarea from "../../ui/Textarea";
import styled from "styled-components";
import Checkbox from "../../ui/Checkbox";
import Heading from "../../ui/Heading";
import { useState } from "react";
import Button from "../../ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSingleCabin } from "../cabins/useSingleCabin";
import Spinner from "../../ui/Spinner";
import { useCreateBooking } from "./useCreateBooking";
import CreateBooking from "./CreateBooking";

const Box = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

export default function FinalBooking() {
  const [showNext, setShowNext] = useState(false);
  const { register, handleSubmit } = useForm();
  const [searchParams] = useSearchParams();
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const navigate = useNavigate();
  const {cabin , isPending} = useSingleCabin();
  const {isCreating, createBooking} = useCreateBooking();

  if (isPending || isCreating) return <Spinner />;
  const {
    regularPrice,
    discount
  } = cabin;
  const calculateNumNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const numGuests = searchParams.get("numGuests");
  const guestId = searchParams.get("guestId");
  const cabinId = searchParams.get("cabinId");
  const cabinPrice = Math.round((regularPrice - discount) * calculateNumNights(startDate, endDate));
  const extraPrice = addBreakfast ? (300 * calculateNumNights(startDate,endDate)) : "";
  const totalPrice = cabinPrice + extraPrice;



  const onSubmit = (formData) => {


    const bookingDetails = {
      ...formData,
      hasBreakfast: addBreakfast,
      isPaid: confirmPaid,
      startDate,
      endDate,
      numNights: calculateNumNights(startDate, endDate),
      cabinPrice: cabinPrice,
      totalPrice: totalPrice,
      extrasPrice: extraPrice,
      numGuests,
      guestId,
      cabinId,
      status: "unconfirmed",
    };
    createBooking(bookingDetails, {
      onSuccess: navigate("/")
    });
    console.log(bookingDetails);
  };

  function handleShowChange() {
    setShowNext(true);
  }

  return (
    <>
      <Heading as="h1">Final Booking Details</Heading>
      {!showNext && (<CreateBooking onShowChange={handleShowChange}/>)}
      {showNext && (<Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Observations">
          <Textarea
            type="text"
            id="observations"
            defaultValue=""
            {...register("observations", {
              required: "This field is required",
            })}
          />
        </FormRow>

        <Box>
          <Checkbox
            id="hasBreakfast"
            name="hasBreakfast"
            checked={addBreakfast}
            onChange={() => setAddBreakfast((prev) => !prev)}
          >
            Do you want to include breakfast ☕️🧇 ?
          </Checkbox>
        </Box>
        <Box>
          <Checkbox
            id="isPaid"
            name="isPaid"
            checked={confirmPaid}
            onChange={() => setConfirmPaid((prev) => !prev)}
          >
            Is your booking paid ✔️ ?
          </Checkbox>
        </Box>

        <FormRow>
          <Button type="submit">Confirm Booking</Button>
        </FormRow>
      </Form>)}
    </>
  );
}
