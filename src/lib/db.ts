import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

// Generic get all
export const getCollection = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Projects
export const getProjects = async () => {
  const q = query(collection(db, 'projects'), orderBy('order', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Skills
export const getSkills = async () => {
  const q = query(collection(db, 'skills'), orderBy('category', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Portfolio Info (assuming single document with id 'main')
export const getPortfolioInfo = async () => {
  const docRef = doc(db, 'portfolioInfo', 'main');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    // Default fallback
    return { name: "Sivaprakash M", title: "Full Stack Developer", about: "" };
  }
};

export const getAchievements = async () => {
  try {
    const q = query(collection(db, 'achievements'), orderBy('order', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching achievements, falling back to all:", err);
    return getCollection('achievements');
  }
};
export const getMessages = () => getCollection('contactMessages');

// Stats
export const getStats = async () => {
  try {
    const q = query(collection(db, 'stats'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching stats, falling back to all:", err);
    return getCollection('stats');
  }
};

// Timeline
export const getTimeline = async () => {
  try {
    const q = query(collection(db, 'timeline'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching timeline, falling back to all:", err);
    return getCollection('timeline');
  }
};

// Testimonials
export const getTestimonials = async () => {
  try {
    const q = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching testimonials, falling back to all:", err);
    return getCollection('testimonials');
  }
};

export const sendContact = async (data) => {
  const newDocRef = doc(collection(db, 'contactMessages'));
  await setDoc(newDocRef, { ...data, createdAt: new Date().toISOString(), read: false });
  return { success: true };
};

