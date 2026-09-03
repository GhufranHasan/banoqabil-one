import { dbStore } from '../lib/demo-data';

const state = dbStore.reset();
console.log('state.students.length:', state.students.length);
console.log('state.enrollments.length:', state.enrollments.length);
const found = state.enrollments.find(e => e.id === 'enr-noshow-1');
console.log('enr-noshow-1 in state.enrollments?', Boolean(found));
const idx = state.enrollments.findIndex(e => e.id === 'enr-noshow-1');
console.log('index of enr-noshow-1 in state.enrollments:', idx);
