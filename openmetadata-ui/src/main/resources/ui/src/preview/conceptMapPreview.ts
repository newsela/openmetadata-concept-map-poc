/*
 *  Copyright 2026 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * LOCAL PREVIEW ONLY — not for production.
 *
 * When started with VITE_CM_PREVIEW=true, this seeds the application store as a
 * logged-in user and short-circuits the auth providers so the app chrome and the
 * Concept Map tab render without a backend. The Concept Map page itself makes no
 * API calls; all of its links point at the real OpenMetadata catalog.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useApplicationStore } from '../hooks/useApplicationStore';

export const CM_PREVIEW = import.meta.env.VITE_CM_PREVIEW === 'true';

let seeded = false;

export const seedConceptMapPreview = (): void => {
  if (!CM_PREVIEW || seeded) {
    return;
  }
  seeded = true;

  useApplicationStore.setState({
    authConfig: { provider: 'basic', enableSelfSignup: false } as any,
    currentUser: {
      id: 'concept-map-preview',
      name: 'preview',
      displayName: 'Concept Map Preview',
      email: 'preview@newsela.com',
    } as any,
    isApplicationLoading: false,
    isAuthDisabled: true,
    isAuthenticated: true,
    isAuthenticating: false,
  } as any);
};

seedConceptMapPreview();
