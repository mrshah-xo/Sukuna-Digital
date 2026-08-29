IMPROVE AND REFINE THE EXISTING SOS & SAFETY FRONTEND.

IMPORTANT: Do not redesign the entire Sukuna application and do not replace the existing feature structure unnecessarily.

I am attaching DESIGN.md, which is the authoritative design system for the Sukuna Digital application.

You MUST follow DESIGN.md exactly.

The SOS & Safety frontend you previously generated must now be refined so that it visually and structurally integrates with the existing Sukuna application, which will later be implemented using:

- Next.js
- React
- TypeScript
- Tailwind CSS

This design must be practical to implement.

==================================================
1. DESIGN SYSTEM — STRICTLY FOLLOW DESIGN.md
==================================================

Use these exact primary design values.

COLORS

Primary Action Blue:
#0066cc

Primary Focus Blue:
#0071e3

Primary on Dark:
#2997ff

Main Ink:
#1d1d1f

Canvas:
#ffffff

Canvas Parchment:
#f5f5f7

Surface Pearl:
#fafafc

Dark Surface 1:
#272729

Dark Surface 2:
#2a2a2c

Dark Surface 3:
#252527

Pure Black:
#000000

Body text on dark:
#ffffff

Muted dark text:
#cccccc

Muted light text:
#7a7a7a

Hairline border:
#e0e0e0

Soft divider:
#f0f0f0

Do not introduce additional random brand colors.

#0066cc is the primary interactive color across the Sukuna application.

Do not use gradients.

Do not use colorful dashboard cards.

Do not use excessive borders.

Do not use shadows on cards, buttons, text, modals, or navigation.

The only permitted traditional drop shadow in the design system is:

rgba(0, 0, 0, 0.22) 3px 5px 30px 0

However, this shadow is reserved for photographic or product imagery.

DO NOT use this shadow on SOS interface components.

==================================================
2. TYPOGRAPHY — USE EXACT VALUES
==================================================

Primary display font:

SF Pro Display, system-ui, -apple-system, sans-serif

Primary body/UI font:

SF Pro Text, system-ui, -apple-system, sans-serif

Use these typography values.

HERO DISPLAY:
56px
weight 600
line-height 1.07
letter-spacing -0.28px

DISPLAY LARGE:
40px
weight 600
line-height 1.10
letter-spacing 0

DISPLAY MEDIUM:
34px
weight 600
line-height 1.47
letter-spacing -0.374px

LEAD:
28px
weight 400
line-height 1.14
letter-spacing 0.196px

TAGLINE:
21px
weight 600
line-height 1.19
letter-spacing 0.231px

BODY:
17px
weight 400
line-height 1.47
letter-spacing -0.374px

BODY STRONG:
17px
weight 600
line-height 1.24
letter-spacing -0.374px

CAPTION:
14px
weight 400
line-height 1.43
letter-spacing -0.224px

CAPTION STRONG:
14px
weight 600
line-height 1.29
letter-spacing -0.224px

BUTTON UTILITY:
14px
weight 400
line-height 1.29
letter-spacing -0.224px

FINE PRINT:
12px
weight 400
line-height 1.0
letter-spacing -0.12px

NAV LINK:
12px
weight 400
line-height 1.0
letter-spacing -0.12px

Do not use font weight 500.

The typography weight system should primarily use:

300
400
600
700

Headlines should generally use 600.

==================================================
3. BORDER RADIUS — USE EXACT VALUES
==================================================

None:
0px

Small:
8px

Medium:
11px

Large:
18px

Pill:
9999px

Use pill radius for primary action buttons.

Use 18px radius for utility cards.

Use 8px radius for compact utility elements.

Do not invent arbitrary border-radius values.

==================================================
4. SPACING — USE EXACT VALUES
==================================================

4px
8px
12px
17px
24px
32px
48px
80px

Use these values as the primary spacing system.

Utility card padding:
24px

Standard section spacing:
80px on large layouts.

Responsive smaller layouts may reduce vertical spacing to 48px.

Maintain generous whitespace.

The interface should never feel crowded.

==================================================
5. REFINE THE SOS DESIGN
==================================================

Keep the existing SOS feature and its functionality.

Refine these screens:

