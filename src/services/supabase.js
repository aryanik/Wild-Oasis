import { createClient } from '@supabase/supabase-js'
export const supabaseUrl = 'https://giqglurhtyslryriuiec.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcWdsdXJodHlzbHJ5cml1aWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxOTc0MDEsImV4cCI6MjA0Mzc3MzQwMX0.T34gKmLydQ-dvajBegHBr7cUFA7Q4pO709TvB2NBQOs";
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;