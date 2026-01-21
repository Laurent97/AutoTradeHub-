/**
 * Database Seeding Script
 * 
 * This script seeds your Supabase database with sample products.
 * Run with: npx tsx scripts/seed-database.ts
 * 
 * Make sure your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables!');
  console.log('Make sure your .env file has:');
  console.log('  VITE_SUPABASE_URL');
  console.log('  VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const sampleProducts = [
  {
    sku: 'CAR-001',
    title: 'Toyota Land Cruiser 2023',
    description:
      'Excellent condition Toyota Land Cruiser with full service history. Low mileage and well-maintained. Perfect for adventure and family trips.',
    category: 'car',
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2023,
    mileage: 15000,
    condition: 'used',
    original_price: 85000.0,
    quantity_available: 1,
    specifications: {
      engine: '4.6L V8',
      transmission: 'Automatic',
      fuel: 'Petrol',
      color: 'White',
      drive: '4WD',
      seats: 7,
      features: ['Navigation', 'Leather Seats', 'Sunroof', 'Safety Systems'],
    },
    images: [
      'https://images.unsplash.com/photo-1566471771134-5d6d09f4a6b5?w=800&auto=format&fit=crop',
    ],
  },
  {
    sku: 'CAR-002',
    title: 'BMW X5 2022',
    description:
      'Premium BMW X5 with all luxury features. One owner, no accidents. Excellent condition inside and out.',
    category: 'car',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    mileage: 22000,
    condition: 'used',
    original_price: 72000.0,
    quantity_available: 1,
    specifications: {
      engine: '3.0L I6',
      transmission: 'Automatic',
      fuel: 'Diesel',
      color: 'Black',
      drive: 'AWD',
      seats: 5,
      features: ['Navigation', 'Leather', 'Premium Sound'],
    },
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
    ],
  },
  {
    sku: 'CAR-003',
    title: 'Mercedes-Benz G-Class 2023',
    description: 'Luxury G-Class SUV in perfect condition. All features included. Low mileage.',
    category: 'car',
    make: 'Mercedes-Benz',
    model: 'G-Class',
    year: 2023,
    mileage: 8000,
    condition: 'used',
    original_price: 165000.0,
    quantity_available: 1,
    specifications: {
      engine: '4.0L V8',
      transmission: 'Automatic',
      fuel: 'Petrol',
      color: 'Silver',
      drive: '4WD',
      seats: 5,
    },
    images: [
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&auto=format&fit=crop',
    ],
  },
  {
    sku: 'CAR-004',
    title: 'Porsche 911 Carrera 2021',
    description:
      "Sports car enthusiast's dream. Well-maintained Porsche 911 with premium features.",
    category: 'car',
    make: 'Porsche',
    model: '911',
    year: 2021,
    mileage: 18000,
    condition: 'used',
    original_price: 145000.0,
    quantity_available: 1,
    specifications: {
      engine: '3.0L Flat-6',
      transmission: 'Automatic',
      fuel: 'Petrol',
      color: 'Red',
      drive: 'RWD',
      seats: 2,
    },
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
    ],
  },
  {
    sku: 'PART-001',
    title: 'Toyota Brake Pads Set (Front & Rear)',
    description:
      'High-quality brake pads for Toyota vehicles. OEM equivalent. Perfect for safe braking.',
    category: 'part',
    make: 'Toyota',
    model: null,
    year: null,
    mileage: null,
    condition: 'new',
    original_price: 89.99,
    quantity_available: 50,
    specifications: {
      compatibility: 'Toyota Camry 2018-2023, Corolla 2019-2023',
      material: 'Ceramic',
      warranty: '2 years',
      installation: 'Professional recommended',
    },
    images: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format&fit=crop',
    ],
  },
  {
    sku: 'PART-002',
    title: 'Performance Exhaust System',
    description:
      'Stainless steel performance exhaust system. Improves engine efficiency and sound.',
    category: 'part',
    make: null,
    model: null,
    year: null,
    mileage: null,
    condition: 'new',
    original_price: 1200.0,
    quantity_available: 15,
    specifications: {
      material: 'Stainless Steel',
      type: 'Cat-back',
      compatibility: 'Universal with modifications',
      warranty: '5 years',
    },
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    ],
  },
  {
    sku: 'PART-003',
    title: 'Turbo Engine Kit',
    description:
      'Complete turbocharger kit with all necessary components. Significant power increase.',
    category: 'part',
    make: null,
    model: null,
    year: null,
    mileage: null,
    condition: 'new',
    original_price: 3500.0,
    quantity_available: 10,
    specifications: {
      power_increase: '+150HP',
      installation: 'Professional required',
      warranty: '1 year',
      compatibility: 'Universal',
    },
    images: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop',
    ],
  },
  {
    sku: 'ACC-001',
    title: 'LED Headlight Set',
    description:
      'Premium LED headlight conversion kit. Brighter light and longer lifespan than halogen.',
    category: 'accessory',
    make: null,
    model: null,
    year: null,
    mileage: null,
    condition: 'new',
    original_price: 289.0,
    quantity_available: 75,
    specifications: {
      type: 'H4/H7/H11',
      color_temperature: '6000K',
      lifespan: '50000 hours',
      installation: 'Plug and play',
      warranty: '2 years',
    },
    images: [
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&auto=format&fit=crop',
    ],
  },
  {
    sku: 'ACC-002',
    title: 'Carbon Fiber Steering Wheel',
    description:
      'Lightweight carbon fiber steering wheel. Sporty design with racing heritage.',
    category: 'accessory',
    make: null,
    model: null,
    year: null,
    mileage: null,
    condition: 'new',
    original_price: 850.0,
    quantity_available: 20,
    specifications: {
      material: 'Carbon Fiber',
      diameter: '350mm',
      installation: 'Professional recommended',
      warranty: '1 year',
    },
    images: [
      'https://images.unsplash.com/photo-1449130505668-e4cdce0b94b7?w=800&auto=format&fit=crop',
    ],
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  // Check connection
  const { data: healthCheck, error: healthError } = await supabase
    .from('products')
    .select('count')
    .limit(1);

  if (healthError && healthError.code !== 'PGRST116') {
    console.error('❌ Cannot connect to database:', healthError.message);
    console.log('\nPlease ensure:');
    console.log('1. Your Supabase project is active');
    console.log('2. The database schema has been run');
    console.log('3. Your service role key is correct\n');
    process.exit(1);
  }

  console.log('✅ Connected to Supabase\n');

  // Insert products
  console.log('📦 Inserting products...\n');
  let successCount = 0;
  let errorCount = 0;

  for (const product of sampleProducts) {
    const { error } = await supabase.from('products').upsert(product, {
      onConflict: 'sku',
      ignoreDuplicates: false,
    });

    if (error) {
      console.error(`  ❌ ${product.sku}: ${error.message}`);
      errorCount++;
    } else {
      console.log(`  ✅ ${product.title}`);
      successCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`\n🎉 Seeding complete!\n`);

  // Show total products count
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`📦 Total products in database: ${count || 0}\n`);
}

seedDatabase().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
