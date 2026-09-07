/**
 * Local demonstration flags. These do not call a remote config service.
 */
export const featureFlags = {
  showSalaryOnOverview: false,
  allowSimulatedPayments: true,
  persistSessionAcrossLaunches: true,
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export function isEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag];
}
