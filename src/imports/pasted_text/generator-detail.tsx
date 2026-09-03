Create a premium industrial SCADA dashboard page for monitoring a single diesel generator.

This page will be reused for Generator 1, Generator 2 and Generator 3.

The design language must be identical to the System Overview page.

Inspired by:

• Siemens WinCC Unified
• ABB Ability
• Schneider EcoStruxure
• ComAp InteliGen
• DEIF AGC
• GE Power SCADA

Resolution:
1920 × 1080

====================================================
GENERAL STYLE
====================================================

Dark industrial theme.

Background:
#0F172A

Panels:
Dark gray
Rounded corners (12 px)
Soft shadow

Accent Colors

Green = Running / Healthy

Yellow = Warning

Red = Alarm

Gray = Offline

Blue = Information

Use clean typography.

Minimalistic.

Large spacing.

Industrial appearance.

====================================================
HEADER
====================================================

Keep the same header as the System Overview page.

Include:

Power Management System

Current Date

Current Time

Operator

PLC Status

Communication Status

WebSocket Status

System Health

Alarm Indicator

====================================================
LEFT SIDEBAR
====================================================

Keep the same navigation sidebar.

Highlight the current Generator page.

Navigation:

System Overview

Generator 1

Generator 2

Generator 3

Alarm Logs

====================================================
PAGE TITLE
====================================================

Generator Detail

Dynamic title:

Generator 1

Generator 2

Generator 3

Display underneath:

Rated Power

Example:

Rated Power
3.6 kW

====================================================
MAIN LAYOUT
====================================================

Split the page into two sections.

LEFT
35%

RIGHT
65%

====================================================
LEFT PANEL
LIVE MEASUREMENTS
====================================================

Create one industrial measurement panel.

Arrange the measurements as follows.

----------------------------------

Voltage A

Voltage B

Voltage C

displayed in the LEFT column.

Frequency A

Frequency B

Frequency C

displayed in the RIGHT column.

Each measurement uses an individual digital card.

Layout:

┌──────────────┬──────────────┐
│ Voltage A    │ Frequency A  │
├──────────────┼──────────────┤
│ Voltage B    │ Frequency B  │
├──────────────┼──────────────┤
│ Voltage C    │ Frequency C  │
└──────────────┴──────────────┘

Below these six cards place one larger card.

====================================================

Large Card

Excitation Current

Display:

Large numeric value

Engineering unit

Current status

Example

2.15 A

====================================================

Each card contains:

Measurement Name

Large Number

Engineering Unit

Small Status LED

Animated value transition

Green when normal

Gray when generator stopped

Red during alarm

Example values

Voltage A

398 V

Voltage B

400 V

Voltage C

399 V

Frequency A

49.99 Hz

Frequency B

50.01 Hz

Frequency C

50.00 Hz

Excitation Current

2.15 A

====================================================
RIGHT PANEL
HISTORICAL TREND
====================================================

Create three stacked trend charts.

Each chart occupies almost the full width.

Modern industrial appearance.

Rounded panel.

Grid lines.

Smooth scrolling animation.

Time axis.

Legend.

====================================================

Trend 1

Title

Three Phase Voltage Trend

Display

Voltage A

Voltage B

Voltage C

Three colored trend lines.

Vertical Axis

380~420 V

Horizontal Axis

Last 60 Seconds

====================================================

Trend 2

Title

Three Phase Frequency Trend

Display

Frequency A

Frequency B

Frequency C

Three colored trend lines.

Vertical Axis

49~51 Hz

Horizontal Axis

Last 60 Seconds

====================================================

Trend 3

Title

Excitation Current Trend

Display

Excitation Current

Single trend line.

Vertical Axis

0~5 A

Horizontal Axis

Last 60 Seconds

====================================================
TREND FUNCTIONS
====================================================

Each chart includes:

Live Indicator

Pause

Zoom

Reset Zoom

Time Range Selector

30 Seconds

1 Minute

5 Minutes

15 Minutes

====================================================
BOTTOM STATUS BAR
====================================================

Generator Status

Communication

Average Voltage

Average Frequency

Excitation Current

CPU Load

Last Update Time

====================================================
ANIMATIONS
====================================================

Measurements should smoothly animate when values change.

Trend charts continuously scroll from right to left.

Status LEDs softly pulse.

Generator online indicator glows green.

====================================================
EXAMPLE DATA
====================================================

Voltage A

398 V

Voltage B

400 V

Voltage C

399 V

Frequency A

49.99 Hz

Frequency B

50.01 Hz

Frequency C

50.00 Hz

Excitation Current

2.15 A

Generator Status

RUNNING

Communication

ONLINE

====================================================
IMPORTANT
====================================================

This page is a monitoring page only.

Do NOT include any control buttons.

Do NOT include START.

Do NOT include STOP.

Do NOT include Breaker Control.

Do NOT include parameter editing.

Focus on real-time monitoring.

The interface must look like a professional industrial SCADA dashboard used in a real power management system.

The layout should prioritize readability, fast operator recognition and efficient monitoring rather than decorative elements.
