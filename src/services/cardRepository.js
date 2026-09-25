import { createClient } from "@supabase/supabase-js";
import { defaultCard } from "../data/defaultCard.js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ""
).trim();

function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseKey);
}

export async function getGiftCard(slug) {
  if (!hasSupabaseConfig()) {
    return { data: defaultCard, source: "fallback" };
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  const { data, error } = await supabase
    .from("gift_cards")
    .select(
      "slug,recipient_name,title,message,destination,valid_from,valid_until,active,photos"
    )
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.warn("No fue posible consultar Supabase. Se usara el respaldo local.", error.message);
    return { data: defaultCard, source: "fallback" };
  }

  return {
    data: data ? { ...defaultCard, ...data } : defaultCard,
    source: data ? "supabase" : "fallback"
  };
}
