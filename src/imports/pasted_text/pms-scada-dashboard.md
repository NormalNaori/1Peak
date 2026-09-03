Create a premium industrial SCADA web dashboard for a Power Management System (PMS) used to monitor and control three diesel generators connected to a common AC bus.

The interface should look like a professional industrial control system similar to Siemens WinCC Unified, ABB Ability, Schneider EcoStruxure, GE Power SCADA or modern marine power management systems.

The dashboard must be clean, modern, realistic, highly readable and suitable for a 1920×1080 monitor.

====================================================
GENERAL DESIGN STYLE
====================================================

Theme:
• Dark industrial UI
• Background: #0F172A
• Dark gray panels
• Soft shadows
• Rounded corners (10~12px)

Accent Colors:
• Green = Running / Energized / Healthy
• Yellow = Warning
• Red = Fault / Alarm
• Gray = De-energized
• Blue = Information

Use modern industrial icons.

Avoid unnecessary decorations.

Use subtle animations only.

====================================================
SYSTEM INFORMATION
====================================================

The system contains:

Generator G1 = 3.6 kW

Generator G2 = 3.6 kW

Generator G3 = 1.5 kW

Total installed capacity = 8.7 kW

Three electrical loads:

Load 1

Load 2

Load 3

All generators are connected to one common AC bus through individual generator contactors.

Each load is connected to the common bus through its own load contactor.

The electrical topology must follow the attached reference image.

Use the image ONLY as topology reference.

Do NOT copy its visual appearance.

====================================================
ONLY DESIGN PAGE 1
====================================================

SYSTEM OVERVIEW

Do NOT design the other pages yet.

====================================================
TOP HEADER
====================================================

Create a professional top header containing:

POWER MANAGEMENT SYSTEM

Current Date

Current Time

Current Operator

PLC Communication

Modbus TCP Status

WebSocket Status

Overall System Health

Emergency Alarm Indicator

====================================================
LEFT SIDEBAR
====================================================

Create a modern navigation sidebar.

Menu items:

• System Overview
• Generator 1
• Generator 2
• Generator 3
• Alarm Logs

Highlight:

System Overview

The remaining pages should only appear in the navigation menu without content.

====================================================
MAIN CONTENT
====================================================

Split the page into two sections.

LEFT = approximately 65%

RIGHT = approximately 35%

====================================================
LEFT SIDE
Electrical Single Line Diagram
====================================================

Create a realistic electrical single-line diagram.

Include:

Generator G1

Generator G2

Generator G3

Generator contactors

Main AC Bus

Bus connections

Load contactors

Load 1

Load 2

Load 3

Electrical cables

The electrical layout must closely follow the attached reference image.

====================================================
LOAD DIGITAL METERS
====================================================

Above each load feeder place one industrial digital meter.

LOAD 1

LOAD 2

LOAD 3

Each meter displays:

• Load Name
• Active Power (kW)
• Current (A)
• Green status LED

Example:

LOAD 1

1.25 kW

3.10 A

Style:

Dark industrial panel

Digital 7-segment inspired font

Green numbers when energized

Gray numbers when disconnected

Subtle glow effect

The three meters must align directly above their corresponding loads.

====================================================
LIVE ELECTRICAL ANIMATIONS
====================================================

Electrical cables:

Without power:

• Dark Gray

With power:

• Bright Green

• Animated flowing light

• Soft glow

• Moving energy particles

Bus:

When energized:

• Green glow

• Flow animation

Generator contactors:

Open:

• Gray

• Contacts separated

Closed:

• Green

• Smooth closing animation

Load contactors:

Use the same behavior.

====================================================
GENERATOR ANIMATION
====================================================

Each generator contains a rotating fan icon.

Stopped:

• Fan stopped

• Gray

Running:

• Fan rotates continuously

• Green glow

• Smooth animation

====================================================
RIGHT SIDE
====================================================

At the top create a large KPI card.

Title:

SYSTEM LOAD

Display:

Large Percentage

Example:

68%

Progress bar

Display:

4.80 kW / 8.70 kW

Color ranges:

0~70%

Green

70~90%

Yellow

Above 90%

Red

Animate the percentage smoothly whenever values change.

This card should be the most visually important element on the right side.

====================================================
GENERATOR SUMMARY
====================================================

Below the System Load card create three vertical generator cards.

Generator 1

Generator 2

Generator 3

Each card displays:

Generator Name

Large Running Status

RUNNING

STOPPED

Animated Generator Icon

Voltage (V)

Frequency (Hz)

Excitation Current (A)

Communication

ONLINE

OFFLINE

Health Badge

Healthy

Warning

Fault

Status LED

Green

Yellow

Red

Each generator card should have a clean industrial appearance.

====================================================
BOTTOM STATUS BAR
====================================================

Display:

PLC Status

Communication Status

Total Generated Power

Total Load

Power Balance

CPU Load

Last Update Time

====================================================
EXAMPLE LIVE VALUES
====================================================

Generator 1

400 V

50.00 Hz

2.3 A

Running

Generator 2

399 V

50.00 Hz

2.1 A

Running

Generator 3

401 V

50.00 Hz

0.0 A

Stopped

Load 1

1.25 kW

3.10 A

Load 2

2.10 kW

5.20 A

Load 3

0.45 kW

1.10 A

System Load

3.80 kW / 8.70 kW

44%

Power Balance

+4.90 kW

====================================================
INTERACTION
====================================================

Use smooth transitions.

All values should appear as live data.

Support future integration with PLC.

All meters should look ready for real-time updates.

Do not use static infographic style.

The interface should look like a real industrial monitoring system.

====================================================
IMPORTANT
====================================================

The attached image is only the electrical topology reference.

Redesign everything using a modern industrial SCADA style.

Keep the same electrical connection structure.

Only design the System Overview page.

Generator 1, Generator 2, Generator 3 and Alarm Logs should only appear as navigation items and should not be designed yet.
