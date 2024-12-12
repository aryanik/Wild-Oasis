import supabase from "./supabase";

export async function createNewGuest(guestDetail) {
    const { data, error } = await supabase
  .from('guests')
  .insert([
    guestDetail
  ])
  .select();

  if (error) {
    console.error(error);
    throw new Error("New Guest could not be created");
  }
return data;
}