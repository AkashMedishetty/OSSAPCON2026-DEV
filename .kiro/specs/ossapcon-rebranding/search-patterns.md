# OSSAPCON Rebranding Search Patterns

This document contains comprehensive search patterns for the NeuroTrauma to OSSAPCON rebranding.

## Text Replacement Patterns

### Primary Brand Names
- `NeuroTrauma 2026` → `OSSAPCON 2026`
- `Neuro Trauma 2026` → `OSSAPCON 2026`
- `NeuroTrauma` → `OSSAPCON 2026`
- `Neuro Trauma` → `OSSAPCON 2026`
- `neurotrauma` → `ossapcon`
- `neuro-trauma` → `ossapcon`

### Conference Names and Descriptions
- `Annual Conference of Neurotrauma Society of India` → `Annual Conference of Orthopedic Surgeons Society of Andhra Pradesh`
- `Neurotrauma Society of India` → `Orthopedic Surgeons Society of Andhra Pradesh`
- `NTSI` → `OSSAP`
- `Science, Sports & Spiritually` → `Excellence in Orthopedic Care`

### Location Updates
- `Hyderabad, India` → `Kurnool, Andhra Pradesh`
- `Hyderabad` → `Kurnool`
- `Telangana` → `Andhra Pradesh`

### Contact Information
- Email patterns to replace with `contact@ossapcon2026.com`:
  - `neurotrauma2026@gmail.com`
  - `contact@neurotrauma2026.in`
  - Any other conference-related emails
- Phone: Update to `+91 9052192744`
- Contact Person: Update to `LAXMI PRABHA`

### Domain and Website References
- `neurotrauma2026.in` → `ossapcon2026.com`
- `www.neurotrauma2026.in` → `www.ossapcon2026.com`
- `https://neurotrauma2026.in` → `https://ossapcon2026.com`

### Organization Updates
- `Department of Neurosurgery` → `Department of Orthopedics, Kurnool Medical College`
- Any references to organizing institutions

### File and Directory Names
- `neurotrauma-fix/` → `ossapcon-fix/`
- Service worker cache names: `neurotrauma-2026-*` → `ossapcon-2026-*`
- Any file names containing `neurotrauma`

### Medical Specialty Focus
- `Neurotrauma` → `Orthopedic Surgery`
- `Neurosurgery` → `Orthopedic Surgery` (where contextually appropriate)
- `Brain and Spine` → `Spine and Orthopedics` (where contextually appropriate)

## Search Commands for Verification

### Case-insensitive searches to run:
```bash
# Search for any remaining NeuroTrauma references
grep -ri "neurotrauma" .
grep -ri "neuro.trauma" .
grep -ri "ntsi" .

# Search for old contact information
grep -ri "neurotrauma2026@gmail.com" .
grep -ri "neurotrauma2026.in" .

# Search for old location references
grep -ri "hyderabad" .
grep -ri "telangana" .

# Search for old organization references
grep -ri "neurosurgery" .
grep -ri "neurotrauma society" .
```

### File name searches:
```bash
# Find files with neurotrauma in the name
find . -name "*neurotrauma*" -type f
find . -name "*neuro*trauma*" -type f
```

## Color Theme Updates

### CSS Color Replacements
- Primary orange: `#ff6b35` → `#015189`
- Orange variants: `#ff8c42`, `#ff5722` → Blue variants
- HSL orange: `24 95% 53%` → `204 100% 29%`

### Tailwind Classes
- `bg-orange-*` → `bg-blue-*`
- `text-orange-*` → `text-blue-*`
- `border-orange-*` → `border-blue-*`
- `hover:bg-orange-*` → `hover:bg-blue-*`

## Package and Configuration Updates

### package.json
- `name`: Update project name
- `description`: Update project description

### README.md
- Update all project descriptions
- Update setup instructions if needed
- Update contact information

### Environment Variables
- Any environment variables with old branding
- Email configuration variables

## Verification Checklist

After replacements, verify:
- [ ] No case-insensitive matches for "neurotrauma"
- [ ] No case-insensitive matches for "neuro trauma"
- [ ] No references to old email addresses
- [ ] No references to old domain names
- [ ] No references to Hyderabad/Telangana
- [ ] All file names updated
- [ ] All cache names updated
- [ ] All color themes updated
- [ ] Package.json updated
- [ ] README.md updated
- [ ] All contact information updated