const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Category = require('../models/Category');
const Food = require('../models/Food');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college_canteen';
    console.log(`🌱 Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully.');

    // 1. Clear existing User, Category, Food (leave Orders untouched)
    console.log('🧹 Clearing existing Users, Categories, and Foods...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Food.deleteMany({});
    console.log('✅ Cleared existing collections.');

    // 2. Create 5 Categories
    console.log('📦 Creating categories...');
    const categoryData = [
      {
        name: 'Snacks',
        description: 'Quick bites, savory finger foods, and warm treats for in-between breaks.',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Snacks',
        isActive: true,
      },
      {
        name: 'Main Course',
        description: 'Hearty, wholesome, and satisfying lunch and dinner meals.',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Main+Course',
        isActive: true,
      },
      {
        name: 'Beverages',
        description: 'Chilled refreshments, warm brews, and energizing specialty drinks.',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Beverages',
        isActive: true,
      },
      {
        name: 'Fast Food',
        description: 'Fresh burgers, cheesy slices, and crispy fries made to order.',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Fast+Food',
        isActive: true,
      },
      {
        name: 'Combos',
        description: 'Value meal packs and traditional platter combos that hit the spot.',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Combos',
        isActive: true,
      },
    ];

    const categories = await Category.insertMany(categoryData);
    console.log(`✅ Created ${categories.length} categories.`);

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // 3. Create Admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@canteen.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    console.log(`👤 Creating admin user: ${adminEmail}...`);
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword, // pre-save hook in User model will hash this
      role: 'admin',
      phone: '9876543210',
      studentId: 'ADMIN-01',
      isActive: true,
    });
    console.log(`✅ Admin user created: ${adminUser.email}`);

    // 4. Create 12 Food items
    console.log('🍔 Creating food items...');
    const foodItemsData = [
      {
        name: 'Veg Burger',
        description: 'Crispy spiced vegetable patty nestled with fresh lettuce, sliced tomatoes, and creamy tangy mayo inside a toasted sesame bun.',
        price: 80,
        category: categoryMap['Fast Food'],
        stock: 50,
        isAvailable: true,
        preparationTime: '10-15 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Veg+Burger',
      },
      {
        name: 'Cheese Sandwich',
        description: 'Golden grilled sandwich stuffed with melted cheddar, fresh cucumber, tomatoes, and house mint chutney.',
        price: 60,
        category: categoryMap['Snacks'],
        stock: 30,
        isAvailable: true,
        preparationTime: '10-15 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Cheese+Sandwich',
      },
      {
        name: 'Masala Dosa',
        description: 'Crispy fermented rice-lentil crepe wrapped around a fragrant spiced potato filling, served hot with coconut chutney and tangy sambar.',
        price: 70,
        category: categoryMap['Main Course'],
        stock: 40,
        isAvailable: true,
        preparationTime: '10-15 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Masala+Dosa',
      },
      {
        name: 'Veg Fried Rice',
        description: 'Wok-tossed long-grain basmati rice with crunchy bell peppers, carrots, spring onions, and a splash of aromatic soy garlic sauce.',
        price: 90,
        category: categoryMap['Main Course'],
        stock: 35,
        isAvailable: true,
        preparationTime: '10-15 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Veg+Fried+Rice',
      },
      {
        name: 'Paneer Roll',
        description: 'Succulent marinated paneer cubes tossed in tandoori spices and wrapped inside a soft flaky paratha with sliced red onions and mint sauce.',
        price: 75,
        category: categoryMap['Snacks'],
        stock: 25,
        isAvailable: true,
        preparationTime: '10-15 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Paneer+Roll',
      },
      {
        name: 'Samosa',
        description: 'Classic deep-fried triangular pastry crust bursting with a spiced potato and green pea filling, served with sweet tamarind and spicy coriander chutneys.',
        price: 20,
        category: categoryMap['Snacks'],
        stock: 100,
        isAvailable: true,
        preparationTime: '5-10 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Samosa',
      },
      {
        name: 'French Fries',
        description: 'Golden, crispy potato fries lightly seasoned with sea salt and herbs, served steaming hot with ketchup.',
        price: 60,
        category: categoryMap['Fast Food'],
        stock: 60,
        isAvailable: true,
        preparationTime: '10-15 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=French+Fries',
      },
      {
        name: 'Cold Coffee',
        description: 'Velvety chilled brew blended with rich milk, sweet cream, and topped with chocolate drizzle.',
        price: 70,
        category: categoryMap['Beverages'],
        stock: 50,
        isAvailable: true,
        preparationTime: '10-15 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Cold+Coffee',
      },
      {
        name: 'Tea',
        description: 'Authentic Indian cutting chai brewed with aromatic ginger, cardamom, crushed spices, and fresh milk.',
        price: 15,
        category: categoryMap['Beverages'],
        stock: 200,
        isAvailable: true,
        preparationTime: '2-5 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Tea',
      },
      {
        name: 'Fresh Lime Soda',
        description: 'Zesty hand-squeezed fresh lime juice infused with bubbly chilled soda, rock salt, and mint leaves.',
        price: 40,
        category: categoryMap['Beverages'],
        stock: 80,
        isAvailable: true,
        preparationTime: '10-15 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Fresh+Lime+Soda',
      },
      {
        name: 'Pizza',
        description: 'Hand-stretched personal 8-inch pizza loaded with rich tomato marinara, mozzarella cheese, bell peppers, onions, and sweet corn.',
        price: 150,
        category: categoryMap['Fast Food'],
        stock: 20,
        isAvailable: true,
        preparationTime: '15-20 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Pizza',
      },
      {
        name: 'Veg Thali',
        description: 'A complete hearty platter featuring paneer curry, seasonal dal, steamed basmati rice, 2 warm rotis, salad, and a sweet treat.',
        price: 120,
        category: categoryMap['Combos'],
        stock: 30,
        isAvailable: true,
        preparationTime: '15-20 mins',
        image: 'https://placehold.co/400x300/f97316/ffffff?text=Veg+Thali',
      },
    ];

    const foods = await Food.insertMany(foodItemsData);
    console.log(`✅ Created ${foods.length} food items.`);

    console.log('🎉 Database seeding completed successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    try {
      await mongoose.connection.close();
    } catch (e) {
      // ignore
    }
    process.exit(1);
  }
};

seedData();
