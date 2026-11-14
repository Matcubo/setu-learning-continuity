# SETU visual and workflow upgrade

## Updated
- Distinctive responsive landing page with educational transition illustration, impact narrative, and action buttons.
- Workspace sidebar, improved teacher dashboard, meaningful status chips, search/filter case management.
- Better fictional transition creation flow; source/destination state matches the selected curriculum.
- Student case view now has an evidence-aware topic comparison, teacher observation entry, supporting/unknown distinctions, and usable four-week planning (Week 4 is an actual review rather than empty).
- Weekly objectives, activities, assessment and teacher comments are editable and saved locally. Approval is only offered after generating a plan; editing invalidates approval.
- Local-only report modal with browser print / Save PDF.
- Rules-based demo explicitly identified. **No AI runtime is connected.**
- Removed broken dashboard report action.
- Local data initialization no longer re-seeds cases after the last case is deleted.

## Run
```
npm install
npm run dev
npm run build
```

## Notes
The sample curriculum is illustrative and only Class 6 topics are present. The grade selector is for workflow demonstration and does not change the sample topics. Do not enter real child information. This build uses browser localStorage and does not sync across devices.

## Next high-impact item
Connect one real AgentFoundry curriculum comparison agent through a secure server-side integration, and test against a labeled synthetic dataset. Do not market the existing rules engine as agentic AI.
