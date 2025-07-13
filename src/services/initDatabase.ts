import { databaseService } from './database';
import { SeedDataService } from './seedData';

export class DatabaseInitializer {
  static async initialize(): Promise<void> {
    try {
      console.log('Initializing database...');
      
      // Connect to database
      await databaseService.connect();
      
      // Check if data already exists
      const companies = await databaseService.getAllCompanies();
      
      if (companies.length === 0) {
        console.log('No existing data found. Seeding database...');
        await SeedDataService.seedAllData();
        console.log('Database seeded successfully!');
      } else {
        console.log('Database already contains data. Skipping seeding.');
      }
      
      console.log('Database initialization completed!');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  static async reset(): Promise<void> {
    try {
      console.log('Resetting database...');
      
      // Connect to database
      await databaseService.connect();
      
      // Clear and reseed data
      await SeedDataService.resetDatabase();
      
      console.log('Database reset completed!');
    } catch (error) {
      console.error('Database reset failed:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      await databaseService.disconnect();
      console.log('Database disconnected successfully!');
    } catch (error) {
      console.error('Database disconnection failed:', error);
      throw error;
    }
  }
} 