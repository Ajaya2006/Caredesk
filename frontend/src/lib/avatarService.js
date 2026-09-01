// frontend/src/lib/avatarService.js

// Map to store consistent avatar URLs per ID
const avatarCache = new Map();

// High-quality Unsplash healthcare/people images
const UNSPLASH_IMAGES = [
  {
    id: '1Ck9g5Jp3d4',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'doctor'
  },
  {
    id: '2Z1ZxQ1g7w8',
    url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'doctor'
  },
  {
    id: '3Z3ZxQ1g7w8',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'doctor'
  },
  {
    id: '4Ck9g5Jp3d4',
    url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'patient'
  },
  {
    id: '5Z1ZxQ1g7w8',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'patient'
  },
  {
    id: '6Ck9g5Jp3d4',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'doctor'
  },
  {
    id: '7Z1ZxQ1g7w8',
    url: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'doctor'
  },
  {
    id: '8Ck9g5Jp3d4',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'patient'
  },
  {
    id: '9Z1ZxQ1g7w8',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'patient'
  },
  {
    id: '10Ck9g5Jp3d4',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'doctor'
  },
  {
    id: '11Z1ZxQ1g7w8',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'patient'
  },
  {
    id: '12Ck9g5Jp3d4',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'patient'
  },
  {
    id: '13Z1ZxQ1g7w8',
    url: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'doctor'
  },
  {
    id: '14Ck9g5Jp3d4',
    url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'patient'
  },
  {
    id: '15Z1ZxQ1g7w8',
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    category: 'doctor'
  }
];

// Fallback avatar colors
const FALLBACK_COLORS = [
  '#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626',
  '#0891B2', '#BE185D', '#65A30D', '#4338CA', '#0F766E',
  '#B91C1C', '#1D4ED8', '#047857', '#B45309', '#6D28D9'
];

// Generate consistent hash from string
const getHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Get avatar for any entity (patient, doctor, user)
export const getAvatar = (id, name = 'User', type = 'patient') => {
  const idString = String(id);
  const cacheKey = `${type}_${idString}`;
  
  // Check cache first
  if (avatarCache.has(cacheKey)) {
    return avatarCache.get(cacheKey);
  }

  // Generate consistent index based on ID
  const hash = getHash(idString);
  
  // Filter images by type if specified, or use all
  let availableImages = UNSPLASH_IMAGES;
  if (type === 'doctor') {
    availableImages = UNSPLASH_IMAGES.filter(img => img.category === 'doctor');
  } else if (type === 'patient') {
    availableImages = UNSPLASH_IMAGES.filter(img => img.category === 'patient');
  }
  
  // If no images of specific type, use all
  if (availableImages.length === 0) {
    availableImages = UNSPLASH_IMAGES;
  }
  
  const index = hash % availableImages.length;
  const imageUrl = availableImages[index].url;
  
  // Cache the URL
  avatarCache.set(cacheKey, imageUrl);
  
  return imageUrl;
};

// Get avatar for patient
export const getPatientAvatar = (patientId, name = 'Patient') => {
  return getAvatar(patientId, name, 'patient');
};

// Get avatar for doctor
export const getDoctorAvatar = (doctorId, name = 'Doctor') => {
  return getAvatar(doctorId, name, 'doctor');
};

// Get fallback color for avatar initials
export const getFallbackColor = (id) => {
  const idString = String(id);
  const hash = getHash(idString);
  const index = hash % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[index];
};

// Get user avatar (for navbar)
export const getUserAvatar = (user) => {
  // If user has a profile image (from Google), use it
  if (user?.profile_image) {
    return user.profile_image;
  }
  
  // If user has an email, use gravatar or generate
  if (user?.email) {
    // For Google users, they'll have a picture
    // For regular users, use initials with fallback
    return null;
  }
  
  return null;
};

// Preload avatars for a list
export const preloadAvatars = (items, type = 'patient') => {
  items.forEach(item => {
    const id = item.patient_id || item.doctor_id || item.id;
    if (id) {
      getAvatar(id, item.patient_name || item.doctor_name || item.name, type);
    }
  });
};

// Preload patient avatars (legacy)
export const preloadPatientAvatars = (patients) => {
  return preloadAvatars(patients, 'patient');
};

// Preload doctor avatars
export const preloadDoctorAvatars = (doctors) => {
  return preloadAvatars(doctors, 'doctor');
};