1. SOS & Safety Home
2. Hold to Activate SOS
3. SOS Activation / Cancellation Window
4. SOS Active
5. SOS Active with Location Status
6. Responder Acknowledged
7. Assistance in Progress
8. SOS Resolved
9. Cancel SOS Confirmation
10. SOS History
11. SOS Event Details
12. Safety Check
13. Safety Check Confirmation
14. Location Sharing — Inactive
15. Location Sharing — Active
16. Location Privacy Information

Do not create unnecessary screens.

Do not add features outside this flow.

==================================================
6. SOS HOME SCREEN — IMPROVE THE HIERARCHY
==================================================

The SOS & Safety screen must immediately communicate:

- Current safety status
- Whether an SOS is active
- Whether location sharing is active
- The primary emergency action

The primary SOS action must be the clearest action.

However, do not turn the entire screen into a large red interface.

The normal interface must remain within the Sukuna design system.

Use the normal Sukuna visual language:

White:
#ffffff

Parchment:
#f5f5f7

Ink:
#1d1d1f

Action Blue:
#0066cc

The SOS action itself may use a distinct destructive/emergency treatment only where absolutely necessary.

Do not create a second general brand color.

The emergency color must be limited to:

- SOS activation control
- Active emergency state
- Critical warning state

Everything else should use the Sukuna design system.

Make the SOS action large, obvious, and accessible.

Use a hold-to-activate interaction.

The interaction must be easy to translate into React and CSS.

Use a progress ring or simple progress indicator.

Do not create complex animation that would be difficult to implement.

==================================================
7. BUTTON SYSTEM
==================================================

Standard primary button:

Background:
#0066cc

Text:
#ffffff

Radius:
9999px

Padding:
11px vertical
22px horizontal

Typography:
17px
400 weight

Pressed state:

scale(0.95)

Focus state:

2px outline using #0071e3

Secondary pill button:

Transparent or #ffffff background

Text:
#0066cc

Radius:
9999px

Padding:
11px vertical
22px horizontal

Use clear, reusable button variants.

Minimum touch target:

44px × 44px

==================================================
8. CARDS AND CONTAINERS
==================================================

Use utility-card styling only where grouping is genuinely useful.

Utility card:

Background:
#ffffff

Border:
1px solid #e0e0e0

Radius:
18px

Padding:
24px

No shadow.

Avoid creating a dashboard filled with floating cards.

The overall design should remain calm, spacious, and editorial.

Use surface changes instead of excessive borders.

Alternate:

#ffffff

and:

#f5f5f7

when section separation is required.

==================================================
9. SOS ACTIVE STATE
==================================================

Create a highly clear active emergency interface.

Required information:

SOS ACTIVE

Alert status

Location sharing status

Last location update

Responder status

Current event progress

The most important information must be visible without excessive scrolling.

Use a structured status timeline.

Required statuses:

SOS Activated
Alert Sent
Responder Notified
Acknowledged
Assistance in Progress
Resolved

The timeline must be reusable as a component.

Do not use complicated illustrations.

Use simple icons and clear typography.

==================================================
10. LOCATION SHARING DESIGN
==================================================

Location sharing must be clearly separate from permanent tracking.

The interface should clearly explain:

Location is not continuously tracked.

Location sharing becomes active only when:

- An SOS event is active
OR
- The user explicitly enables an approved safety-sharing feature.

Required states:

Not Sharing

Sharing Active

Updating Location

Location Temporarily Unavailable

Show:

Last Updated

Location Status

Authorized Recipient Information

Use a simple map placeholder that can later be replaced by the real application map provider.

Do not over-design map controls.

==================================================
11. SAFETY CHECK
==================================================

Safety Check is separate from SOS.

The user can confirm:

I'M SAFE

After confirmation, show:

Safety Check Sent

Use the standard Sukuna Action Blue:

#0066cc

Do not style Safety Check as an emergency action.

==================================================
12. SOS HISTORY
==================================================

Design a clean, private history list.

Each item should contain:

SOS Event

Date

Time

Status

Possible statuses:

Active
Resolved
Cancelled

Do not expose precise sensitive location information in the history list.

Use reusable HistoryItem components.

Keep the list visually simple.

==================================================
13. MODALS AND CONFIRMATIONS
==================================================

Use simple, implementation-friendly confirmation dialogs.

No excessive blur.

No excessive glass effects.

Use:

Background:
#ffffff

Border:
1px solid #e0e0e0

Radius:
18px

Padding:
24px

No shadow.

Use a subtle backdrop only when necessary.

