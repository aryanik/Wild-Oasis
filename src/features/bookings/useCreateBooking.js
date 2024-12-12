import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { createBooking as createBookingApi } from "../../services/apiBookings";

export function useCreateBooking() {
    const queryClient = useQueryClient();
    const { mutate: createBooking, isPending: isCreating } = useMutation({
      // mutationFn: newcabin => createCabin(newcabin)
      mutationFn: createBookingApi,
      onSuccess: () => {
        toast.success("New booking Successfully Created");
        queryClient.invalidateQueries({
          queryKey: ["bookings", "today-activity", "stays", "last-7"],
        });
      },
      onError: (err) => toast.error(err.message),
    });

    return {isCreating, createBooking}
}
