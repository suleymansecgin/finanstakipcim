import * as SQLite from 'expo-sqlite';
import { Subscription } from '@/types';

const db = SQLite.openDatabaseSync('subscriptions.db');

export const initDB = () => {
    try {
        db.execSync(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        currency TEXT NOT NULL,
        billingCycle TEXT NOT NULL,
        startDate TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT,
        duration REAL
      );
    `);

        // Migration: Add duration column if it doesn't exist
        try {
            db.execSync('ALTER TABLE subscriptions ADD COLUMN duration REAL');
            console.log('Migration successful: Added duration column');
        } catch (error) {
            // Ignore error if column already exists
            // console.log('Migration note: duration column likely already exists');
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export const addSubscriptionToDB = (subscription: Subscription) => {
    try {
        const { id, name, price, currency, billingCycle, startDate, category, image, duration } = subscription;
        db.runSync(
            `INSERT INTO subscriptions (id, name, price, currency, billingCycle, startDate, category, image, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, name, price, currency, billingCycle, startDate, category, image ?? null, duration ?? null]
        );
        console.log('Subscription added to DB:', id);
    } catch (error) {
        console.error('Error adding subscription to DB:', error);
        throw error;
    }
};

export const getSubscriptionsFromDB = (): Subscription[] => {
    try {
        const result = db.getAllSync<Subscription>('SELECT * FROM subscriptions');
        return result;
    } catch (error) {
        console.error('Error fetching subscriptions from DB:', error);
        return [];
    }
};

export const deleteSubscriptionFromDB = (id: string) => {
    try {
        db.runSync('DELETE FROM subscriptions WHERE id = ?', [id]);
        console.log('Subscription deleted from DB:', id);
    } catch (error) {
        console.error('Error deleting subscription from DB:', error);
        throw error;
    }
};

export const updateSubscriptionInDB = (subscription: Subscription) => {
    try {
        const { id, name, price, currency, billingCycle, startDate, category, image, duration } = subscription;
        db.runSync(
            `UPDATE subscriptions SET name = ?, price = ?, currency = ?, billingCycle = ?, startDate = ?, category = ?, image = ?, duration = ? WHERE id = ?`,
            [name, price, currency, billingCycle, startDate, category, image ?? null, duration ?? null, id]
        );
        console.log('Subscription updated in DB:', id);
    } catch (error) {
        console.error('Error updating subscription in DB:', error);
        throw error;
    }
};

export const clearDatabase = () => {
    try {
        db.runSync('DELETE FROM subscriptions');
        console.log('Database cleared');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
};
