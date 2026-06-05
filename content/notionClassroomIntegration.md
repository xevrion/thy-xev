# Syncing Google Classroom to Notion with Google Apps Script
Date: 02-03-2026
Tags: web, guide

## The Problem

IIT Jodhpur uses Google Classroom for assignments and announcements across all courses. The issue: you're enrolled in 7+ courses, each with its own stream of assignments, deadlines, and announcements. There's no unified dashboard. You end up checking each course individually, and things slip through.

I wanted a single Notion database that:

- Shows all assignments due in the next 2 weeks across all courses
- Tracks submission status (`Not Submitted`, `Submitted`, `Graded`, `Late`, `Missing`)
- Fetches descriptions, max points, grades, and direct links
- Shows recent announcements from all course streams
- Lets me select which courses to track each semester
- Skips assignments with no due date (professor posted a resource, not an actual task)
- Auto-syncs every hour

## Architecture

Three Notion databases connected to Google Classroom via a Google Apps Script that runs on an hourly trigger.

```
Google Classroom API
        │
        ▼
Google Apps Script (hourly trigger)
        │
        ├──► Notion: Course Selector (all enrolled courses, Active checkbox)
        ├──► Notion: Assignments (due within 14 days, with status/grade/priority)
        └──► Notion: Announcements (last 7 days per active course)
```

**Why Google Apps Script over Python/n8n:**

- Free, runs on Google's infra — no server needed
- Native access to Classroom API (no OAuth token management)
- Built-in time-based triggers
- Editable from any browser at `script.google.com`

## Setup

### Step 1: Create a Notion Integration

Go to `https://www.notion.so/profile/integrations` and create a new internal integration. Name it something like `Classroom Sync`. Enable Read, Update, and Insert content capabilities. Save the API key (starts with `ntn_`).

### Step 2: Create the Notion Databases

**Assignments Database:**

| Property | Type |
|---|---|
| Name | Title |
| Course | Select |
| Due Date | Date |
| Status | Select (`Not Submitted`, `Submitted`, `Graded`, `Returned`, `Late`, `Missing`) |
| Description | Rich text |
| Max Points | Number |
| Grade | Rich text |
| Days Left | Number |
| Priority | Select (`Overdue`, `Due Today`, `Due Tomorrow`, `This Week`, `Next Week`, `Done`) |
| Classroom Link | URL |
| Classroom ID | Rich text |
| Last Synced | Date |

> **Important:** Status must be a **Select** property, not Notion's built-in "Status" type (the one with To-do/In Progress/Done). The API treats them differently and will throw a validation error.

**Announcements Database:**

| Property | Type |
|---|---|
| Name | Title |
| Course | Select |
| Posted Date | Date |
| Full Text | Rich text |
| Posted By | Rich text |
| Classroom ID | Rich text |

**Course Selector Database:**

| Property | Type |
|---|---|
| Name | Title |
| Semester | Select |
| Active | Checkbox |
| Classroom Course ID | Rich text |

Share all three databases with your integration via the `•••` menu → Connections.

Grab each database's ID from its URL: `notion.so/workspace/DATABASE_ID?v=...` — the 32-character string before the `?`.

### Step 3: Create the Apps Script Project

1. Go to `script.google.com` → New Project
2. Click **Services** (`+` in the sidebar) → add **Google Classroom API**
3. Click the ⚙ gear icon → check **"Show appsscript.json manifest file in editor"**
4. Replace `appsscript.json` with:

```json
{
  "timeZone": "Asia/Kolkata",
  "dependencies": {
    "enabledAdvancedServices": [
      {
        "userSymbol": "Classroom",
        "version": "v1",
        "serviceId": "classroom"
      }
    ]
  },
  "oauthScopes": [
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
    "https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly",
    "https://www.googleapis.com/auth/classroom.announcements.readonly",
    "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly",
    "https://www.googleapis.com/auth/classroom.rosters.readonly",
    "https://www.googleapis.com/auth/classroom.profile.emails",
    "https://www.googleapis.com/auth/script.external_request"
  ],
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```

> **This is critical.** Without explicit scopes, Apps Script defaults to teacher-level Classroom permissions. Students need `classroom.coursework.me.readonly` and `classroom.student-submissions.me.readonly` — these are student-specific scopes that let you read your own coursework and submissions.

### Step 4: The Sync Script

Paste this into `Code.gs`. Replace the config values with your own:

```javascript
const CONFIG = {
  NOTION_API_KEY: "your_ntn_key_here",
  ASSIGNMENTS_DB: "your_assignments_db_id",
  ANNOUNCEMENTS_DB: "your_announcements_db_id",
  COURSE_SELECTOR_DB: "your_course_selector_db_id",
  DUE_WITHIN_DAYS: 14,
  SHOW_OVERDUE_DAYS: 7,
  ANNOUNCEMENT_DAYS: 7,
  NOTION_API_URL: "https://api.notion.com/v1",
  NOTION_VERSION: "2022-06-28"
};
```

