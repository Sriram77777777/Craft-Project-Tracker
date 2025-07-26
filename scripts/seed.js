import dbConnect from '../lib/mongodb.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Supply from '../models/Supply.js';
import bcrypt from 'bcryptjs';

const seedData = {
  users: [
    {
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123'
    }
  ],
  projects: [
    {
      name: 'Baby Blanket for Sarah',
      description: 'A soft and cozy baby blanket for my friend\'s new baby. Using pastel colors with a simple granny square pattern.',
      startDate: new Date('2024-01-15'),
      dueDate: new Date('2024-03-01'),
      supplies: ['Baby yarn in pink', 'Baby yarn in white', 'Size H crochet hook'],
      progress: 75,
      status: 'ongoing',
      isImportant: true,
      tasks: [
        { title: 'Buy yarn and materials', completed: true },
        { title: 'Create granny squares', completed: true },
        { title: 'Join squares together', completed: false },
        { title: 'Add border', completed: false },
        { title: 'Weave in ends', completed: false }
      ]
    },
    {
      name: 'Sweater for Winter',
      description: 'Knitting a warm cable-knit sweater for the upcoming winter season. Following a traditional Aran pattern.',
      startDate: new Date('2024-02-01'),
      dueDate: new Date('2024-11-15'),
      supplies: ['Worsted weight wool yarn', 'Knitting needles size 8', 'Cable needle', 'Stitch markers'],
      progress: 25,
      status: 'ongoing',
      isImportant: false,
      tasks: [
        { title: 'Create gauge swatch', completed: true },
        { title: 'Cast on and knit back', completed: true },
        { title: 'Knit front panel', completed: false },
        { title: 'Knit sleeves', completed: false },
        { title: 'Seam pieces together', completed: false }
      ]
    },
    {
      name: 'Quilted Table Runner',
      description: 'A beautiful autumn-themed table runner with maple leaf appliques for the dining room.',
      startDate: new Date('2023-09-01'),
      dueDate: new Date('2023-11-20'),
      supplies: ['Cotton fabric - orange', 'Cotton fabric - brown', 'Cotton fabric - gold', 'Batting', 'Thread'],
      progress: 100,
      status: 'completed',
      isImportant: false,
      tasks: [
        { title: 'Design pattern', completed: true },
        { title: 'Cut fabric pieces', completed: true },
        { title: 'Applique leaves', completed: true },
        { title: 'Assemble layers', completed: true },
        { title: 'Quilt and bind', completed: true }
      ]
    },
    {
      name: 'Embroidered Pillowcases',
      description: 'Hand-embroidered pillowcases with floral motifs for the guest bedroom.',
      startDate: new Date('2024-01-10'),
      supplies: ['White cotton pillowcases', 'Embroidery floss', 'Embroidery hoops', 'Transfer paper'],
      progress: 40,
      status: 'paused',
      isImportant: false,
      tasks: [
        { title: 'Transfer patterns', completed: true },
        { title: 'Embroider first pillowcase', completed: false },
        { title: 'Embroider second pillowcase', completed: false },
        { title: 'Finish edges', completed: false }
      ]
    },
    {
      name: 'Christmas Stockings',
      description: 'Knitted Christmas stockings for the whole family. Planning to make four matching stockings.',
      startDate: new Date('2024-10-01'),
      dueDate: new Date('2024-12-20'),
      supplies: ['Red yarn', 'White yarn', 'Green yarn', 'Double-pointed needles'],
      progress: 10,
      status: 'planning',
      isImportant: true,
      tasks: [
        { title: 'Choose stocking pattern', completed: true },
        { title: 'Buy yarn in family colors', completed: false },
        { title: 'Knit first stocking', completed: false },
        { title: 'Knit remaining stockings', completed: false },
        { title: 'Add names/decorations', completed: false }
      ]
    }
  ],
  supplies: [
    {
      name: 'Baby Yarn - Pink',
      category: 'yarn',
      quantity: 3,
      unit: 'skeins',
      color: 'Soft Pink',
      notes: 'Acrylic yarn, machine washable'
    },
    {
      name: 'Baby Yarn - White',
      category: 'yarn',
      quantity: 2,
      unit: 'skeins',
      color: 'Pure White',
      notes: 'Acrylic yarn, machine washable'
    },
    {
      name: 'Worsted Weight Wool',
      category: 'yarn',
      quantity: 8,
      unit: 'skeins',
      color: 'Charcoal Gray',
      notes: 'Merino wool blend, hand wash only'
    },
    {
      name: 'Cotton Fabric - Orange',
      category: 'fabric',
      quantity: 2,
      unit: 'yards',
      color: 'Burnt Orange',
      notes: 'Quilting cotton, pre-washed'
    },
    {
      name: 'Cotton Fabric - Brown',
      category: 'fabric',
      quantity: 1.5,
      unit: 'yards',
      color: 'Chocolate Brown',
      notes: 'Quilting cotton, pre-washed'
    },
    {
      name: 'Embroidery Floss Set',
      category: 'thread',
      quantity: 1,
      unit: 'set',
      color: 'Assorted',
      notes: '50 color pack, 6-strand cotton floss'
    },
    {
      name: 'Crochet Hook Set',
      category: 'tools',
      quantity: 1,
      unit: 'set',
      color: 'Silver',
      notes: 'Aluminum hooks, sizes B through K'
    },
    {
      name: 'Knitting Needles - Size 8',
      category: 'needles',
      quantity: 1,
      unit: 'pair',
      color: 'Bamboo',
      notes: 'Circular needles, 29 inch cable'
    },
    {
      name: 'Quilting Batting',
      category: 'other',
      quantity: 2,
      unit: 'yards',
      color: 'Natural',
      notes: '100% cotton batting, low loft'
    },
    {
      name: 'Stitch Markers',
      category: 'tools',
      quantity: 20,
      unit: 'pieces',
      color: 'Assorted',
      notes: 'Split ring markers for knitting'
    }
  ]
};

async function seed() {
  try {
    await dbConnect();
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Supply.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create demo user
    const hashedPassword = await bcrypt.hash(seedData.users[0].password, 12);
    const user = await User.create({
      ...seedData.users[0],
      password: hashedPassword
    });
    
    console.log('Created demo user:', user.email);
    
    // Create supplies
    const supplies = await Supply.insertMany(
      seedData.supplies.map(supply => ({ ...supply, user: user._id }))
    );
    
    console.log(`Created ${supplies.length} supplies`);
    
    // Create projects
    const projects = await Project.insertMany(
      seedData.projects.map(project => ({ ...project, user: user._id }))
    );
    
    console.log(`Created ${projects.length} projects`);
    
    console.log('Seed data created successfully!');
    console.log('Demo user credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run the seed function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seed;
