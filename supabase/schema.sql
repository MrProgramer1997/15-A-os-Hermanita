-- Esquema ya aplicado al proyecto Supabase "Proyecto Quince V".
-- Project ref: fretmqeznyofqakcsfyb

create table public.gift_cards (
  slug text primary key,
  recipient_name text not null,
  title text not null,
  message text not null,
  destination text not null default 'Brasil',
  valid_from date not null,
  valid_until date not null,
  active boolean not null default true,
  cover_image_url text,
  music_url text,
  photos jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint gift_cards_valid_dates check (valid_until >= valid_from),
  constraint gift_cards_photos_is_array check (jsonb_typeof(photos) = 'array')
);

alter table public.gift_cards enable row level security;

revoke all on table public.gift_cards from anon, authenticated;
grant select on table public.gift_cards to anon, authenticated;

create policy "public_read_active_gift_cards"
on public.gift_cards
for select
to anon, authenticated
using (active = true);
