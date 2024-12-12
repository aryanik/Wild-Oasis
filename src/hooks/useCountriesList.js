import { useQuery } from "@tanstack/react-query";
import { fetchCountries } from "../services/apiCountryList";

export function useCountriesList(){
    const{data: countriesList, isPending}=useQuery({
        queryKey:["countries"],
        queryFn: ()=> fetchCountries()
    });

    return {countriesList, isPending}
}