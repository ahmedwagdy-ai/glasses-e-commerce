const products = [
    {
        name: 'Classic Aviator',
        detail: 'Timeless style',
        description: 'High quality aviator sunglasses.',
        price: 150,
        countInStock: 20,
        numVisits: 120, // High visits
        numSales: 15,   // Moderate sales
    },
    {
        name: 'Modern Square',
        detail: 'Bold look',
        description: 'Square frame for a modern look.',
        price: 120,
        countInStock: 30,
        numVisits: 45,
        numSales: 35,   // High sales (Best Seller candidate)
    },
    {
        name: 'Round Retro',
        detail: 'Vintage vibes',
        description: 'Round glasses for a retro style.',
        price: 100,
        countInStock: 15,
        numVisits: 200, // Very high visits (Top Visited candidate)
        numSales: 10,
    },
    {
        name: 'Cat Eye',
        detail: 'Chic and stylish',
        description: 'Cat eye glasses for women.',
        price: 130,
        countInStock: 25,
        numVisits: 80,
        numSales: 25,
    },
    {
        name: 'Sporty Wrap',
        detail: 'For active lifestyle',
        description: 'Durable glasses for sports.',
        price: 90,
        countInStock: 50,
        numVisits: 30,
        numSales: 5,
    },
    {
        name: 'Blue Light Blocker',
        detail: 'Protect your eyes',
        description: 'Glasses to block blue light from screens.',
        price: 60,
        countInStock: 100,
        numVisits: 300, // Highest visits
        numSales: 50,   // Highest sales
    }
];

module.exports = products;
