// usePlan - reads plan from the currentUser object passed as prop or from localStorage
// Since this app uses prop-drilling (no global store), we provide two ways to use this hook:
// 1. usePlan(currentUser) - pass the user directly
// 2. usePlanFromStorage() - reads from localStorage (fallback)

export type PlanLevel = 'free' | 'medium' | 'master';

const HIERARCHY: Record<string, number> = {
  free: 0,
  medium: 1,
  master: 2
};

export function usePlan(currentUser?: any) {
  // Try to get user from argument, or from localStorage
  let user = currentUser;
  if (!user) {
    try {
      const stored = localStorage.getItem('oracle_user');
      if (stored) user = JSON.parse(stored);
    } catch {}
  }

  const plan: PlanLevel = (user?.plan as PlanLevel) || 'free';
  const planExpiresAt: string | null = user?.planExpiresAt || null;
  const role: string = user?.role || 'aluno';

  const isExpired = (): boolean => {
    if (!planExpiresAt) return false;
    return new Date(planExpiresAt) < new Date();
  };

  const effectivePlan: PlanLevel = isExpired() ? 'free' : plan;

  const canAccess = (required: PlanLevel): boolean => {
    // TEMPORARY GLOBAL UNLOCK FOR TESTING (Requested by User)
    return true;

    // Original logic preserved below for future review:
    // if (role === 'admin') return true;
    // return (HIERARCHY[effectivePlan] ?? 0) >= (HIERARCHY[required] ?? 0);
  };

  return {
    plan: effectivePlan,
    rawPlan: plan,
    planExpiresAt,
    canAccess,
    isExpired: false, // isExpired(),
    isFree: false, // effectivePlan === 'free',
    isMedium: true, // effectivePlan === 'medium',
    isMaster: true, // effectivePlan === 'master',
    isAdmin: role === 'admin'
  };
}