For Cancel SOS:

Title:

Cancel SOS?

Description:

This will notify authorized responders that the emergency alert has been cancelled.

Primary safe action:

Keep SOS Active

Secondary destructive action:

Cancel SOS

Make accidental cancellation difficult.

==================================================
14. NAVIGATION
==================================================

Integrate the SOS frontend with the existing Sukuna application navigation.

Do not invent a completely separate navigation system.

Desktop and mobile layouts should reuse the application's existing navigation patterns where possible.

The SOS page should feel like a native section of Sukuna Digital.

==================================================
15. RESPONSIVE DESIGN — EXACT BREAKPOINTS
==================================================

Small phone:
≤ 419px

Phone:
420–640px

Large phone:
641–735px

Tablet portrait:
736–833px

Tablet landscape:
834–1023px

Small desktop:
1024–1068px

Desktop:
1069–1440px

Wide desktop:
≥ 1441px

Responsive behavior:

≤ 640px:
Single-column layout.

At 834px and below:
Desktop navigation collapses to mobile navigation.

At 834px:
Multi-column sections become single or simplified stacked layouts when appropriate.

At 1068px:
Desktop layout begins transitioning to a more compact layout.

At 1440px:
Content should stop expanding beyond the main maximum width.

Do not create separate unrelated desktop and mobile designs.

Use the same component system responsively.

==================================================
16. MULTILINGUAL DESIGN
==================================================

The Sukuna application must support:

English

नेपाली

हिन्दी

All text must remain editable text.

Do not convert text into images.

Design layouts so that translated text can expand.

Avoid fixed-width buttons where translated text could overflow.

Ensure that Devanagari text renders correctly.

The frontend implementation should later support translation keys.

Examples:

sos.title

sos.activate

sos.holdToActivate

sos.active

sos.locationSharing

sos.lastUpdated

sos.waitingForAcknowledgement

sos.cancel

sos.resolved

safetyCheck.imSafe

Do not hard-code a design that only works for English.

==================================================
17. FIGMA STRUCTURE
==================================================

Use Auto Layout wherever appropriate.

Create reusable components.

Create variants for state changes instead of duplicating components.

Use clear names.

Required component structure:

SOSButton
Variants:
Default
Holding
Activating
Active
Disabled

SafetyStatus
Variants:
Safe
SOS Active
Resolved

LocationStatus
Variants:
Not Sharing
Sharing
Updating
Unavailable

ResponderStatus
Variants:
Notified
Waiting
Acknowledged
Assistance in Progress
Resolved

StatusBadge
Variants:
Active
Pending
Acknowledged
Resolved
Cancelled

SOSHistoryItem

SafetyAction

ConfirmationModal

MapPlaceholder

Use semantic and implementation-friendly names.

Do not create hundreds of unnecessary layers or components.

==================================================
18. IMPLEMENTATION CONSTRAINTS
==================================================

This design will be integrated into an existing Next.js application.

Therefore:

Use practical layouts.

Use standard CSS-compatible effects.

Use reusable components.

Use clear states.

Avoid impossible-to-code interactions.

Avoid highly complex animations.

Avoid decorative effects that require custom rendering.

Do not require canvas rendering.

Do not rely on Figma-only interactions for core functionality.

The frontend should be realistically reproducible using:

Next.js
React
TypeScript
Tailwind CSS

==================================================
19. FINAL VISUAL DIRECTION
==================================================

The final SOS & Safety experience should feel:

Premium

Minimal

Calm

Serious

Trustworthy

Apple-inspired

Privacy-conscious

Accessible

Production-ready

The design should use generous whitespace.

UI chrome should recede.

Information hierarchy should be immediately understandable.

Do not create a generic SaaS dashboard.

Do not use colorful cards.

Do not use gradients.

Do not use excessive rounded containers.

Do not use shadows for UI hierarchy.

Use typography, whitespace, surface changes, and the single Action Blue #0066cc to create hierarchy.

The SOS feature must feel like a natural extension of the existing Sukuna Digital application.

IMPORTANT FINAL INSTRUCTION:

Preserve and improve the existing SOS & Safety design that has already been generated.

Do not start from scratch.

Do not redesign unrelated areas of the Sukuna application.

Audit every existing SOS screen against the attached DESIGN.md and refine any element that does not follow the exact design system values and principles.

Create a cohesive, responsive, reusable, and implementation-ready frontend design.