# Tourist Guide for Foreigners in Bangladesh

## Current State
Full website with Admin Panel having tabs: Blog Posts, Tour Packages, Inquiries, Add Guide. Backend has inquiry, blog, package, guide management.

## Requested Changes (Diff)

### Add
- **Ad Slots system**: Admin can add advertiser banners (image, link, advertiser name, price paid, active/inactive). Ads display on main website in a dedicated "Our Sponsors" section.
- **Ad click tracking**: Backend records clicks per ad slot.
- **Statistics Overview tab**: Admin Panel new "Overview" tab showing total inquiries, blog posts, packages, guides, active ads, and total ad revenue earned.
- **Ads Management tab**: Admin Panel new tab to create/edit/delete ad slots.

### Modify
- Backend: Add AdSlot type and functions (create, update, delete, getAll, recordClick, getStats).
- Main website: Add sponsor banner section showing active ads.
- Admin Panel: Add Overview and Ads tabs.

### Remove
- Nothing removed.

## Implementation Plan
1. Add AdSlot type and CRUD + stats to backend (main.mo)
2. Add Overview + Ads tabs to AdminPanel.tsx
3. Add sponsors/ads section to BangladeshTourSite.tsx main page
