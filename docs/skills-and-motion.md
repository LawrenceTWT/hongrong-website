# Toolkit and motion refinement

Branch: `feature/skills-vines-intro`, based on the merged PR #4 (`7de99fe`)

## Requested behavior

- Opening duration: exactly 2.5 seconds, including the curtain departure
- Opening type: another 25% smaller than PR #4, across the whole responsive range
- Hero and child-page opening vines: fully extended from creation, with no initial partial-growth flash
- Later plants: begin before the section reaches the viewport and remain reversible with scrolling. About and Work plants finish before the corresponding reading pause
- The phone-side vine also starts earlier, with a visible initial segment during the login step; phone screen selection still follows the same five step centers

## Toolkit layout

The supplied Fathom image informs the compact horizontal row: a small symbol, a short name and a quiet rounded surface. The homepage row contains six technologies from the existing projects. Each opens the matching group on About. Desktop uses six columns; tablet uses three and small screens use two, inside the shared central container

About retains the four factual groups and their project mappings. Each skill now has a local vector symbol. Translation keys wrap the label only, so changing language cannot delete the icon. Hover, keyboard focus and tap retain the existing project feedback. A learning record is labelled separately from project use

The vector symbols are presentation icons, not verification seals. They are local, require no icon package or external runtime and keep the portfolio's forest/ivory palette

## Credly evidence

Checked the user's anonymous public profile and JSON responses on 2026-10-18. The `/edit/skills` and `/edit/badges/credly` links are management routes; visitors receive public profile or individual badge links instead. No sign-in session or private account data was used

Public profile: https://www.credly.com/users/rong-hong.22d324e4

There are five public badges. Their original PNG artwork is stored locally without cropping, recoloring or generation. Together the files are 151,268 bytes; all are lazy-loaded, with fixed display dimensions

| Public badge title | Type shown | Verification |
| --- | --- | --- |
| Artificial Intelligence Fundamentals | Learning badge | https://www.credly.com/badges/5ac47f43-abd3-442d-926a-004653edf384 |
| Prompt Design in Vertex AI Skill Badge | Skill badge | https://www.credly.com/badges/c25825a6-16ea-414a-8c29-e5aef5e4e61c |
| AWS Academy Graduate - Cloud Architecting - Training Badge | Training badge | https://www.credly.com/badges/0b781c74-3e1a-41cf-b489-728633aedab5 |
| AWS Academy Graduate - Cloud Foundations - Training Badge | Training badge | https://www.credly.com/badges/fe8989c7-6240-4601-8675-5bbbf894d4a0 |
| Microsoft Certified: Azure Data Fundamentals | Certification | https://www.credly.com/badges/11e3c021-7963-4a0f-a573-9b9dd64c79fb |

The public skills response lists 26 learning skills, including AI, computer vision, prompt engineering, AWS, Azure, data analytics and databases. The website keeps the existing project-based toolkit concise and links to the complete public record. Badge-associated skill labels do not imply production experience with every listed service. AWS Academy training is not presented as an AWS Certified professional qualification

Original artwork sources:

- IBM: https://images.credly.com/images/82b908e1-fdcd-4785-9d32-97f11ccbcf08/image.png
- Google Cloud: https://images.credly.com/images/cef82b2e-970a-4318-8e59-c3e26b7f5c19/image.png
- AWS Architecting: https://images.credly.com/images/fcafd0c9-42da-4703-a191-0c397203dc1b/blob
- AWS Foundations: https://images.credly.com/images/e3541a0c-dd4a-4820-8052-5001006efc85/blob
- Microsoft: https://images.credly.com/images/70eb1e3f-d4de-4377-a062-b20fb29594ea/azure-data-fundamentals-600x600.png

## Verification scope

Production build checks local assets, Chinese font coverage, translations, shared layout and the existing motion regression suite. The latter samples the actual GSAP opening timeline, first-frame vine state, earlier lower-page growth, forward/reverse states, scene restoration and the five real phone screens

Browser visual QA is unavailable because the managed preview's required `control-browser` capability is not installed. Source/logic checks do not replace checking real desktop/mobile composition, focus behavior and scroll pacing in a browser
