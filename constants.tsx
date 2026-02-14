
import { Memory, Habit, Mood } from './types';

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Cozy Reading Night',
    content: "Finally finished that novel I started last month. There's something so peaceful about the sound of rain against the window while sipping chamomile tea.",
    date: 'Oct 23',
    time: '9:15 PM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsFI-RGQyo70W1SdwuVGFXbFLdeQkFuOHJdNYjy4ohlpujRHxK7MDFr-U2SG079lrNmrJWSwXmi7-mwNZBXjezUYH_GJGD-6hwL8vqky2PQSHUhaCLpe-ya1Qi-UEJZkB7wK_rrbuVX6yCkLq0oadh4FNa73e0e4kyGb84SDi2q9DYU1rJWMP5-LKtrA18AXXq6hytGa8o-IBAI2NmJzBylJ-BQ32KNcJL_Pxa-rURVCqPOiqwdvBGwPg_g9YZ1KRvOJOvy-zNfTOW',
    type: 'event',
    mood: 'Calm'
  },
  {
    id: '2',
    title: 'Park Walk & Sketches',
    content: "The autumn leaves are finally starting to turn! Took my sketchbook to the central park and spent two hours just drawing people passing by.",
    date: 'Oct 22',
    time: '2:30 PM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbKt60q4eDml1viYWBbEuOo31L4DqobtB7vA6daXXTZ0yoyTJhTzT92qma7qrf_oa2WuwTm57u_aA2K_O9Yop3IRHCh6OqsZF6eVqOgd5yggknbrs29ltOgDV3q0Ea4gPYxfOKnDFeiH_VD35W3spHSkU9jpKNojMptIE11RotyBATz4ZlNNkigD0qsIqb2YHDugQRa1DZ_7d3tRnbgtOTReJW5AzWuuqEmdsE54rwhN7_E-dS7OpDco4CmOdc13H3gAyuNWGT58L8',
    type: 'location',
    mood: 'Happy'
  },
  {
    id: '3',
    title: 'New Pasta Recipe!',
    content: "Managed to recreate that spicy vodka pasta from the restaurant. It turned out even better than I expected. Added a bit extra garlic...",
    date: 'Oct 21',
    time: '8:00 PM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpbtdYDvHssvn8uutPWuguFQHAO3fV7AyOqI3yFycV2uNLvVeHGY31kdKoDYSL_pAlHbvNvHsfYLGZdRat_VLNWeNIp64HW6gNQCNLn_6JUfJVDBy29rmd6R_FOYtR-xUnuUSbLvyQJ-LaUG9QVhKBOJYpruHQrql5Wfa0frC1F2qVj2kzm0Jpw5pv9JqieU4e7atCClB6zE8RizYbb93liyg9Nn5vb0Q1zSwFzWjuZmmN_T2Zn37MdotTuIkWL3bAlm9PBxrzMR4e',
    type: 'restaurant',
    mood: 'Excited'
  }
];

export const INITIAL_HABITS: Habit[] = [
  { id: 'h1', title: 'Drink Water', goal: '8 glasses', current: 4, total: 8, icon: 'water_drop', color: 'blue' },
  { id: 'h2', title: 'Meditate', goal: '10 minutes', current: 0, total: 1, icon: 'self_improvement', color: 'purple' },
  { id: 'h3', title: 'Read 10 Pages', goal: 'Daily', current: 1, total: 1, icon: 'menu_book', color: 'primary' },
  { id: 'h4', title: 'Morning Stretch', goal: '5 minutes', current: 0, total: 1, icon: 'fitness_center', color: 'orange' },
];

export const MOOD_EMOJIS: Record<Mood, string> = {
  Radiant: '🤩',
  Happy: '😊',
  Neutral: '😐',
  Sad: '😔',
  Awful: '😫',
  Excited: '🤩',
  Party: '🥳',
  Loved: '🥰',
  Calm: '😌'
};
