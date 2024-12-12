
import styled from "styled-components";
import { useRecentBookings } from "./useRecentBooking";
import {useCabins} from "../cabins/useCabins"
import Spinner from "../../ui/Spinner";
import { useRecentStays } from "./useRecentStays";
import Stats from "./Stats";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;


export default function DashboardLayout() {
  const {isPending, bookings}= useRecentBookings();
  const { isPending: isPending2, confirmedStays, numDays } = useRecentStays();
  const {cabins, isPending: isPending3}= useCabins();
  if(isPending || isPending2 || isPending3) return <Spinner />
  console.log(bookings);
  return (
    <StyledDashboardLayout>
      <Stats bookings={bookings} confirmedStays ={confirmedStays} numDays={numDays} cabinCount={cabins.length}/>
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart bookings={bookings} numDays={numDays}/>
    </StyledDashboardLayout>
  )
}
