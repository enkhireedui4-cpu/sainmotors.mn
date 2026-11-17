# Contact feedback reference

Implement the user's supplied Orbis contact screenshot using the retained measurements in `docs/design/orbis-pages/DESIGN.md` §6. White section, left uppercase invitation and paragraphs; right two-column form with client/employee/dealer identity radio pills, required name/phone, real showroom selection, ruled comments area, consent and black pill action. At 1920px use about 150px side gutters, 410px intro, 120px intro/form gap and 89px form-column gap. Stack fields on phones, retain 44px touch targets and visible focus.

Use Sain contact information and real showroom records, with MN/EN copy and the existing PageBand/footer. Existing contact routing has no submission backend; prepare an email to the verified general email and explicitly tell visitors to finish sending in their email app. Do not claim delivery, persist personal data, create a fake CAPTCHA or use Orbis' receiver.

Preserve brand enquiry query/hash journeys using the existing ContactJourney when intent/brand parameters are present. General phone, email and showroom map remain accessible. Replace obsolete photo/card/disclosure visual tests with form behavior coverage; retain brand journeys. Verify validation, consent, generated email, keyboard controls, no overflow, lint, production export and browser checks.
