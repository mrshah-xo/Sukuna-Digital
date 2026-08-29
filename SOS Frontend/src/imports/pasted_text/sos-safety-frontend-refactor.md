FIX AND REFINE THE EXISTING SOS & SAFETY FRONTEND.

IMPORTANT: Do not redesign the product from scratch. Do not change the existing SOS feature, user flows, functionality, or information architecture unless a layout issue makes a change necessary.

The attached DESIGN.md is the single authoritative design system for this project.

You MUST read and follow DESIGN.md exactly.

Do not invent, replace, approximate, or override any values, rules, typography, spacing, sizing, breakpoints, colors, radii, layout principles, or component rules defined in DESIGN.md.

The primary purpose of this task is to fix alignment, spacing, responsive behavior, and structural layout issues across the ENTIRE existing SOS & Safety frontend.

==================================================
GLOBAL DESIGN AUDIT
===================

Audit every existing:

* Page
* Section
* Screen
* Card
* Container
* Text element
* Button
* Icon
* Status component
* Modal
* List
* Navigation element
* Map placeholder
* Timeline
* Mobile layout
* Desktop layout

Do not fix only the currently visible screen.

Review the complete SOS & Safety frontend and apply corrections consistently across all pages and states.

Identify and fix:

* Misaligned text
* Misaligned boxes
* Uneven spacing
* Inconsistent padding
* Incorrect vertical alignment
* Incorrect horizontal alignment
* Elements that do not share the same alignment axis
* Inconsistent gaps between related elements
* Random or arbitrary positioning
* Overlapping elements
* Excessively large empty areas
* Crowded sections
* Unequal card sizing when equal sizing is expected
* Inconsistent button placement
* Inconsistent icon and text alignment
* Incorrect modal positioning
* Broken responsive layouts
* Text that overflows, clips, or wraps poorly
* Containers that are unnecessarily large
* Elements that are positioned manually instead of following a structured layout

==================================================
AUTO LAYOUT AND STRUCTURAL LAYOUT
=================================

Rebuild the layout structure where necessary using proper responsive layout behavior.

Do not rely on manually placed elements when Auto Layout or a structured responsive container is more appropriate.

For every section:

1. Identify the intended content hierarchy.
2. Group related elements together.
3. Create clear parent containers.
4. Apply consistent alignment.
5. Apply spacing only according to DESIGN.md.
6. Ensure elements resize naturally with their content.
7. Ensure layouts adapt correctly across screen sizes.

Use proper parent-child layout relationships.

Text, icons, buttons, and status elements should align naturally within their containers.

Do not use arbitrary X and Y positioning to force elements into place.

==================================================
TEXT AND TEXT CONTAINER RULES
=============================

Audit every text element and text box.

Fix:

* Text boxes that are wider than necessary
* Text boxes that create unnecessary empty space
* Text that is not aligned with nearby content
* Text that wraps unnecessarily
* Text that is vertically misaligned
* Headings that do not align with their content below
* Labels and values that do not share a consistent alignment
* Text containers that break the responsive layout

IMPORTANT:

If a text box or text container is only useful for one layout and causes problems on other screen sizes, remove the unnecessary text box or restructure the text so that the layout works naturally.

Do not preserve unnecessary text containers simply because they already exist.

However, do not remove meaningful content.

The goal is to remove unnecessary layout containers, not meaningful UI text.

All meaningful text must remain editable text.

Do not convert text into images.

==================================================
SPACING AND ALIGNMENT
=====================

Follow the spacing and layout rules defined in DESIGN.md exactly.

Do not use guessed spacing values.

Do not introduce arbitrary gaps.

For each page, establish a clear alignment system.

Related elements must share consistent:

* Left edges
* Right edges where appropriate
* Vertical rhythm
* Internal padding
* Section spacing
* Component gaps

Headings, descriptions, cards, buttons, and lists should follow a clear visual hierarchy.

Do not allow random differences in spacing between similar sections.

If two components serve the same structural purpose, they should use the same layout logic.

==================================================
DESKTOP AND MOBILE RESPONSIVENESS
=================================

Create and refine responsive versions of the existing SOS & Safety frontend.

The desktop version must look intentionally designed for desktop.

Do not simply stretch the mobile layout.

The mobile version must look intentionally designed for mobile.

Do not simply shrink the desktop layout.

Use the responsive rules and breakpoints defined in DESIGN.md exactly.

For each page and section, verify behavior across all relevant responsive ranges defined in DESIGN.md.

The same design system and component structure should adapt naturally across screen sizes.

Desktop layouts should use available space intelligently without creating excessive empty space.

Mobile layouts should remain focused, readable, and easy to interact with.

==================================================
DESKTOP LAYOUT RULES
====================

For desktop:

