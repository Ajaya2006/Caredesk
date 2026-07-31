// Map to store consistent avatar URLs per patient ID
const avatarCache = new Map();

// Unsplash image collections (healthcare/people themed)
const UNSPLASH_IDS = [
  '1Ck9g5Jp3d4',  // Doctor/Patient
  '2Z1ZxQ1g7w8',  // Medical professional
  '3Z3ZxQ1g7w8',  // Healthcare worker
  '4Ck9g5Jp3d4',  // Patient smiling
  '5Z1ZxQ1g7w8',  // Doctor with stethoscope
  '6Ck9g5Jp3d4',  // Patient consultation
  '7Z1ZxQ1g7w8',  // Healthcare team
  '8Ck9g5Jp3d4',  // Patient happy
  '9Z1ZxQ1g7w8',  // Medical professional
  '10Ck9g5Jp3d4'  // Healthcare worker
];

// Fallback avatar colors if image fails to load
const FALLBACK_COLORS = [
  '#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626',
  '#0891B2', '#BE185D', '#65A30D', '#4338CA', '#0F766E'
];

export const getPatientAvatar = (patientId, name = 'Patient') => {
  // Check cache first
  if (avatarCache.has(patientId)) {
    return avatarCache.get(patientId);
  }

  // Generate consistent index based on patient ID
  const idString = String(patientId);
  let hash = 0;
  for (let i = 0; i < idString.length; i++) {
    hash = idString.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % UNSPLASH_IDS.length;

  // Use Unsplash image with consistent ID
  const imageUrl = `https://images.unsplash.com/photo-${UNSPLASH_IDS[index]}?w=150&h=150&fit=crop&crop=face&auto=format&q=80`;
  
  // Cache the URL
  avatarCache.set(patientId, imageUrl);
  
  return imageUrl;
};

export const getFallbackColor = (patientId) => {
  const idString = String(patientId);
  let hash = 0;
  for (let i = 0; i < idString.length; i++) {
    hash = idString.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[index];
};

// Preload avatars for a list of patients
export const preloadPatientAvatars = (patients) => {
  patients.forEach(patient => {
    if (patient.patient_id) {
      getPatientAvatar(patient.patient_id);
    }
  });
};