The script has four main functions:

- **`firstRun()`** — Fetches all your enrolled Classroom courses and creates entries in the Course Selector database.
- **`syncAll()`** — Reads which courses are marked Active, then syncs assignments and announcements for those courses.
- **`setupHourlyTrigger()`** — Creates an hourly Apps Script trigger for `syncAll` and a daily trigger to clean up old announcements.
- **`cleanupOldAnnouncements()`** — Archives announcements older than 7 days.

The full script (~300 lines) handles pagination, deduplication via Classroom IDs, rate limiting (350ms between Notion API calls), and graceful error handling for permission issues.

### Step 5: First Run

1. Select `firstRun` from the dropdown → Run
2. Authorize when prompted (allow Classroom access)
3. Go to Notion → Course Selector → check "Active" for your current semester courses
4. Select `syncAll` → Run
5. Select `setupHourlyTrigger` → Run

## How the Student-Specific Logic Works

### Submission Status Mapping

The Classroom API returns submission states like `NEW`, `TURNED_IN`, `RETURNED`, `RECLAIMED_BY_STUDENT`. These are internal states, not what a student thinks. The script maps them:

```
NEW / CREATED → "Not Submitted" (or "Missing" if past due)
TURNED_IN → "Submitted" (or "Late" if submission.late is true)
RETURNED + assignedGrade → "Graded"
RETURNED without grade → "Returned"
RECLAIMED_BY_STUDENT → "Not Submitted" (you took it back to edit)
```

### Priority Auto-Tagging

Based on days remaining and submission status:

```
Already submitted/graded → "Done"
Past due + not submitted → "Overdue"
Due today → "Due Today"
Due tomorrow → "Due Tomorrow"
Due within 7 days → "This Week"
Due within 14 days → "Next Week"
```

### Grade Formatting

When a grade is returned, it shows as `85/100 (85%)`. If only a draft grade exists (teacher hasn't finalized), it shows `Draft: 85`. Otherwise `—`.

### Deduplication

Every assignment and announcement gets a `Classroom ID` stored in Notion. On each sync, the script queries existing entries and checks: does this ID already exist? If yes, update the existing entry (status might have changed, grade might have been added). If no, create a new one.

## Gotchas I Hit Along the Way

**1. Notion's "Status" vs "Select" property type**

Notion has two similar-looking property types: "Status" (with kanban-style To-do/In Progress/Done) and "Select" (simple dropdown). The API format is different for each. If you create a "Status" type property and send Select-format data, you get: `Status is expected to be status`. Use Select.

**2. Rich text vs Number for Classroom IDs**

Classroom course IDs are large numbers like `824043424821`. If you accidentally create the `Classroom Course ID` property as a Number type in Notion, the script writes rich_text format data and Notion silently ignores it — no error, just empty fields. Then the deduplication breaks (everything looks new), and syncs fail because the script can't read back the course ID. Always use Rich text for ID fields.

**3. OAuth scopes for students**

The default Classroom scopes Apps Script adds are teacher-level (`classroom.coursework.students.readonly`). Students get "The caller does not have permission" errors. You need to explicitly set `classroom.coursework.me.readonly` in `appsscript.json`. The `.me.` scopes are student-specific — they let you read only your own data.

**4. Notion API rate limits**

Notion allows 3 requests per second. Without any throttling, the script fires requests back-to-back and starts getting 429 errors after ~20 calls. A 350ms sleep between requests fixes this completely.

**5. Announcements without creator profiles**

Students often can't look up instructor profiles via the Classroom API (permission denied on `UserProfiles.get`). The script catches this gracefully and falls back to "Instructor" as the poster name.

## Semester Switching

When a new semester starts:

1. New courses auto-appear in Course Selector on the next sync
2. Uncheck old courses, check new ones
3. That's it — the script only fetches data for Active courses

Old assignments and announcements stay in the database for reference. You can archive them manually or set up a view filtered by semester.

## Recommended Notion Views

Create these filtered/sorted views in your Assignments database for a proper dashboard:

- **Urgent** — Filter: Status ≠ Done, Sort by Days Left ascending
- **By Course** — Group by Course, Sort by Due Date
- **Missing** — Filter: Status = Missing or Status = Overdue
- **Completed** — Filter: Status = Submitted or Status = Graded

## Takeaway

Google Classroom's API is well-documented but has student-specific quirks around permissions and scopes. Google Apps Script is the path of least resistance for this kind of Google → external service sync — no server, no tokens, no cron jobs.

The total setup takes about 20 minutes. After that, you get a live Notion dashboard that updates hourly with all your assignments, statuses, grades, and announcements across every course — without opening Classroom once.

Full script available on request. The complete `Code.gs` is ~300 lines of JavaScript.