* Create a clear content hierarchy.
* Use structured content widths according to DESIGN.md.
* Prevent content from becoming excessively stretched.
* Align sections to a consistent content grid.
* Use multi-column layouts only when they improve readability.
* Keep important SOS information easy to scan.
* Ensure cards and panels align cleanly.
* Avoid large empty areas caused by mobile-sized components placed on a desktop canvas.
* Ensure navigation and page content work together naturally.

Do not force every mobile section into a desktop grid.

Some components may remain single-column if that is the better desktop experience.

==================================================
MOBILE LAYOUT RULES
===================

For mobile:

* Preserve the same information hierarchy.
* Use a clean single-column structure where appropriate.
* Ensure text remains readable.
* Prevent overflow and clipping.
* Maintain comfortable touch targets according to DESIGN.md.
* Prevent buttons from becoming too narrow or too crowded.
* Ensure modals and dialogs fit naturally within the screen.
* Ensure SOS actions remain immediately understandable and accessible.

Do not duplicate unnecessary UI between desktop and mobile.

Use responsive restructuring rather than creating two unrelated designs.

==================================================
MOBILE-ONLY AND DESKTOP-ONLY CONTENT
====================================

Audit every element to determine whether it genuinely belongs on all screen sizes.

If an element, text box, container, or layout treatment only makes sense for mobile and creates an unnecessary or broken desktop experience, remove or restructure that layout treatment for desktop.

If an element only makes sense for desktop and creates unnecessary complexity on mobile, adapt or remove the unnecessary layout treatment for mobile.

Do not leave empty placeholder boxes.

Do not leave invisible containers that continue affecting spacing.

Do not duplicate content simply to support different breakpoints.

The responsive design should use the simplest structure that works correctly.

==================================================
CARDS, BOXES, AND CONTAINERS
============================

Audit every card and container.

Remove unnecessary nested boxes.

Avoid a box inside a box unless the hierarchy genuinely requires it.

Fix:

* Unequal padding
* Misaligned card content
* Inconsistent card heights
* Excessively large cards
* Empty card space
* Incorrect content centering
* Inconsistent spacing between cards
* Containers that do not resize correctly

Follow the component, border, radius, surface, and spacing rules in DESIGN.md exactly.

Do not introduce new visual styles.

==================================================
COMPONENT CONSISTENCY
=====================

Review all reusable SOS components.

Ensure the same component behaves consistently across every page.

This includes:

* SOS actions
* Status components
* Location status
* Responder status
* Status badges
* History items
* Safety actions
* Confirmation dialogs
* Map placeholders
* Buttons
* Navigation elements

Do not create visually different versions of the same component without a clear functional reason.

Use component variants and responsive behavior instead of unnecessary duplication.

==================================================
SOS-SPECIFIC LAYOUT PRIORITIES
==============================

Apply these alignment and hierarchy fixes to every SOS-related screen, including:

* SOS & Safety Home
* SOS activation
* Hold interaction
* Cancellation state
* SOS Active
* Location sharing state
* Responder acknowledgement
* Assistance in Progress
* SOS Resolved
* Cancel confirmation
* SOS History
* SOS Event Details
* Safety Check
* Safety Check confirmation
* Location Sharing
* Location Privacy information

The primary SOS action must remain visually clear.

The SOS Active state must prioritize the most important information.

Status information must align consistently.

Timelines must have consistent spacing and alignment.

History lists must have consistent row structure.

Location information must not break the layout.

==================================================
PRESERVE THE DESIGN SYSTEM
==========================

The existing SOS frontend must become visually consistent with the attached DESIGN.md.

Before making changes, audit the existing design against DESIGN.md.

After making changes, verify every page again.

Do not use your own design values.

Do not guess values.

Do not introduce new:

* Colors
* Typography scales
* Spacing values
* Radius values
* Breakpoints
* Shadows
* Gradients
* Layout rules

Use only what is defined or permitted in DESIGN.md.

==================================================
FINAL QUALITY CHECK
===================

Before completing the work, review every SOS & Safety screen at all relevant responsive sizes defined in DESIGN.md.

Verify:

1. No text is misaligned.
2. No unnecessary text boxes remain.
3. No meaningful text has been removed.
4. No elements overlap.
5. No content is clipped.
6. No layout depends on arbitrary manual positioning.
7. Related elements follow consistent alignment.
8. Spacing follows DESIGN.md.
9. Desktop layouts look intentionally designed for desktop.
10. Mobile layouts look intentionally designed for mobile.
11. Responsive transitions work naturally.
12. Cards and containers are not unnecessarily nested.
13. Components remain consistent across pages.
14. Existing functionality and user flows are preserved.
15. The final design remains practical to implement in the existing application.

This is a refinement and layout-correction task.

Preserve the existing SOS & Safety product design and functionality.

Fix the structure.

Fix the alignment.

Fix the spacing.

Fix responsive behavior.

Remove unnecessary layout containers where needed.

Create a polished, consistent desktop and mobile experience while following DESIGN.md exactly.
