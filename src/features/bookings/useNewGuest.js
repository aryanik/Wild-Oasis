import { useMutation } from "@tanstack/react-query";
import { createNewGuest } from "../../services/apiGuest";
import toast from "react-hot-toast";

export function useNewGuest() {
    const{mutate: createGuest, isPending}=useMutation({
        mutationFn: createNewGuest,
        onSuccess: ()=> {
            toast.success("New Guest Added Successfully");
        },
        onError: (err)=> toast.error(err.message),
    });
    return {createGuest, isPending}; 
}