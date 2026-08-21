// [BEGIN COMMIT: previous state before merge conflict]
import { Router } from 'next/router';

// [MODIFIED: resolve REACT_015 accessibility issue]
const routes = [{
  name: 'Home',
  page: '/',
  meta: { lang: 'English' }
}, {
  name: 'About',
  page: '/about',
  meta: { lang: 'English' }
}];

export default function routes() {
  return routes;
}

// [UNCHANGED: existing exports]
export { 
  HAUSDOMAN_001_SIGNUP_COMPLETE,
  HAUSDOMAN_002_SIGNUP_CONFIRMATION,
  HAUSDOMAN_003_SIGNUP_ERROR,
  HAUSDOMAN_004_SIGNUP_INFORMATION,
  HAUSDOMAN_005_SIGNUP_INFORMATION_CONFIRMED,
  HAUSDOMAN_006_SIGNUP