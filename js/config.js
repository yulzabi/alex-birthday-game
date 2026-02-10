/**
 * config.js - הגדרות המשחק
 * כל הקבועים, סוגי הפריטים והודעות העידוד
 */

var Config = {
    // מבנה שלבים
    ITEMS_PER_LEVEL: 10,
    TOTAL_LEVELS: 3,
    TOTAL_ITEMS: 30, // ITEMS_PER_LEVEL * TOTAL_LEVELS

    // סוגי פריטים לאיסוף
    ITEM_TYPES: [
        { emoji: '🎁', points: 10 },  // מתנה
        { emoji: '⭐', points: 5 },   // כוכב
        { emoji: '🎂', points: 20 },  // עוגה
        { emoji: '🎈', points: 5 },   // בלון
        { emoji: '💖', points: 15 },  // לב
        { emoji: '🍭', points: 10 },  // ממתק
        { emoji: '🦋', points: 10 },  // פרפר
        { emoji: '🌈', points: 25 },  // קשת
        { emoji: '🧁', points: 15 },  // קאפקייק
        { emoji: '👑', points: 30 },  // כתר
    ],

    // צבעי רקע לכל שלב
    LEVEL_COLORS: [
        ['#87CEEB', '#E0F7FA', '#C8E6C9'], // שלב 1 - כחול-ירוק
        ['#DDA0DD', '#F8BBD0', '#FCE4EC'], // שלב 2 - ורוד
        ['#FFD700', '#FFF8E1', '#FFFDE7'], // שלב 3 - זהוב
    ],

    // הודעות עידוד בעברית
    ENCOURAGEMENTS: [
        '!כל הכבוד 🌟',
        '!מדהים 🎉',
        '!כוכבת ✨',
        '!יופי 💖',
        '!סחטיין 🏆',
        '!מלכה 👑',
        '!וואו 🤩',
        '!מעולה 🎈',
    ],

    // צבעים לקונפטי וניצוצות
    COLORS: ['#FF6FB7', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#FFD700'],

    // צבעי קשת
    RAINBOW: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
};
