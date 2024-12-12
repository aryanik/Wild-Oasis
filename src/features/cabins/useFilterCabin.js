import { useMutation } from "@tanstack/react-query";
import { filterCabins } from "../../services/apiCabins";

export function useFilterCabin() {
    const{mutate: showFilterCabin, isPending}=useMutation({
        mutationFn: filterCabins,
    });
    return {showFilterCabin, isPending}; 
}