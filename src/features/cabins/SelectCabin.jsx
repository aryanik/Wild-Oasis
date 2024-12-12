/* eslint-disable no-unused-vars */
import Heading from "../../ui/Heading";
import Menus from "../../ui/Menus";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import CabinRow from "./CabinRow";
import Row from "../../ui/Row";
import { useState } from "react";
import { useFilterCabin } from "./useFilterCabin";
import DatePicker from "../../ui/DatePicker";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../ui/Button";

export default function SelectCabin() {
  const [showCabin, setShowCabin] = useState(false);
  const [showRest, setShowReset] = useState(false);
  const [filteredCabins, setFilteredCabins] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { showFilterCabin, isPending: isFilterPending } = useFilterCabin();
  const navigate = useNavigate();
  const hideFunction = true;

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const numGuests = searchParams.get("numGuests");
  
  if (isFilterPending) return <Spinner />;

  const handleDateChange = ({ startDate, endDate, numGuests }) => {
    if (startDate && endDate) {
      searchParams.set("startDate", startDate);
      searchParams.set("endDate", endDate);
      searchParams.set("numGuests", numGuests);
      showFilterCabin(
        { startDate, endDate, numGuests },
        {
          onSuccess: (data) => {
            setFilteredCabins(data); // Update cabins in the state
          },
          onError: (err) => {
            console.error("Error fetching filtered cabins:", err);
          },
        }
      );
    }
    setSearchParams(searchParams);
    setShowCabin(!showCabin);
    setShowReset(true);
  };

  function handleClick(id) {
    navigate(
      `/finalBooking?cabinId=${id}&startDate=${startDate}&endDate=${endDate}&numGuests=${numGuests}`
    );
  }

  function handleToggleCabin(id) {
    searchParams.set("guestId", id);
    setShowCabin(false);
    setShowReset(!showRest);
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Select a cabin</Heading>
        {showRest && <Button variation ="secondary" onClick={handleToggleCabin}>Reset Filter</Button>}
      </Row>

      {!showCabin && <DatePicker onDateChange={handleDateChange} />}
      {showCabin && (
        <Menus>
          <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr 1fr">
            <Table.Header>
              <div></div>
              <div>Cabin</div>
              <div>Capacity</div>
              <div>Price</div>
              <div>Discount</div>
              <div>Final Price</div>
              <div>Select</div>
            </Table.Header>
            <Table.Body
              data={filteredCabins}
              render={(cabin) => (
                <CabinRow
                  cabin={cabin}
                  key={cabin.id}
                  hideFunction={hideFunction}
                  onClick={handleClick}
                />
              )}
            />
          </Table>
        </Menus>
      )}
    </>
  );
}
