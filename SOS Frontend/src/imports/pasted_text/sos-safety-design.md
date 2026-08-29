# SUKUNA DIGITAL — SOS & SAFETY FRONTEND DESIGN

Design a complete, premium, minimal, and production-ready frontend experience for a new feature called:

# SOS SAFETY

This is part of the existing Sukuna School Digital App.

The existing application is a private, school-focused digital ecosystem for students, teachers, administrators, and other authorized school users.

This feature must integrate naturally into the existing Sukuna design system.

Do NOT redesign the entire Sukuna application.

Design only the SOS and Safety feature and its related screens.

---

# 1. CORE PURPOSE

SOS Safety allows an authorized student to quickly request help during an emergency or safety situation.

The experience must prioritize:

1. Speed
2. Clarity
3. Accessibility
4. Privacy
5. Accurate status information
6. Minimal interaction during stressful situations

The design must NOT feel like a social media feature.

Do NOT add:

* Public SOS posts
* Public emergency feeds
* Student popularity features
* Unnecessary chat systems
* Permanent 24/7 location tracking
* Complex emergency forms before activating SOS

---

# 2. DESIGN PHILOSOPHY

The interface should feel:

* Calm
* Serious
* Trustworthy
* Premium
* Minimal
* Extremely easy to understand
* Accessible
* Production-ready

Use:

* Sukuna Blue for the normal interface
* A clear emergency/destructive color only for SOS activation and active emergency states
* White/light neutral backgrounds
* Deep navy or dark text
* Strong contrast
* Large touch targets
* Clear status indicators

Do NOT use excessive gradients.

Do NOT use excessive glass effects.

Do NOT make the emergency screen visually decorative.

Clarity is more important than aesthetics.

---

# 3. MAIN SOS MENU

Create a main screen titled:

SOS & SAFETY

The page should immediately communicate the user's safety status.

Structure:

HEADER

SOS & SAFETY

Short supporting text:

"Quick access to safety assistance when you need it."

PRIMARY SOS CARD

A prominent emergency action area.

Display:

SOS
Request Immediate Help

Include a large emergency button.

The button must visually communicate that activating it is a serious action.

Use a hold-to-activate interaction rather than a simple accidental tap.

Example interaction:

HOLD FOR SOS

The button should support a visible hold/progress state.

---

# 4. SAFETY STATUS

Below the SOS action, show a compact status area.

Example:

Safety Status
No active SOS

Location
Not currently shared

These should be informational and easy to scan.

Do not create unnecessary cards.

---

# 5. QUICK SAFETY ACTIONS

Below the primary SOS action, provide a small set of secondary actions.

Possible actions:

* Share My Location
* Safety Check
* SOS History

These actions must be visually secondary to SOS.

Do not make every action equally prominent.

SOS must remain the primary action.

---

# 6. SOS ACTIVATION FLOW

Create the following interaction flow.

SCREEN 1:

SOS & SAFETY

User sees:

HOLD FOR SOS

When holding the button:

Show circular or linear progress.

Example:

Hold to activate
████████░░

When completed:

Transition to a confirmation state.

---

# 7. CONFIRMATION / CANCEL WINDOW

After the hold interaction completes, show a short cancellation window.

Example:

SOS will activate shortly

Sending your emergency alert...

Cancel

The interface should make cancellation easy but should not hide the emergency status.

Use a visible countdown or progress indicator.

Example:

3
2
1

If cancelled:

Return to the main SOS screen.

If not cancelled:

Activate SOS.

---

# 8. SOS ACTIVE SCREEN

Create a dedicated emergency state.

Title:

SOS ACTIVE

Supporting text:

"Your safety alert has been sent to authorized responders."

Display clear status information:

ALERT
Sent

LOCATION
Sharing during active SOS

STATUS
Waiting for acknowledgement

Use a strong emergency visual hierarchy.

The most important information should be visible without scrolling.

---

# 9. LIVE LOCATION STATUS

Create a simple location section.

Do NOT design this as permanent location tracking.

Location sharing should be clearly described as temporary and related to the active SOS event.

Example:

YOUR LOCATION

Location sharing is active for this SOS.

[ MAP AREA ]

Below the map:

Last updated
Just now

Location status
Active

The map should be visually simple.

Do not overload the screen with map controls.

Use a placeholder map area that can later be implemented using the application's actual map provider.

---

# 10. RESPONDER STATUS

Show the progress of the SOS event.

Example timeline:

SOS Activated
✓ Alert sent

Responder Notified
✓ Authorized responder notified

Acknowledged
Waiting

Assistance
Pending

Resolved
Not started

The interface should support state changes.

Possible statuses:

* Active
* Alert Sent
* Acknowledged
* Assistance in Progress
* Resolved

Use reusable status components.

---

# 11. ACTIVE SOS ACTIONS

During an active SOS, provide only essential actions.

Examples:

* Update Location
* Cancel SOS

Cancel SOS should require confirmation.

Do NOT allow a dangerous action to occur accidentally.

Use a confirmation modal.

Example:

Cancel SOS?

This will notify responders that the emergency alert has been cancelled.

[ Keep SOS Active ]

[ Cancel SOS ]

The visually safer option should be more prominent.

---

# 12. SOS RESOLVED

Create a completion screen.

Title:

SOS RESOLVED

Supporting text:

"Your SOS event has been marked as resolved."

Display:

Started
10:32 AM

Resolved
10:48 AM

Duration
16 minutes

Location sharing
Stopped

Primary action:

Back to Safety

The screen should feel calm and clear.

---

# 13. SOS HISTORY

Create an SOS History screen.

Display previous SOS events privately.

Example item:

SOS Event

