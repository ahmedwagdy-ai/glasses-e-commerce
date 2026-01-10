const users = [
    {
        name: 'Admin User',
        email: 'admin@glasses.com',
        password: '123456', // Seeder will hash this
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        isAdmin: false,
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: '123456',
        isAdmin: false,
    },
];

module.exports = users;
