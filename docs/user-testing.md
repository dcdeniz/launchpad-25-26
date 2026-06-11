# Ladywood Transit: User Testing

**Project:** Ladywood Transit (Launchpad 25/26)
**Build tested:** feat/scaffold branch, June 2026
**Method:** Moderated, task-based testing. Each participant was given a short scenario and a set of tasks to complete on their own device while thinking aloud. No help was given unless someone was fully stuck for 60 seconds or more. Sessions ran between 12 and 20 minutes each.
**Participants:** 10 (2 family, 5 classmates, 2 professors, 1 friend from back home)

> This is mock data generated for the user testing section of the project report. The people, quotes, and ratings are fictional but written to reflect realistic reactions to the current build.

---

## Tasks

| # | Task | Scenario given |
|---|------|----------------|
| T1 | Plan a journey | "You're at one Ladywood stop and want to get to another. Use the planner on the home page to work out how to get there after 9am." |
| T2 | Find a route timetable | "You catch a specific service regularly. Find it under Routes and check when it stops near you." |
| T3 | Create an account | "Sign up so you can buy tickets." |
| T4 | Buy a ticket | "Buy a ticket for one of the routes, then check it appears under My Tickets." |
| T5 | Navigate on mobile | "Get back to the home page and then to your account using the menu." |
| T6 | Admin tasks (professors only) | "As a TfWM admin, change a fare and edit a timetable entry." |

Rating scale: 1 (could not use it) to 5 (effortless).

---

## Sessions

| Participant | Background | Device | What they said and did | Issues found | Rating |
|-------------|------------|--------|------------------------|--------------|:------:|
| **Dad, 54** | Occasional public transport user, drives almost everywhere | Android phone, reading glasses | Got through the journey planner but expected a map. Waited on the AI result and assumed it had frozen: "Is it broken? Oh, there it is." Found the coloured route numbers helpful: "that's like the real bus, the number on the front." Felt uneasy buying a ticket: "It didn't ask me which bus or what it costs until after. I'd want the price up front like the meter." | No loading indicator on the planner; price not shown before purchase; wants a map | 3/5 "I'd use it if it showed me the price and a map." |
| **Mum, 51** | Daily bus user, gets the bus into the city most days | iPhone | Most enthusiastic tester. Planned a journey confidently but wanted departure times she could trust: "It tells me a nice paragraph but I want to know the 9:14 is real, not made up." Signed up and bought a ticket with no help: "That was quicker than the council site, that's not hard mind." | Wants concrete next-departure times rather than prose; wants to save favourite routes | 4/5 |
| **CS student** | High tech comfort, stress-tested the app like a marker would | Pixel, later laptop | Opened dev tools. Found a late-night journey bug: "Your time window wraps past midnight wrong, ask for 23:50 and it's looking for 25:50, nothing comes back." Noticed ticket vehicle is always blank. Liked the RLS role split and that admin links only appear for admins. | Midnight journey window bug; ticket vehicle always blank; minor accessibility gaps | 4/5 "Solid scaffold. Fix the time-wrap and it demos clean." |
| **Pharmacy student** | Medium tech comfort, time-poor commuter, tested on the move between placements | iPhone | Wanted everything faster: "I'm running for a bus, I haven't got four seconds to read a paragraph. Just show me the next two services." Timetable felt long to scroll. Wanted a clearer confirmation after buying: "did it definitely work? It just went quiet." | Planner too slow and too wordy for a rushed user; no clear purchase confirmation | 3/5 |
| **Law student** | Medium tech comfort, reads everything before clicking | Laptop, then phone | Hesitated to sign up: "What are you doing with my email? There's no privacy notice or terms anywhere." Asked about refunds and ticket validity. Noticed there is no password reset path: "if I lose access I'm locked out." | No privacy policy or terms at signup; no ticket validity terms; no password reset | 3/5 "Functionally fine, legally bare." |
| **English student** | Medium tech comfort, focused on words and tone | iPhone | Loved the look: "that big type is genuinely lovely, feels like a proper brand, not a student thing." Found the AI answers a bit robotic and samey across journeys. Spotted a developer placeholder visible to users. Found everything by label, never by guessing. | AI tone needs warming up; "Services" and "Routes" wording is inconsistent; dev placeholder text visible | 4/5 "Beautiful, just polish the words." |
| **Engineering student** | Medium to high tech comfort, practical and edge-case minded | Android | Tried planning a journey from a stop to the same stop and got a confused answer: "it tried to plan me a trip to where I'm already standing." Wanted interchange info between modes. Echoed the concern about fare not being shown before purchase. Liked that the layout held up when rotating the phone. | No same-stop validation; no interchange info in journey results; fare not shown before purchase | 3/5 |
| **Professor A** | High tech comfort, evaluating against the project brief | Laptop with admin account | Edited a fare and a timetable entry successfully: "the resident/admin separation is clearly implemented, that's the strongest part." Noted that First Bus GPS and roadworks reporting exist in the backend but are not surfaced anywhere in the UI. | GPS and roadworks data not shown to users; admin actions lack confirmation or undo | 4/5 |
| **Professor B** | High tech comfort, usability and accessibility focus | Laptop and phone, briefly with screen zoom | Flagged contrast issues with orange text on the navy hero and small caption text that may fail WCAG AA. Asked what happens when the AI goes down and got no fallback. Liked the consistent layout and clear nav state. Suggested a proper empty state for no results found. | Colour contrast and small text; no offline or AI failure fallback; missing empty states | 4/5 |
| **Cafe colleague, 26** | Medium tech comfort, does not live in Birmingham | Android, on her break | First impression: "I don't know any of these stop names, I'd just be guessing." Eventually picked two stops at random and liked the plain-language result: "that bit's actually class, it just talks to you." Asked if the ticket works at the barrier on the bus and expected a QR code. "For somewhere I've never been this is way less scary than the official apps." | Stop selection assumes local knowledge; no scannable ticket; no onboarding for visitors | 4/5 |