24 August 2026
10:32 AM

Status
Resolved

Do not display sensitive location details directly in the list.

Each history item may open a detailed event view depending on user permissions.

Support states:

* Active
* Resolved
* Cancelled

Use clean, compact list items.

---

# 14. SAFETY CHECK

Create a secondary Safety Check experience.

This is NOT the same as SOS.

Purpose:

Allow a student to confirm that they are safe.

Example:

SAFETY CHECK

"Let authorized contacts know that you are safe."

Primary action:

I'M SAFE

After activation:

Safety Check Sent

"Your safety status has been updated."

This must remain clearly separate from the emergency SOS action.

---

# 15. LOCATION SHARING

Create a separate location-sharing interface.

Title:

LOCATION SHARING

The user must clearly understand:

* Whether location sharing is active
* Why it is active
* Who is authorized to receive it
* When it will stop

Example:

Location Status
Not Sharing

Description:

"Your location is only shared when you activate SOS or explicitly enable an approved safety feature."

If location sharing is manually enabled:

Show:

Location Sharing Active

[ Stop Sharing ]

Do not imply that student location is always being tracked.

---

# 16. PRIVACY EXPLANATION

Include a compact privacy information section.

Example:

YOUR PRIVACY

"Your location is not continuously tracked."

"Location sharing is activated only when required by an SOS event or when you explicitly enable an approved safety feature."

Include:

Learn more

This can connect to the existing Sukuna Privacy Policy.

---

# 17. MOBILE DESIGN

Prioritize mobile.

Design for common mobile widths first.

Requirements:

* Large SOS button
* Minimum accidental interaction risk
* Easy one-handed use
* Clear touch targets
* No horizontal page overflow
* No tiny text
* Important emergency status visible without scrolling
* Responsive map area
* Bottom navigation must not cover emergency controls

The SOS button should remain easy to access.

---

# 18. DESKTOP DESIGN

Also create a responsive desktop version.

Desktop should:

* Reuse the existing Sukuna navigation system
* Keep SOS content centered
* Avoid oversized empty areas
* Maintain the same information hierarchy as mobile

Do not create a completely different product experience for desktop.

Use responsive components.

---

# 19. COMPONENT SYSTEM

Create reusable components.

Required components:

SOSButton

* Default
* Holding
* Activating
* Active
* Disabled

SafetyStatus

* Safe
* SOS Active
* Resolved

LocationStatus

* Not Sharing
* Sharing
* Updating
* Unavailable

ResponderStatus

* Notified
* Waiting
* Acknowledged
* Assistance In Progress
* Resolved

StatusBadge

* Active
* Pending
* Acknowledged
* Resolved
* Cancelled

SOSHistoryItem

SafetyActionCard

ConfirmationModal

MapPlaceholder

The components should be reusable and easy to translate into React components.

---

# 20. IMPLEMENTATION FRIENDLINESS

IMPORTANT:

This design will be implemented in an existing application using:

* Next.js
* React
* TypeScript
* Tailwind CSS

Therefore:

Do NOT create impossible visual effects.

Do NOT rely on complex custom animations.

Do NOT create hundreds of unique components.

Use reusable design patterns.

Prefer:

* Cards
* Buttons
* Status badges
* Bottom sheets
* Modals
* Lists
* Progress indicators
* Simple map containers

Keep component structure consistent.

Use Auto Layout.

Use reusable components and variants.

Use clear layer names.

Suggested layer/component naming:

SOSButton
SOSStatusCard
SafetyAction
LocationStatus
ResponderTimeline
HistoryItem
ConfirmationModal

---

# 21. ACCESSIBILITY

Accessibility is mandatory.

Ensure:

* Strong color contrast
* SOS state is not communicated by color alone
* Clear text labels
* Large touch targets
* Readable typography
* Clear focus states
* Icons have labels or accessible context
* Important actions are understandable without relying on animation

Do not use tiny text.

Do not use extremely thin fonts.

---

# 22. LANGUAGE SUPPORT

The Sukuna application needs multilingual support.

The frontend must support:

* English
* Nepali
* Hindi

Design every layout so text can expand without breaking.

Do NOT hard-code English text into components.

Use text placeholders or realistic sample translations.

Make sure:

* Buttons can accommodate longer translations
* Cards expand correctly
* Navigation labels do not overlap
* Status labels remain readable
* Nepali Devanagari script renders correctly
* Hindi Devanagari script renders correctly

Do not convert translated text into images.

All UI text must remain editable text.

---

# 23. REQUIRED SCREENS

Create the following screens:

1. SOS & Safety — default
2. Hold to Activate SOS
3. SOS cancellation window
4. SOS Active
5. SOS Active with map/location
6. Responder acknowledgement
7. Assistance in Progress
8. SOS Resolved
9. Cancel SOS confirmation
10. SOS History
11. SOS Event Details
12. Safety Check
13. Safety Check confirmation
14. Location Sharing — inactive
15. Location Sharing — active
16. Location Privacy information

Create both:

* Mobile versions
* Responsive desktop versions where appropriate

---

# 24. FINAL PRODUCT PRINCIPLES

The SOS feature should answer these questions immediately:

1. How do I request help?
2. Has my SOS been sent?
3. Is my location currently being shared?
4. Has an authorized responder acknowledged the alert?
5. What is happening now?
6. How do I safely end the SOS?
7. What information remains private?

FINAL PRIORITY ORDER:

SAFETY

> CLARITY
> ACCESSIBILITY
> SPEED
> PRIVACY
> RESPONSIVENESS
> VISUAL POLISH

Create a complete, cohesive, production-ready SOS & Safety frontend that integrates naturally with the existing Sukuna School Digital App.
