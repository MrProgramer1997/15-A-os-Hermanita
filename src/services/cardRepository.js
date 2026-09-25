import { createClient } from "@supabase/supabase-js";
import { defaultCard } from "../data/defaultCard.js";
import { supabaseConfig } from "../config/supabase.js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || supabaseConfig.url || "").trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  supabaseConfig.publishableKey ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ""
).trim();

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  : null;

export async function getGiftCard(slug) {
  if (!supabase) {
    return { data: defaultCard, source: "fallback" };
  }

  const { data, error } = await supabase
    .from("gift_cards")
    .select(
      "slug,recipient_name,title,message,destination,valid_from,valid_until,active,cover_image_url,music_url,photos"
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
