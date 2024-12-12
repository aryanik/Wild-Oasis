import { useQuery } from "@tanstack/react-query";
import { getCabin} from "../../services/apiCabins";
import { useSearchParams } from "react-router-dom";

export function useSingleCabin() {
    const [searchParams]= useSearchParams();
    const cabinId = searchParams.get("cabinId");
    console.log("cabinid", cabinId);
    const {
        isPending,
        data: cabin,
        error,
      } = useQuery({
        queryKey: ["cabin", cabinId],
        queryFn:()=> getCabin(cabinId),
      });
    
      return {isPending, cabin, error};
}