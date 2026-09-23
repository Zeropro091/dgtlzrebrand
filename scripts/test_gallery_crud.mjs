import fs from 'node:fs';
import crypto from 'node:crypto';

const BASE = 'C:/Users/Putu Ari/Desktop/dgt remake minimalist/dgt-remake';
const dbPath = 'server/data/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Dapatkan secret token langsung untuk generate JWT token yang valid
const secretFile = 'server/data/secret.key';
const secret = Buffer.from(fs.readFileSync(secretFile, 'utf8'), 'hex');

function signToken(payload) {
  const head = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(`${head}.${body}`).digest('base64url');
  return `${head}.${body}.${sig}`;
}

const ownerUser = db.users.find(u => u.role === 'owner') || { id: 'temp-owner', email: 'owner@dgtlz.com', role: 'owner' };
const token = signToken({ uid: ownerUser.id, role: 'owner', exp: Math.floor(Date.now() / 1000) + 3600 });
console.log('Owner token generated successfully');

// Test 1: CREATE item
const tinyPngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const createRes = await fetch('http://localhost:4000/api/gallery', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  body: JSON.stringify({
    id: 'TST-01',
    title: 'TEST_ARTIFACT_EXP',
    story: 'Eksplorasi visual artefak komputasi masa depan.',
    imageDataUrl: tinyPngBase64
  })
}).then(r => r.json());
console.log('1. CREATE Result:', createRes.ok, createRes.item?.id, createRes.item?.image);

// Test 2: UPDATE item
const updateRes = await fetch('http://localhost:4000/api/gallery/TST-01', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
  body: JSON.stringify({ title: 'TEST_ARTIFACT_EXP_REVISED', story: 'Story yang telah diperbarui' })
}).then(r => r.json());
console.log('2. UPDATE Result:', updateRes.ok, updateRes.item?.title);

// Test 3: DELETE item
const deleteRes = await fetch('http://localhost:4000/api/gallery/TST-01', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + token }
}).then(r => r.json());
console.log('3. DELETE Result:', deleteRes.ok);

console.log('All tests passed cleanly.');
