# Dealer Network Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the Sain Motors dealer network to the supplied Orbis reference with truthful Mongolia locations and working coordinated maps.

**Architecture:** Keep URL filters as the shared state in LocationDirectory. Isolate country overview, contact accordion rows and lazy Leaflet map in focused components; keep coordinates, city groups and projection data outside rendering.

**Tech Stack:** Next static export, React, TypeScript, locally vendored Leaflet 1.9.4, CSS, Vitest and Playwright.

**Spec:** `docs/superpowers/specs/2026-11-16-dealer-network-design.md`

## Constraints and rulings

Preserve the eight records, eleven brands, bilingual routes and prior uncommitted homepage work. Modify the current workspace without commits/deploys. Retain exact links and only plot verified dealer pins. Unverified records get city-area groups and honest labels. Keep contacts usable without JS or tiles. Use existing 48px minimum controls and visible focus.

## Review focus

Unknown brand/city query values, disjoint filters, browser Back and locale switching; selecting an unverified location; blocked tile requests; a map scrolled into view after filtering; narrow 320px screens and enlarged text.

## Tasks

- [x] 1. Data and geography: add failing meaningful unit cases for exact versus city-area points and filtered city counts. Add sourced optional coordinates, city centers and country projection. Pass unit cases.
- [ ] 2. Coordinated interface: add browser assertions for brand pills, city counts, city click and accordion/map behavior. Replace banner/directory presentation with black hero, country overview and white split directory. Preserve existing contact markup through a dedicated row component. Add lazy local Leaflet runtime and graceful failure.
- [ ] 3. Responsive design and verification: desktop/mobile visual review, no-JS/keyboard/URL/error checks, appropriate unit/E2E suites, lint and fresh production build. Fix issues found. Final independent review; record findings and completion evidence.
- [ ] 4. User refinement: share homepage header dimensions across all menu pages; mobile logos unframed, 22px heading, directory immediately below country map, optional street map below list. Verify cross-route consistency and mobile menu.

## Completion contract

MN/EN pages visually match the reference hierarchy; city/brand/row/map controls work together; 8 locations are accounted for, 4 precise pins and 4 city-area records; no fabricated information; no horizontal overflow from 320–1920px; contacts survive JavaScript/tile failure; lint/build and relevant tests pass.
