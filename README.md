# Balangoda Edible Oil Enterprises

A build-free HTML/CSS/JavaScript website for S&S Oil Distributors, branded with the supplied Balangoda logo. All five oils are integrated into the product dialogs and the enquiry builder.

## Preview

Open index.html in a modern browser, or serve this folder with `python3 -m http.server 8000` and visit http://localhost:8000.

## Vercel deployment

1. Extract this ZIP and import the contents of the `balangoda-oil` folder into a Git repository.
2. Import that repository into Vercel. Select Framework Preset **Other**.
3. Set the project root to the folder containing index.html and vercel.json. No build or install command is needed; output directory is `.`.
4. Deploy. No API keys, database, or environment variables are required.

## Contacts

- Mr. Nalinda, Managing Director: +94 76 062 8331; https://wa.me/94760628331
- Sumith Kulathunga, Founder: +94 77 235 8428; sumids@gmail.com

The enquiry builder validates selections, prepares a review, and opens a WhatsApp or email draft. Customers send the draft themselves. There is no server submission, payment processing, or order database.

## Oil guide sources (checked 12 November 2026)

- Harvard Nutrition Source, Coconut Oil: https://nutritionsource.hsph.harvard.edu/food-features/coconut-oil/
- Harvard Nutrition Source, Fats and Cholesterol: https://nutritionsource.hsph.harvard.edu/what-should-you-eat/fats-and-cholesterol/
- Canola Council of Canada, Canola Oil: https://www.canolacouncil.org/about-canola/oil/
- National Sunflower Association, High Oleic Sunflower Oil: https://www.sunflowernsa.com/uploads/144/nsa_sunflower-oil_delivers-superior-stability_whitepaper_en_6.26.2025.pdf

These describe general oil properties, not the business's batch specifications. Cold-pressed/refined grade availability, test certificates, load sizes and transport arrangements must be confirmed when quoting. No certification, purity test or guaranteed frying temperature is implied.

## Assets

`assets/balangoda-logo.png` is an AI-assisted transparent extraction of the supplied logo. `assets/canola-oil.webp` and `assets/editorial-oil.webp` are AI-generated illustrative marketing images. Other oil images are supplied assets. The original supplied logo is included as `assets/logo-original.png` for reference.

Generation briefs: golden canola oil in a clear glass bottle with fresh yellow canola flowers on warm neutral stone; sunlit golden oil pouring into a glass bottle beside coconuts and yellow blossoms; preserve logo lettering and olive/gold artwork while removing its white background.

## Validation

Browser reviewed the header and centered people section at a desktop viewport, opened the Canola dialog, added 250 kg Canola to an enquiry, and verified the review and generated contact links. No message was sent. Static validation checks local image/CSS/JS references, anchor targets and five-product catalog integration. JavaScript syntax and enquiry validation checks passed. Mobile CSS breakpoints are included; device-specific visual testing remains recommended before a public launch.

## Editorial update
The people section now uses an overlapping cream BEO arch card and a sunlit oil-pouring photograph. The desktop collection ribbon uses a single flex row; mobile uses a two-column list. Hero stat: 05 Edible oils.
