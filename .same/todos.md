# MC SUA Project Todos

## Completed Tasks ✅

- [x] Removed ALL carousels from Cum Funcționează page
- [x] Each section now has exactly 1 static image
- [x] Using ONLY new numbered images from /public/images/
- [x] Deleted EditableImageCarousel component (no longer needed)
- [x] Images are directly in JSX for Visual Edit support
- [x] SEO technical optimizations applied
- [x] Car name changes (Porsche Cayenne → Porsche Macan, BMW X5 → BMW X7)
- [x] Added Google Reviews Carousel component
- [x] Carousel added to Homepage (after Hero section)
- [x] Carousel added to Contact page (after contact details)
- [x] Added APIBARA_API_KEY environment variable to .env.local
- [x] Created API route: src/app/api/vehicles/route.ts
- [x] Created API route: src/app/api/vehicles/[slug]/route.ts
- [x] API routes use process.env.APIBARA_API_KEY instead of hardcoded key

## Google Reviews Carousel ✅

### Features implemented:
- 6 client reviews with real content
- Google Reviews-style dark theme
- Avatars (image or initial letter with colored background)
- 5-star ratings with amber stars
- "NOU" badge on each review
- Mini photo gallery for reviews with photos (Alexandru Calin)
- Navigation arrows (left/right)
- Responsive design (1 card mobile, 2 cards tablet, 3 cards desktop)
- Dot indicators on mobile
- "Vezi toate recenziile pe Google" button linking to Google Reviews

### Reviews included:
1. FocusCayo (with avatar image)
2. Constantin-Alexandru Pantea (with avatar image)
3. Emanuel-Gabriel Serban (initial avatar)
4. Laurentiu Dobrila (initial avatar)
5. Alexandru Calin (initial avatar + 3 photos gallery)
6. Bliss Motors (initial avatar)

### Files modified:
- `/mcsua/src/components/google-reviews-carousel.tsx` (new component)
- `/mcsua/src/app/page.tsx` (added import and carousel after Hero)
- `/mcsua/src/app/contact/page.tsx` (added import and carousel after contact details)

## API Routes ✅

### Files created:
- `/mcsua/.env.local` - Environment variable with APIBARA_API_KEY
- `/mcsua/src/app/api/vehicles/route.ts` - API endpoint for fetching vehicles list
- `/mcsua/src/app/api/vehicles/[slug]/route.ts` - API endpoint for fetching single vehicle

### Implementation details:
- Both routes use `process.env.APIBARA_API_KEY ?? ""` for API key
- Error handling for missing API key
- Proper headers with X-API-Key authentication
- Support for query parameters (make, model, year_from, year_to, price_min, price_max, auction_type)

## Pending

- [ ] User verification of carousel appearance
- [ ] Deploy after user confirmation

## Notes

- Hydration warnings in dev mode are normal for SSR + client components
- Carousel structure allows easy addition of new reviews
- No external embed or iframe used
- Reviews are hardcoded for optimal performance