---

## Ratings

| Participant | Group | Rating |
|-------------|-------|:------:|
| Dad | Family | 3 |
| Mum | Family | 4 |
| CS student | Classmate | 4 |
| Pharmacy student | Classmate | 3 |
| Law student | Classmate | 3 |
| English student | Classmate | 4 |
| Engineering student | Classmate | 3 |
| Professor A | Professor | 4 |
| Professor B | Professor | 4 |
| Cafe colleague | Friend | 4 |
| **Average** | | **3.6 / 5** |

---

## Key findings

The results from the testing led to these 3 key findings:

| Finding | What we saw |
|---------|-------------|
| The UI was easy to navigate | Every participant completed the mobile navigation task without getting lost. The bottom tab bar and clear active states meant nobody had to guess where to go. |
| Tickets were easy to purchase | All 10 participants bought a ticket without needing help. Mum put it best: "That was quicker than the council site." |
| The modern UI may be an issue for older people | Dad, our oldest participant, found the design unfamiliar and expected patterns from apps like banking or maps. The lack of a loading spinner and no upfront price display made him unsure whether things had worked. Professor B also flagged contrast and tap target sizes as potential barriers. |

---

## Future changes

This, combined with our own ideas for the project, led to the final list of future changes:

| Change | Why |
|--------|-----|
| Accessibility mode for older people | Testing showed that older users struggled with contrast, small tap targets, and missing feedback like loading indicators. An accessibility mode with larger text, higher contrast, and simpler layouts would make the app usable for everyone in Ladywood, not just younger commuters. |
| Interactive map | Multiple participants expected a map from the start. Dad said he would only use the app if it showed him a map. A visual map of stops and routes would make the app feel much more familiar to anyone used to Google Maps or Citymapper. |
| Live bus tracking | Mum wanted to know if the times were real. The pharmacy student wanted to see the next two departures immediately. Live tracking would answer both concerns and is the single most-requested feature across the group. |
| Expand across Birmingham | The cafe colleague, who does not know Ladywood, found the stop names meaningless. Starting with Ladywood was the right call for the prototype, but the natural next step is covering more of Birmingham so the app is useful to a wider audience. |
