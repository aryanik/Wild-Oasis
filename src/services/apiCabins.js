import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data: cabins, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return cabins;
}


export async function getCabin(id) {
  const { data: cabin, error } = await supabase
  .from("cabins")
  .select("id, regularPrice, discount") // Fetch required fields
  .eq("id", id) // Match the cabin ID
  .single(); 

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return cabin;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // https://giqglurhtyslryriuiec.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  // 1. Create/ Edit Cabin
  let query = supabase.from("cabins");

  // A} Create Cabin
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  if (id)
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq("id", id)
      .select();

  const { data, error } = await query.select().single();
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be Created");
  }

  if (hasImagePath) return data;

  // 2. Upload Image

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the Cabin IF there was an error uploading  the image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    throw new Error(
      "Cabin image could not be uploaded and cabin was not created "
    );
  }

  return data;
}

export async function deleteCabins(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function filterCabins({ startDate, endDate, numGuests }) {
  // Step 1: Fetch cabin IDs that have conflicting bookings
  const { data: conflictingBookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("cabinId") // Ensure this column matches your table structure
    .or(
      `and(startDate.lte.${endDate}, endDate.gte.${startDate})`
    );

  if (bookingsError) {
    console.error("Error fetching conflicting bookings:", bookingsError);
    throw new Error("Could not fetch conflicting bookings");
  }

  // Extract conflicting cabin IDs
  const conflictingCabinIds = conflictingBookings.map((booking) => booking.cabinId);

  // Format conflictingCabinIds into the required PostgREST format
  const formattedIds = `(${conflictingCabinIds.join(",")})`;

  // Step 2: Fetch available cabins that are not in the conflicting IDs
  const { data: availableCabins, error: cabinsError } = await supabase
    .from("cabins")
    .select("*")
    .not("id", "in", formattedIds)
    .gte('maxCapacity', numGuests)

  if (cabinsError) {
    console.error("Error fetching cabins:", cabinsError);
    throw new Error("Could not filter cabins");
  }

  return availableCabins;
}


