export type RegistrationTier = "Early Bird" | "Regular" | "Late / Spot"

export interface RegistrationWindows {
	earlyBirdEnd: Date
	regularStart: Date
	regularEnd: Date
	lateStart: Date
}

// Centralized registration windows sourced from provided pricing table
export const registrationWindows: RegistrationWindows = {
	earlyBirdEnd: new Date("2025-10-31T23:59:59"),
	regularStart: new Date("2025-11-01T00:00:00"),
	regularEnd: new Date("2026-01-25T23:59:59"),
	lateStart: new Date("2026-01-26T00:00:00"),
}

export function getCurrentTier(date: Date = new Date()): RegistrationTier {
	if (date <= registrationWindows.earlyBirdEnd) return "Early Bird"
	if (date <= registrationWindows.regularEnd) return "Regular"
	return "Late / Spot"
}

export function getTierByDate(date: Date): RegistrationTier {
	return getCurrentTier(date)
}

export const registrationLabels = {
	earlyBird: "Early Bird till 31/10/2025",
	regular: "Regular 01/11/2025–25/01/2026",
	late: "Late/Spot from 26/01/2026",
}

export function getTierSummary(now: Date = new Date()): string {
	return `${registrationLabels.earlyBird} · ${registrationLabels.regular} · ${registrationLabels.late}`
}

// Pricing per tier (inclusive of 18% GST) from provided table
export type RegistrationCategory = "ossap-member" | "non-member" | "pg-student"

export interface TierPricing {
	[category: string]: { amount: number; currency: "INR" }
}

const PRICING_BY_TIER: Record<RegistrationTier, TierPricing> = {
	"Early Bird": {
		"ossap-member": { amount: 8250, currency: "INR" },
		"non-member": { amount: 9440, currency: "INR" },
		"pg-student": { amount: 5900, currency: "INR" },
	},
	"Regular": {
		"ossap-member": { amount: 9440, currency: "INR" },
		"non-member": { amount: 10620, currency: "INR" },
		"pg-student": { amount: 7080, currency: "INR" },
	},
	"Late / Spot": {
		"ossap-member": { amount: 11210, currency: "INR" },
		"non-member": { amount: 11800, currency: "INR" },
		"pg-student": { amount: 8260, currency: "INR" },
	},
}

export function getTierPricing(tier: RegistrationTier = getCurrentTier()): TierPricing {
	return PRICING_BY_TIER[tier]
}
