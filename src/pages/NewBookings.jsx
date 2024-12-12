import SelectCabin from "../features/cabins/SelectCabin";
import Heading from "../ui/Heading";

function NewBookings() {
  return (
    <>
      <Heading as="h1">Create a new booking</Heading>
       <SelectCabin /> 
    </>
  );
}
export default  NewBookings;
