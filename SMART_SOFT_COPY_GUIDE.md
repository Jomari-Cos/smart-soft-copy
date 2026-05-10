# SMART SOFT COPY - Project Guide

## Project Overview

**SMART SOFT COPY** is a Flask-based grade mapping system that helps teachers import their grading list, match it against the registrar's official student roster, and submit verified grade matches.

The current implementation is built with:
- Flask backend (`backend/`) for API, models, and persistence
- Frontend HTML/CSS/JS (`frontend/`) with drag/drop and file parsing
- SQLite-backed storage via SQLAlchemy

---

## Current System Behavior

### What the app supports today
- Upload teacher grade sheets as **Excel (.xlsx/.xls)** or **CSV** files
- Upload registrar student lists as **Excel** or **CSV** files
- Automatically save uploaded teacher grade rows and registrar student rows to the backend
- Run fuzzy matching inside the browser to match teacher names to registrar names
- Display match results with confidence and status
- Highlight clicked result rows for visual focus
- Submit matched grade payloads to the backend

### What the app does not currently include
- There is no active audio verification feature in the current frontend
- The current UI does not support direct manual cell editing inside the table
- The frontend uses client-side matching instead of calling the backend `/api/vlookup-match` endpoint

---

## Feature Breakdown

### Feature 1: File-based grade import

**What it does:**
Teachers can load both their grading list and the registrar roster using drag/drop or browse actions.

**How it works:**
- Teacher file uploads are parsed by SheetJS for Excel or manually parsed for CSV
- Registrar files are parsed the same way
- Rows are saved via API calls:
  - `/api/teacher-grades` for teacher entries
  - `/api/students` for registrar names

**Result:**
- Teacher-grade rows and official student records are stored in the app database
- Both lists appear in separate tables in the interface

---

### Feature 2: Fuzzy name matching

**What it does:**
Matches each teacher-submitted student name against the official registrar list with a similarity score.

**How it works:**
- The browser computes a similarity score for each teacher name against every registrar name
- A custom Levenshtein-style distance is used to calculate a normalized confidence value
- Matches are classified as:
  - `Found` when confidence >= 95%
  - medium confidence for 85%–95%
  - `Not Found` for lower similarity

**User-facing behavior:**
- The result table shows:
  - teacher name
  - grade
  - matched registrar name
  - confidence percentage
  - match status

---

### Feature 3: Visual scaffolding

**What it does:**
Highlights a result row when the user clicks it.

**How it works:**
- Rows in the result table become visually highlighted using a yellow accent style
- The CSS class `row-highlight` is applied on click

**Why it matters:**
- Helps users keep their place while reviewing matches
- Makes it easier to compare individual entries at a glance

---

## Current User Workflow

1. Upload the teacher grading sheet (name + grade columns)
2. Upload the registrar student list
3. Click `Run VLOOKUP`
4. Review the result table and click any row to highlight it
5. Click `Submit to Registrar`

This workflow saves teacher-grade rows and registrar student rows in the database, then submits matched grade payloads back to the backend.

---

## Architecture

### Frontend
- `frontend/templates/index.html` — main UI layout
- `frontend/static/css/style.css` — neumorphic visual styling, table and highlight styles
- `frontend/static/js/script.js` — upload handling, Excel/CSV parsing, matching logic, and API calls
- `SheetJS` for Excel parsing (`xlsx.full.min.js`)

### Backend
- `backend/app.py` — Flask application factory, template/static registration, blueprint registration
- `backend/routes/api.py` — REST API endpoints
- `backend/models/` — SQLAlchemy models for `Student` and `TeacherGrade`
- `backend/services/grade_service.py` — parser and fuzzy matching utilities
- `backend/scripts/init_db.py` — DB initialization helper

---

## Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/hello` | Greet endpoint for testing |
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create a user |
| GET | `/api/users/<id>` | Get a specific user |
| PUT | `/api/users/<id>` | Update a user |
| DELETE | `/api/users/<id>` | Delete a user |
| POST | `/api/parse-grades` | Parse pasted text into grade rows |
| GET | `/api/students` | Get all registrar students |
| POST | `/api/students` | Add a registrar student |
| POST | `/api/teacher-grades` | Save a teacher grade row |
| GET | `/api/teacher-grades` | Get saved teacher grades |
| POST | `/api/submit-grades` | Submit matched grade payloads |
| POST | `/api/vlookup-match` | Backend matching service (available but not used by current UI) |

---

## Data Models

### Student
- `id` — primary key
- `registrar_id` — unique registrar identifier
- `full_name` — official student name
- `email` — optional email
- `status` — active/inactive status
- `created_at`

### TeacherGrade
- `id` — primary key
- `teacher_submitted_name` — name from teacher list
- `matched_student_id` — optional foreign key to `Student`
- `grade` — submitted grade
- `confidence_level` — numeric confidence score
- `verified` — boolean flag
- `course_id` — optional course identifier
- `created_at`

---

## Implementation Notes

- The current frontend uploads rows immediately to the backend when files are processed.
- Matching is performed in-browser using a string-similarity algorithm in `frontend/static/js/script.js`.
- The app currently supports Excel and CSV uploads for both teacher and registrar inputs.
- Highlighting is implemented via the CSS class `row-highlight`, which is toggled on the clicked result row.
- Submission sends `submissionData` to `/api/submit-grades`, where backend records are updated to `verified = true`.

---

## Next Improvements

1. Add an actual audio verification step using the Web Speech API
2. Implement server-side matching through `/api/vlookup-match`
3. Add inline result editing and manual correction controls
4. Improve parser support for pasted text and variable grade formats
5. Add a review page for unmatched or low-confidence rows
