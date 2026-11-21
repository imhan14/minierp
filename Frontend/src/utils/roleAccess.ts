/** Shared access rules for both sidebar visibility and route protection. */
const LEADERSHIP_ROLES = [2, 3, 4, 5] as const;
const DASHBOARD_ROLES = [1, 2, 3, 4, 5] as const;
const ORDER_ROLES = [2, 3, 4, 5, 7] as const;
const MANAGEMENT_ROLES = [1, 2, 3, 4, 8] as const;
const USER_MANAGEMENT_ROLES = [1, 2, 3, 4, 8] as const;
const ROLE_TEAM_ROLES = [1, 2, 3, 4] as const;

export const ROLE_ACCESS_BY_PATH: Record<string, readonly number[]> = {
  "/order": ORDER_ROLES,
  "/material-report": [2, 3, 4, 5, 7],
  "/production-report": [2, 3, 4, 5, 7],
  "/production-log": [2, 3, 4, 5, 7],
  "/dashboard": DASHBOARD_ROLES,
  "/admin": LEADERSHIP_ROLES,
  "/formula": LEADERSHIP_ROLES,
  "/ingredient": LEADERSHIP_ROLES,
  "/product": LEADERSHIP_ROLES,
  "/profile": [6],
  "/warehouse": [6],
  "/manage": MANAGEMENT_ROLES,
  "/manage/user": USER_MANAGEMENT_ROLES,
  "/manage/role": ROLE_TEAM_ROLES,
};

export const getWorkplacePath = (role: number): string => {
  switch (role) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return "/dashboard";
    case 6:
      return "/warehouse";
    case 7:
      return "/order";
    case 8:
      return "/manage/user";
    default:
      return "/403";
  }
};

export const canAccessPath = (path: string, role: number): boolean =>
  ROLE_ACCESS_BY_PATH[path]?.includes(role) ?? false;

export const getAllowedRoles = (path: string): number[] => [
  ...(ROLE_ACCESS_BY_PATH[path] ?? []),
];
